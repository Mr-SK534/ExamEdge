const pool = require("../config/db");

exports.saveMockHistory = async (req, res) => {
  try {
    const user = req.user;
    const { mock_name, score, total_marks } = req.body;

    if (!mock_name || score == null || total_marks == null) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const accuracy = ((score / total_marks) * 100).toFixed(2);

    const query = `
      INSERT INTO mock_history (user_id, mock_name, score, total_marks, accuracy)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    const values = [user.id, mock_name, score, total_marks, accuracy];
    const result = await pool.query(query, values);

    return res.json({
      success: true,
      message: "Mock history saved successfully",
      data: result.rows[0],
    });

  } catch (error) {
    console.error("Mock history save error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMockHistory = async (req, res) => {
  try {
    const user = req.user;

    const query = `
      SELECT * FROM mock_history
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [user.id]);

    return res.json({
      success: true,
      history: result.rows,
    });

  } catch (error) {
    console.error("Get mock history error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

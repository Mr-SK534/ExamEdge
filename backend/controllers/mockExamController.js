const fs = require("fs");
const path = require("path");

// ✓ Exam folder mapping (fixes VITEEE issue + case insensitivity)
const examFolderMap = {
  jee: "jee",
  "jee main": "jee",
  "jee mains": "jee",
  "jee advanced": "jee",

  neet: "neet",
  "neet ug": "neet",

  bitsat: "bitsat",

  viteee: "viteee",
  vit: "viteee",       // <-- important fix
  "vit exam": "viteee"
};

// ---------------------------
//   LIST AVAILABLE MOCKS
// ---------------------------
exports.listMocks = (req, res) => {
  try {
    let exam = (req.query.exam || "").toLowerCase();

    // Map to correct folder name
    exam = examFolderMap[exam] || exam;

    const folder = path.join(__dirname, "..", "mock-data", exam);
    console.log("📂 Looking for:", folder);

    if (!fs.existsSync(folder)) {
      console.log("❌ Folder not found:", folder);
      return res.json({ success: true, mocks: [] });
    }

    const files = fs.readdirSync(folder).filter(f => f.endsWith(".json"));

    const mocks = files.map(f => ({
      id: f.replace(".json", ""),
      name: f.replace(".json", "").toUpperCase(),
    }));

    return res.json({ success: true, mocks });

  } catch (err) {
    console.error("❌ LIST ERROR:", err);
    res.status(500).json({ success: false });
  }
};

// ---------------------------
//   LOAD MOCK BY ID
// ---------------------------
exports.loadMock = (req, res) => {
  try {
    let { exam, id } = req.params;

    exam = exam.toLowerCase();
    exam = examFolderMap[exam] || exam;

    const filePath = path.join(
      __dirname,
      "..",
      "mock-data",
      exam,
      `${id}.json`
    );

    console.log("📂 Load mock:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Mock not found: " + filePath
      });
    }

    const data = fs.readFileSync(filePath, "utf8");
    res.json({ success: true, mock: JSON.parse(data) });

  } catch (err) {
    console.error("❌ LOAD ERROR:", err);
    res.status(500).json({ success: false });
  }
};

const supabase = require('../config/supabase');

exports.getStreak = async (userId) => {
  const { data, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

exports.updateStreak = async (userId, completedAll) => {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  const { data: streakRow } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  // NEW USER — no streak yet
  if (!streakRow) {
    const newValue = completedAll ? 1 : 0;

    await supabase.from('streaks').insert({
      user_id: userId,
      streak: newValue,
      last_completed: completedAll ? today : null,
      updated_at: new Date().toISOString()
    });

    return newValue;
  }

  // Already completed today — no change
  if (streakRow.last_completed === today) {
    return streakRow.streak;
  }

  if (!completedAll) return streakRow.streak;

  // Completed today → update streak
  const newStreak =
    streakRow.last_completed === yesterday ? streakRow.streak + 1 : 1;

  await supabase
    .from('streaks')
    .update({
      streak: newStreak,
      last_completed: today,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return newStreak;
};

const supabase = require('../config/supabase');

exports.savePlan = async (userId, planObj) => {
  const { data, error } = await supabase
    .from('daily_plans')
    .upsert({
      user_id: userId,
      date: new Date().toISOString().slice(0, 10),
      plan_json: planObj,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,date' })
    .select()
    .single();

  if (error) throw error;
  return data;
};

exports.getTodayPlan = async (userId) => {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (error) throw error;
  return data;
};

exports.updatePlan = async (userId, planObj) => {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from('daily_plans')
    .update({
      plan_json: planObj,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .eq('date', today)
    .select()
    .single();

  if (error) throw error;
  return data;
};

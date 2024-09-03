require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabaseConfig');

// const { createClient } = require('@supabase/supabase-js');
// const supabaseUrl = process.env.supabaseUrl;
// const supabaseKey = process.env.supabaseKey;
// const supabase = createClient(supabaseUrl, supabaseKey);

const User = {
  create: async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{username, email, password: hashedPassword }]);
    return { data, error };
  },
  
  findByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  verifyEmail: async(email) => {
    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('email', email);
    return { data, error };
  }
};

module.exports = User;

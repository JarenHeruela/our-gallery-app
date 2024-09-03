// config/passportConfig.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const supabase = require('./supabaseConfig');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { email, name, picture } = profile._json;

      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!user) {
        const { data, error } = await supabase.from('users').insert([
          {
            email: email,
            name: name,
            avatar_url: picture,
            is_verified: false, // Email verification status
          },
        ]);

        if (error) {
          return done(error, null);
        }

        user = data[0];
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  done(error, user);
});

module.exports = passport;

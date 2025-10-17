import passport from 'passport';
import { GoogleUser } from '../controllers/AuthController';
passport.initialize()
passport.session()
var GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
    new GoogleStrategy(
        {
            type: 'authorized_user',
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            redirect_uri:process.env.FRONTEND_URL!,
            scope:['profile','email']
        },
        function verify( accessToken, refreshToken, profile, cb) {
            const user:GoogleUser = {
                displayName: profile.displayName,
                email: profile.emails[0].value,
            };
            return cb(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
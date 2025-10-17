"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
passport_1.default.initialize();
passport_1.default.session();
var GoogleStrategy = require('passport-google-oauth20').Strategy;
passport_1.default.use(new GoogleStrategy({
    type: 'authorized_user',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    redirect_uri: process.env.FRONTEND_URL,
    scope: ['profile', 'email']
}, function verify(accessToken, refreshToken, profile, cb) {
    const user = {
        displayName: profile.displayName,
        email: profile.emails[0].value,
    };
    return cb(null, user);
}));
passport_1.default.serializeUser((user, done) => done(null, user));
passport_1.default.deserializeUser((user, done) => done(null, user));
exports.default = passport_1.default;
//# sourceMappingURL=passportConfig.js.map
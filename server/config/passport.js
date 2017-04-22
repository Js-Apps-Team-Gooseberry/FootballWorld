/* globals module require */

module.exports = (app, data) => {
    const JwtStrategy = require('passport-jwt').Strategy,
        ExtractJwt = require('passport-jwt').ExtractJwt,
        config = require('./env-variables.js'),
        passport = require('passport');

    let options = {
        jwtFromRequest: ExtractJwt.fromAuthHeader(),
        secretOrKey: config.jwtSecretKey
    };

    let jwtStrategy = new JwtStrategy(options, (jwt_payload, done) => {
        data.findUserById(jwt_payload._doc._id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => done(err, false));
    });

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user._id);
        }
    });

    passport.deserializeUser((userId, done) => {
        data
            .findUserById(userId)
            .then(user => done(null, user || false))
            .catch(error => done(error, false));
    });

    passport.use(jwtStrategy);

    app.use(passport.initialize());
};
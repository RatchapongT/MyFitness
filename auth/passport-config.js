module.exports = function () {
    var passport = require('passport');
    var passportLocal = require('passport-local');
    var databaseFunctions = require('../database-services/users');
    passport.use(new passportLocal.Strategy({usernameField: 'username', passwordField: 'password'}, function (username, password, next) {
        username = username.toUpperCase();
        databaseFunctions.findUser({username: username, password: password}, function (err, userObject) {
            if (err) {
                return next(err, null);
            }
            if (!userObject) {
                return next(null, null);

            } else {
                var serializeObject = {
                    username: userObject.username,
                    _id: userObject._id
                };
                return next(null, serializeObject);
            }
        });
    }));

    passport.serializeUser(function (serializeObject, next) {
        next(null, serializeObject);
    });

    passport.deserializeUser(function (userObject, next) {
        next(null, userObject);
    });
};
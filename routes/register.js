var express = require('express');
var router = express.Router();
var databaseFunctions = require('../database-services/users');
var passport = require('passport');
var config = require('../config');
router.get('/register', function (req, res, next) {
    if (req.user) {
        return res.redirect('/homepage');
    }
    return res.render('register', {title: 'Register'});
});

router.post('/login', function (req, res, next) {
        req.session.cookie.maxAge = config.cookieMaxAge;
        return next();
    },
    function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({
                    message: 'Invalid Credentials',
                    statusCode: 2
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.json({
                    message: 'Success',
                    statusCode: 1
                });
            });
        })(req, res, next);
    }
);

router.post('/register', function (req, res, next) {
        req.session.cookie.maxAge = config.cookieMaxAge;
        return next();
    },
    function (req, res, next) {
        databaseFunctions.registerUser(req, function(err) {
            if (err) {
                var message = err.code == 11000 ? 'Username Already Exists' : err.message;
                return res.json({
                    message: message,
                    statusCode: 2
                });
            }
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }
                    return res.json({
                        message: 'Success',
                        statusCode: 1
                    });
                });
            })(req, res, next);
        });
    }
);

//databaseFunctions.registerUser(req, function(err) {
//    if (err) {
//        var message = err.code == 11000 ? 'Username Already Exists' : err.message;
//        return res.json({
//            message: message,
//            statusCode: 2
//        });
//    }
//    return res.json({
//        message: 'Registered',
//        statusCode: 1
//    });
//});
module.exports = router;

var express = require('express');
var router = express.Router();

var passport = require('passport');
var config = require('../config');

router.get('/', function (req, res, next) {
    if (req.user) {
        return res.redirect('/homepage');
    }
    return res.render('login', {title: 'Login'});
});


router.get('/login', function (req, res, next) {
    if (req.user) {
        return res.redirect('/homepage');
    }
    return res.render('login', {title: 'Login'});
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


router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

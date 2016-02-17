var express = require('express');
var router = express.Router();
var databaseFunctions = require('../database-services/users');

router.get('/register', function (req, res, next) {
    if (req.user) {
        return res.redirect('/homepage');
    }
    return res.render('register', {title: 'Register'});
});


router.post('/register', function (req, res) {
    databaseFunctions.registerUser(req, function(err) {
       if (err) {
           var message = err.code == 11000 ? 'Username Already Exists' : err.message;
           return res.json({
               message: message,
               statusCode: 2
           });
       }
        return res.json({
            message: 'Registered',
            statusCode: 1
        });
    });
});


module.exports = router;

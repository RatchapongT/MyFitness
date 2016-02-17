var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/homepage', function (req, res, next) {
    var vm = {
        title: 'Homepage',
        currentUser: req.user.username
    };
    return res.render('homepage', vm);
});

module.exports = router;

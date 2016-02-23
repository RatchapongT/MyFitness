var User = require('../database-models/databaseModels').User;
var Increment = require('../database-models/databaseModels').Increment;
/*
 [READ]
 Find user used by authorization
 */
exports.findUser = function (query, next) {
    User.findOne(query, function (err, user) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, user);
        }
    });
};

/*
 [READ]
 Find user to login
 */
exports.registerUser = function (req, next) {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password

    });
    newUser.save(function (err) {
        var newIncrement = new Increment({
            _userDetail: newUser._id,
            index: 0
        });
        newIncrement.save(function (err) {
            return next(err);
        });
    });

};


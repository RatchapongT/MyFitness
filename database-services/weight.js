var Weight = require('../database-models/databaseModels').Weight;


exports.findAllWeight = function (req, next) {
    Weight.find({_userDetail: req.user._id}, function (err, weightObjects) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, weightObjects);
        }
    })
};

exports.addWeight = function (req, next) {
    if (req.body.meal == 'beforeMeal') {
        var newWeight = new Weight({
            _userDetail: req.user._id,
            weight: req.body.weight,
            cloth: req.body.cloth,
            afterMeal: false,
            beforeMeal: true
        });
    } else if (req.body.meal == 'afterMeal') {
        var newWeight = new Weight({
            _userDetail: req.user._id,
            weight: req.body.weight,
            cloth: req.body.cloth,
            afterMeal: true,
            beforeMeal: false
        });
    }


    newWeight.save(function (err) {
        return next(err);
    })
};
exports.deleteWeight = function (req, next) {
    Weight.findOne({_id: req.params._id}, function (err, weightObject) {
        if (err) {
            return next(err);
        }
        if (weightObject) {
            weightObject.remove(function (err) {
                return next(err);
            });
        } else {
            return next({message: 'Object Not Found'})
        }
    })
};

var Cardio = require('../database-models/databaseModels').Cardio;


exports.findAllCardio = function (req, next) {
    Cardio.find({_userDetail: req.user._id}, function (err, cardioObjects) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, cardioObjects);
        }
    })
};

exports.addCardio = function (req, next) {
    var newCardio = new Cardio({
        _userDetail: req.user._id,
        cardioName: req.body.cardioName,
        miles: req.body.miles,
        calories: req.body.calories,
        roundPerMinute: req.body.roundPerMinute,
        averageSpeed: req.body.averageSpeed,
        duration: req.body.duration
    });
    newCardio.save(function (err) {
        return next(err);
    })
};
exports.deleteCardio = function (req, next) {
    Cardio.findOne({_id: req.params._id}, function (err, cardioObject) {
        if (err) {
            return next(err);
        }
        if (cardioObject) {
            cardioObject.remove(function (err) {
                return next(err);
            });
        } else {
            return next({message: 'Object Not Found'})
        }
    })
};

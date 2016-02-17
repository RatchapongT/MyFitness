var Workout = require('../database-models/databaseModels').Workout;


exports.findAllWorkout = function (req, next) {
    Workout.find({_userDetail: req.user._id}, function (err, workoutObjects) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, workoutObjects);
        }
    })
};

exports.addWorkout = function (req, next) {
    var newWorkout = new Workout({
        _userDetail: req.user._id,
        workoutName: req.body.workoutName,
        rep: req.body.rep,
        weight: req.body.weight,
    });
    newWorkout.save(function (err) {
        return next(err);
    })
};
exports.deleteWorkout = function (req, next) {
    Workout.findOne({_id: req.params._id}, function (err, workoutObject) {
        if (err) {
            return next(err);
        }
        if (workoutObject) {
            workoutObject.remove(function (err) {
                return next(err);
            });
        } else {
            return next({message: 'Object Not Found'})
        }
    })
};

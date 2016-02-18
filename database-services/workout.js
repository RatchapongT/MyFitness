var Workout = require('../database-models/databaseModels').Workout;
var _ = require('underscore')

exports.findAllWorkout = function (req, next) {
    Workout.find({_userDetail: req.user._id}).sort({timestamp: 1}).exec(function (err, workoutObjects) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, workoutObjects);
        }
    })
};

exports.createExercise = function (req, next) {
    var superset = [];
    for (var i = 1; i <= parseInt(req.body.superset); i++) {
        superset.push({
            workoutName: req.body['exercise' + i],
            workoutSet: [{
                rep: 0,
                weight: 0,
                timestamp: new Date()
            }]
        })
    }
    var newWorkout = new Workout({
        _userDetail: req.user._id,
        superset: superset
    });
    newWorkout.save(function (err) {
        return next(err);
    })
};

exports.addSet = function (req, next) {
    Workout.findOne({_id: req.body._id}, function (err, workObject) {

        var newSuperset = _.clone(workObject.superset);
        _.each(newSuperset, function (superset) {
            superset.workoutSet.push({
                rep: 0,
                weight: 0,
                timestamp: new Date()
            })
        });
        Workout.update({_id: req.body._id}, {
            $set: {
                superset: newSuperset
            }
        }, function (err) {
            if (err) {
                return next(err);
            } else {
                return next(null);
            }

        })
    });


};

exports.deleteSet = function (req, next) {
    Workout.findOne({_id: req.body._id}, function (err, workObject) {

        var newSuperset = _.clone(workObject.superset);
        var removeWorkout = false;
        _.each(newSuperset, function (superset) {
            superset.workoutSet.splice(req.body.index, 1);
            if (superset.workoutSet.length == 0) {
                removeWorkout = true;
            }
        });
        if (removeWorkout) {
            Workout.findOne({_id: req.body._id}, function (err, workoutObject) {
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
        } else {
            Workout.update({_id: req.body._id}, {
                $set: {
                    superset: newSuperset
                }
            }, function (err, result) {
                if (err) {
                    return next(err);
                } else {
                    console.log(result);
                    return next(null);
                }

            })
        }
    });


};

exports.editSet = function (req, next) {

    Workout.findOne({_id: req.body._id}, function (err, workObject) {
        var newSuperset = _.clone(workObject.superset);
        for (var i = 0; i < newSuperset.length; i++) {
            newSuperset[i].workoutSet[req.body.index].rep = req.body.rep[i];
            newSuperset[i].workoutSet[req.body.index].weight = req.body.weight[i];

        }
        Workout.update({_id: req.body._id}, {
            $set: {
                superset: newSuperset
            }
        }, function (err) {
            if (err) {
                return next(err);
            } else {
                return next(null);
            }

        })
    });


};


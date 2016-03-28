'use strict'
var Workout = require('../database-models/databaseModels').Workout;
var Increment = require('../database-models/databaseModels').Increment;
var _ = require('underscore');
var moment = require('moment');
var async = require('async');
exports.findAllWorkout = function (req, next) {
    var sDate = req.params.startDate ? req.params.startDate : moment(req.body.date).startOf('day').valueOf();
    var eDate = req.params.endDate ? req.params.endDate : moment(req.body.date).endOf('day').valueOf();

    Workout.find({
        _userDetail: req.user._id,
        timestamp: {$gte: sDate, $lt: eDate}
    }).sort({timestamp: 1}).exec(function (err, workoutObjects) {
        if (err) {
            return next(err, null);
        } else {
            return next(null, workoutObjects);
        }
    })
};

exports.createPredeterminedExercise = function (req, next) {
    var exercise = [];
    if (req.body.id == 1) {
        exercise = [
            {
                superset: [
                    {
                        workOutName: 'Barbell Bench Press',
                        setRep: [30, 10, 10, 10, 10, 5]
                    },

                    {
                        workOutName: 'Wide Grip Chin Up',
                        setRep: [10, 10, 10, 10, 10, 10]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Barbell Incline Bench Press',
                        setRep: [8, 8, 8, 8, 8]
                    },

                    {
                        workOutName: 'T Bar Row',
                        setRep: [8, 8, 8, 8, 8]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Fly',
                        setRep: [12, 12, 12, 12, 12]
                    },

                    {
                        workOutName: 'Cable Seated Row',
                        setRep: [12, 12, 12, 12, 12]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dip',
                        setRep: [10, 10, 10, 10]
                    },

                    {
                        workOutName: 'Close Grip Chin Up',
                        setRep: [10, 10, 10, 10]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Bent Arm Pullover',
                        setRep: [12, 12, 12]
                    },

                    {
                        workOutName: 'Cable Cross Over',
                        setRep: [12, 12, 12]
                    }
                ]
            }

        ];
    }
    if (req.body.id == 2) {
        exercise = [
            {
                superset: [
                    {
                        workOutName: 'Barbell Squat',
                        setRep: [12, 12, 12, 12, 12, 12, 12, 12]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Leg Extensions',
                        setRep: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                    },

                    {
                        workOutName: 'Seated Leg Curl',
                        setRep: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Standing Calf Raises',
                        setRep: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
                    }
                ]
            }

        ];
    }
    if (req.body.id == 3) {
        exercise = [
            {
                superset: [
                    {
                        workOutName: 'Barbell Curl',
                        setRep: [12, 12, 12, 12, 12]
                    },
                    {
                        workOutName: 'Skullcrusher',
                        setRep: [15, 15, 15, 15, 15]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Hammer Curls',
                        setRep: [12, 12, 12, 12, 12]
                    },

                    {
                        workOutName: 'Cable Straight Arm Push Down',
                        setRep: [20, 20, 20, 20, 20]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Alternate Incline Curl',
                        setRep: [6, 6, 6]
                    },

                    {
                        workOutName: 'Cable Rope Overhead Triceps Extension',
                        setRep: [15, 15, 15]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Concentration Curls',
                        setRep: [12, 12, 12]
                    },

                    {
                        workOutName: 'Dumbbell Tricep Kickback',
                        setRep: [12, 12, 12]
                    }
                ]
            }


        ];
    }
    if (req.body.id == 4) {
        exercise = [
            {
                superset: [
                    {
                        workOutName: 'Barbell Shoulder Press',
                        setRep: [6, 6, 6, 6]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Arnold Press',
                        setRep: [10, 8, 6, 6, 8]
                    },

                    {
                        workOutName: 'Barbell Up Right Row',
                        setRep: [10, 10, 10, 10, 10]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Lateral Raise',
                        setRep: [12, 12, 12]
                    },

                    {
                        workOutName: 'Dumbbell Bent Over Delt Raise',
                        setRep: [12, 12, 12]
                    }
                ]
            }


        ];
    }

    if (req.body.id == 5) {
        exercise = [
            {
                superset: [
                    {
                        workOutName: 'Decline Bench Sit-Up',
                        setRep: [1]
                    },

                    {
                        workOutName: 'Deadlift',
                        setRep: [10, 8, 6]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Barbell Incline Bench Press',
                        setRep: [15, 12, 8, 5, 3]
                    },

                    {
                        workOutName: 'Weighted Chin-Up',
                        setRep: [15, 12, 8, 5, 3]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Barbell Bench Press',
                        setRep: [12, 12, 8, 6]
                    },

                    {
                        workOutName: 'Chin-up',
                        setRep: [99, 99, 99, 99]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell Fly',
                        setRep: [28, 28, 28, 28]
                    },

                    {
                        workOutName: 'Bent-Over Dumbbell Row',
                        setRep: [12, 12, 12, 12]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dip',
                        setRep: [10, 10, 10, 10]
                    },

                    {
                        workOutName: 'Close-grip chin-up',
                        setRep: [10, 10, 10, 10]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Dumbbell pull-over',
                        setRep: [15, 15, 15, 15, 15]
                    },

                    {
                        workOutName: 'Dip',
                        setRep: [99, 99, 99, 99, 99]
                    },
                    {
                        workOutName: 'Cable cross-over',
                        setRep: [15, 15, 15, 15, 15]
                    }
                ]
            },
            {
                superset: [
                    {
                        workOutName: 'Hanging straight-leg raise',
                        setRep: [20]
                    },

                    {
                        workOutName: 'Hanging knee-up',
                        setRep: [20]
                    },
                    {
                        workOutName: 'Crunch',
                        setRep: [50]
                    },
                    {
                        workOutName: 'Seated leg tuck',
                        setRep: [30]
                    }
                    ,
                    {
                        workOutName: 'Stick Twist',
                        setRep: [100]
                    }
                ]
            }


        ];
    }
    var date = new Date();
    async.each(exercise,
        function (ex, callback) {
            var array = [];

            _.each(ex.superset, function (superset) {
                var workoutSet = [];
                _.each(superset.setRep, function (rep) {
                    workoutSet.push({
                        rep: rep
                    })
                });
                array.push({
                    workoutName: superset.workOutName,
                    workoutSet: workoutSet
                })
            });
            Increment.findOneAndUpdate({_userDetail: req.user._id}, {$inc: {index: 1}}, {new: true}, function (err, incrementObject) {
                var selectedDate = new Date(req.body.date);
                date.setDate(selectedDate.getDate());
                date.setMonth(selectedDate.getMonth());
                date.setYear(selectedDate.getFullYear());
                var newWorkout = new Workout({
                    timestamp: date,
                    _userDetail: req.user._id,
                    index: incrementObject.index,
                    superset: array
                });
                newWorkout.save(function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }

                })
            })
        },
        function (err) {
            if (err) {
                return next(err);
            } else {
                return next(null);
            }

        }
    );

};

exports.createExercise = function (req, next) {
    var superset = [];
    var date = new Date();
    var selectedDate = new Date(req.body.date);

    date.setDate(selectedDate.getDate());
    date.setMonth(selectedDate.getMonth());
    date.setYear(selectedDate.getFullYear());

    for (var i = 1; i <= parseInt(req.body.superset); i++) {
        superset.push({
            workoutName: toTitleCase(req.body['exercise' + i]),
            workoutSet: [{
                rep: 0,
                weight: 0,
                timestamp: new Date()
            }]
        })
    }
    Increment.findOneAndUpdate({_userDetail: req.user._id}, {$inc: {index: 1}}, {new: true}, function (err, incrementObject) {

        if (err) {
            console.log(err);
        } else {
            var newWorkout = new Workout({
                timestamp: date,
                _userDetail: req.user._id,
                index: incrementObject.index,
                superset: superset
            });
            newWorkout.save(function (err) {
                return next(err);
            })
        }

    });
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

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}


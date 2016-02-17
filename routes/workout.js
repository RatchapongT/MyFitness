var express = require('express');
var router = express.Router();
var databaseFunctions = require('../database-services/workout');

router.get('/workout', function (req, res, next) {
    var vm = {
        title: 'Workout',
        currentUser: req.user.username
    };
    return res.render('workout', vm);
});

//Retrieve Edit Users Profiles List
router.get('/workout/api/get/', function (req, res) {
    return getWorkoutObjects(req, res);
});

router.post('/workout/api/add/', function (req, res) {
    databaseFunctions.addWorkout(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Added', 1);
    });
});

router.delete('/workout/api/delete/:_id', function (req, res) {
    databaseFunctions.deleteWorkout(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Added', 1);
    });
});

function getWorkoutObjects(req, res, message, statusCode) {
    databaseFunctions.findAllWorkout(req, function (err, workoutObjects) {
        if (err) {
            return res.send(err);
        }
        return res.json({
            workoutObjects: workoutObjects,
            statusCode: statusCode,
            message: message,
            currentUser: req.user.username
        });
    });
}

module.exports = router;

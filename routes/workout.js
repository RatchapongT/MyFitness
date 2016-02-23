
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
router.get('/workout/api/get/:startDate/:endDate', function (req, res) {
    return getWorkoutObjects(req, res);
});

router.post('/exercise/api/create/', function (req, res) {
    databaseFunctions.createExercise(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Created', 1);
    });
});

router.post('/exercise/api/create-predetermined/', function (req, res) {
    databaseFunctions.createPredeterminedExercise(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Created', 1);
    });
});

router.post('/set/api/add/', function (req, res) {
    databaseFunctions.addSet(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Added', 1);
    });
});
router.post('/set/api/delete/', function (req, res) {
    databaseFunctions.deleteSet(req, function (err) {
        if (err) {
            return getWorkoutObjects(req, res, err.message, 2);
        }
        return getWorkoutObjects(req, res, 'Successfully Added', 1);
    });
});

router.post('/set/api/edit/', function (req, res) {
    databaseFunctions.editSet(req, function (err) {
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
            console.log(err);
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

var express = require('express');
var router = express.Router();
var databaseFunctions = require('../database-services/weight');

router.get('/weight', function (req, res, next) {
    var vm = {
        title: 'Weight',
        currentUser: req.user.username
    };
    return res.render('weight', vm);
});

//Retrieve Edit Users Profiles List
router.get('/weight/api/get/', function (req, res) {
    return getWeightObjects(req, res);
});

router.post('/weight/api/add/', function (req, res) {
    databaseFunctions.addWeight(req, function (err) {
        if (err) {
            return getWeightObjects(req, res, err.message, 2);
        }
        return getWeightObjects(req, res, 'Successfully Added', 1);
    });
});

router.delete('/weight/api/delete/:_id', function (req, res) {
    databaseFunctions.deleteWeight(req, function (err) {
        if (err) {
            return getWeightObjects(req, res, err.message, 2);
        }
        return getWeightObjects(req, res, 'Successfully Added', 1);
    });
});

function getWeightObjects(req, res, message, statusCode) {
    databaseFunctions.findAllWeight(req, function (err, weightObjects) {
        if (err) {
            return res.send(err);
        }
        return res.json({
            weightObjects: weightObjects,
            statusCode: statusCode,
            message: message,
            currentUser: req.user.username
        });
    });
}

module.exports = router;

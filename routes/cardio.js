var express = require('express');
var router = express.Router();
var databaseFunctions = require('../database-services/cardio');

router.get('/cardio', function (req, res, next) {
    var vm = {
        title: 'Cardio',
        currentUser: req.user.username
    };
    return res.render('cardio', vm);
});

//Retrieve Edit Users Profiles List
router.get('/cardio/api/get/', function (req, res) {
    return getCardioObjects(req, res);
});

router.post('/cardio/api/add/', function (req, res) {
    databaseFunctions.addCardio(req, function (err) {
        if (err) {
            return getCardioObjects(req, res, err.message, 2);
        }
        return getCardioObjects(req, res, 'Successfully Added', 1);
    });
});

router.delete('/cardio/api/delete/:_id', function (req, res) {
    databaseFunctions.deleteCardio(req, function (err) {
        if (err) {
            return getCardioObjects(req, res, err.message, 2);
        }
        return getCardioObjects(req, res, 'Successfully Added', 1);
    });
});

function getCardioObjects(req, res, message, statusCode) {
    databaseFunctions.findAllCardio(req, function (err, cardioObjects) {
        if (err) {
            return res.send(err);
        }
        return res.json({
            cardioObjects: cardioObjects,
            statusCode: statusCode,
            message: message,
            currentUser: req.user.username
        });
    });
}

module.exports = router;

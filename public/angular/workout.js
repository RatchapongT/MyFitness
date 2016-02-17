angular.module('workoutApp', ['workoutControllers']);

var workoutControllers = angular.module('workoutControllers', []);
workoutControllers.controller('workoutControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.sortType = 'timestamp';
    $scope.workoutLoading = true;
    $scope.workoutStatusCode = 0;
    $scope.workoutMessage = '';

    $scope.workoutData = {};
    $scope.workoutData.workout = 0;
    $scope.workoutData.cloth = false;
    $scope.workoutData.meal = 'beforeMeal';
    $http.get('/workout/api/get/').success(function (data) {
        $scope.workoutObjects = data.workoutObjects;
        $scope.workoutStatusCode = data.statusCode;
        $scope.workoutMessage = data.message;
        $scope.workoutLoading = false;
    });

    $scope.addWorkout = function () {
        $scope.workoutLoading = true;
        $scope.workoutStatusCode = 0;
        $scope.workoutMessage = '';
        $http.post('/workout/api/add', $scope.workoutData).success(function (data) {
            $scope.workoutLoading = false;
            $scope.workoutStatusCode = data.statusCode;
            $scope.workoutMessage = data.message;
            $scope.workoutObjects = data.workoutObjects;
        });
    }

    $scope.deleteWorkout = function (workoutObject) {

        $scope.workoutLoading = true;
        $scope.workoutStatusCode = 0;
        $scope.workoutMessage = '';
        $http.delete('/workout/api/delete/' + workoutObject._id).success(function (data) {
            $scope.workoutLoading = false;
            $scope.workoutStatusCode = data.statusCode;
            $scope.workoutMessage = data.message;
            $scope.workoutObjects = data.workoutObjects;
        });
    }

    $scope.formatDate = function (inputDate) {
        var m = moment(inputDate);
        return m.format('MMMM Do YYYY, h:mm:ss a');
    }
}]);
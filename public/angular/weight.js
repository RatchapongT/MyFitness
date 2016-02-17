angular.module('weightApp', ['weightControllers']);

var weightControllers = angular.module('weightControllers', []);
weightControllers.controller('weightControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.sortType = 'timestamp';
    $scope.weightLoading = true;
    $scope.weightStatusCode = 0;
    $scope.weightMessage = '';

    $scope.weightData = {};
    $scope.weightData.weight = 0;
    $scope.weightData.cloth = false;
    $scope.weightData.meal = 'beforeMeal';
    $http.get('/weight/api/get/').success(function (data) {
        $scope.weightObjects = data.weightObjects;
        $scope.weightStatusCode = data.statusCode;
        $scope.weightMessage = data.message;
        $scope.weightLoading = false;
    });

    $scope.addWeight = function () {
        $scope.weightLoading = true;
        $scope.weightStatusCode = 0;
        $scope.weightMessage = '';
        $http.post('/weight/api/add', $scope.weightData).success(function (data) {
            $scope.weightLoading = false;
            $scope.weightStatusCode = data.statusCode;
            $scope.weightMessage = data.message;
            $scope.weightObjects = data.weightObjects;
        });
    }

    $scope.deleteWeight = function (weightObject) {

        $scope.weightLoading = true;
        $scope.weightStatusCode = 0;
        $scope.weightMessage = '';
        $http.delete('/weight/api/delete/' + weightObject._id).success(function (data) {
            $scope.weightLoading = false;
            $scope.weightStatusCode = data.statusCode;
            $scope.weightMessage = data.message;
            $scope.weightObjects = data.weightObjects;
        });
    }
    $scope.formatDate = function (inputDate) {
        var m = moment(inputDate);
        return m.format('MMMM Do YYYY, h:mm:ss a');
    }
}]);
angular.module('cardioApp', ['cardioControllers']);

var cardioControllers = angular.module('cardioControllers', []);
cardioControllers.controller('cardioControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.shortDateFormat = 'MMMM Do YYYY, h:mm:ss a';
    $scope.sortType = 'timestamp';
    $scope.cardioLoading = true;
    $scope.cardioStatusCode = 0;
    $scope.cardioMessage = '';

    $scope.cardioData = {};
    $scope.cardioData.cardio = 0;
    $scope.cardioData.cloth = false;
    $scope.cardioData.meal = 'beforeMeal';
    $http.get('/cardio/api/get/').success(function (data) {
        $scope.cardioObjects = data.cardioObjects;
        $scope.cardioStatusCode = data.statusCode;
        $scope.cardioMessage = data.message;
        $scope.cardioLoading = false;
    });

    $scope.addCardio = function () {
        $scope.cardioLoading = true;
        $scope.cardioStatusCode = 0;
        $scope.cardioMessage = '';
        $http.post('/cardio/api/add', $scope.cardioData).success(function (data) {
            $scope.cardioLoading = false;
            $scope.cardioStatusCode = data.statusCode;
            $scope.cardioMessage = data.message;
            $scope.cardioObjects = data.cardioObjects;
        });
    }

    $scope.deleteCardio = function (cardioObject) {

        $scope.cardioLoading = true;
        $scope.cardioStatusCode = 0;
        $scope.cardioMessage = '';
        $http.delete('/cardio/api/delete/' + cardioObject._id).success(function (data) {
            $scope.cardioLoading = false;
            $scope.cardioStatusCode = data.statusCode;
            $scope.cardioMessage = data.message;
            $scope.cardioObjects = data.cardioObjects;
        });
    }

    $scope.formatDate = function (inputDate) {
        var m = moment(inputDate);
        return m.format('MMMM Do YYYY, h:mm:ss a');
    }
}]);
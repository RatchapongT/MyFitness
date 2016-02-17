angular.module('loginApp', ['loginControllers']);

var loginControllers = angular.module('loginControllers', []);
loginControllers.controller('loginControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.loginLoading = false;
    $scope.loginStatusCode = 0;
    $scope.loginMessage = '';

    $scope.loginData = {};
    $scope.loginData.username = '';
    $scope.loginData.password = '';

    $scope.submitLogin = function () {
        $scope.loginLoading = true;
        $scope.loginStatusCode = 0;
        $scope.loginMessage = '';
        $http.post('/login', $scope.loginData).success(function (data) {
            $scope.loginLoading = false;
            $scope.loginStatusCode = data.statusCode;
            $scope.loginMessage = data.message;
            if (data.statusCode == 1) {
                $window.location.href = '/homepage';
            }
        });
    }


}]);
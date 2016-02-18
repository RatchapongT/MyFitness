angular.module('registerApp', ['registerControllers']);

var registerControllers = angular.module('registerControllers', []);
registerControllers.controller('registerControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {


    $scope.registerLoading = false;
    $scope.registerStatusCode = 0;
    $scope.registerMessage = '';

    $scope.registerData = {};
    $scope.registerData.username = '';
    $scope.registerData.password = '';
    $scope.registerData.confirmPassword = '';

    $scope.submitRegister = function () {
        $scope.registerLoading = true;
        $scope.registerStatusCode = 0;
        $scope.registerMessage = '';

        if ($scope.registerData.password != $scope.registerData.confirmPassword) {
            $scope.registerStatusCode = 2;
            $scope.registerMessage = 'Password Mismatch';
            $scope.registerLoading = false;
        } else {
            $http.post('/register', $scope.registerData).success(function (data) {
                $scope.registerLoading = false;
                $scope.registerStatusCode = data.statusCode;
                $scope.registerMessage = data.message;
                if (data.statusCode == 1) {
                    if (data.statusCode == 1) {
                        $window.location.href = '/homepage';
                    }
                }
            });
        }
    }

}]);
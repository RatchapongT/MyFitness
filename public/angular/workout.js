angular.module('workoutApp', ['workoutControllers']);

var workoutControllers = angular.module('workoutControllers', []);
workoutControllers.controller('workoutControllers', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.sortType = 'timestamp';
    $scope.exerciseLoading = false;
    $scope.exerciseStatusCode = 0;
    $scope.exerciseMessage = '';
    $scope.exerciseData = {};
    $scope.repData = {};
    $scope.weightData = {};
    $scope.exerciseData.superset = 1;
    $http.get('/workout/api/get/').success(function (data) {
        $scope.workoutObjects = data.workoutObjects;
        $scope.workoutStatusCode = data.statusCode;
        $scope.workoutMessage = data.message;
        $scope.workoutLoading = false;
    });
    $scope.createExercise = function () {
        $scope.exerciseLoading = true;
        $scope.exerciseStatusCode = 0;
        $scope.exerciseMessage = '';
        $http.post('/exercise/api/create', $scope.exerciseData).success(function (data) {
            $scope.exerciseLoading = false;
            $scope.exerciseStatusCode = data.statusCode;
            $scope.exerciseMessage = data.message;
            $scope.workoutObjects = data.workoutObjects;
        });
    };
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
    };

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
    };
    $scope.addSet = function (workoutObject) {
        $scope.addSetLoading = true;
        $http.post('/set/api/add', {_id: workoutObject._id}).success(function (data) {
            $scope.addSetLoading = false;
            $scope.workoutObjects = data.workoutObjects;
        });
    };

    $scope.deleteSet = function (workoutObject, index) {
        $scope.editSetLoading = true;
        $http.post('/set/api/delete', {_id: workoutObject._id, index: index}).success(function (data) {
            $scope.editSetLoading = false;
            $scope.workoutObjects = data.workoutObjects;
            $scope.showModal = false;
        });
    };
    $scope.editSet = function () {
        $scope.editSetLoading = true;
        $http.post('/set/api/edit', {_id: $scope.editSetObject._id, index: $scope.selectedIndex, rep: $scope.repData, weight: $scope.weightData}).success(function (data) {
            $scope.editSetLoading = false;
            $scope.workoutObjects = data.workoutObjects;
            $scope.showModal = false;
        });
    };
    $scope.toggleEdit = function (workoutObject, index) {
        $scope.showModal = !$scope.showModal;
        $scope.selectedIndex = index;
        for (var i = 0; i < workoutObject.superset.length; i++) {
            var currentSet = workoutObject.superset[i];
            for (var j = 0; j < currentSet.workoutSet.length; j++) {
                if (j == index) {
                    $scope.weightData[i] = currentSet.workoutSet[j].rep;
                    $scope.repData[i] = currentSet.workoutSet[j].weight;
                }
            }
        }
        $scope.editSetObject = workoutObject;
    };
    $scope.formatDate = function (inputDate) {
        var m = moment(inputDate);
        return m.format('MMMM Do YYYY, h:mm:ss a');
    }
}]);


workoutControllers.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog" style="width: 500px">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.$watch(attrs.visible, function (value) {
                if (value == true) {
                    $(element).modal('show');

                }
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});
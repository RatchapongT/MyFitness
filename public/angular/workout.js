angular.module('workoutApp', ['workoutControllers', 'ngMaterial', 'ngMessages']);


var workoutControllers = angular.module('workoutControllers', []);
workoutControllers.controller('workoutControllers', ['$scope', '$http', '$window', '$timeout', '$q', '$log', function ($scope, $http, $window, $timeout, $q, $log) {
    $scope.selectedDate = new Date();
    $('#dp3').datepicker({
        autoclose: true,
        todayHighlight: true
    });

    $('#dp3').datepicker()
        .on('changeDate', function(e) {
            $scope.selectedDate = e.date;
            $scope.exerciseLoading = true;
            var startDate = moment(e.date).startOf('day').valueOf();
            var endDate = moment(e.date).endOf('day').valueOf();

            $http.get('/workout/api/get/' + startDate + '/' + endDate).success(function (data) {
                $scope.workoutObjects = data.workoutObjects;
                $scope.workoutStatusCode = data.statusCode;
                $scope.workoutMessage = data.message;
                $scope.exerciseLoading = false;
            });
        });

    $scope.sortType = 'timestamp';
    $scope.exerciseLoading = true;
    $scope.exerciseStatusCode = 0;
    $scope.exerciseMessage = '';
    $scope.exerciseData = {};
    $scope.items = [
        {
            id: 1,
            label: 'Chest & Back (Phase 1)'
        }, {
            id: 2,
            label: 'Legs (Phase 1)'
        }, {
            id: 3,
            label: 'Arms (Phase 1)'
        }, {
            id: 4,
            label: 'Delts (Phase 1)'
        }, {
            id: 5,
            label: 'Chest & Back (Phase 2)'
        }
    ];

    $scope.selected = $scope.items[0];

    $scope.predetermined = {};
    $scope.addSetLoadingArray = [];
    $scope.repData = {};
    $scope.weightData = {};
    $scope.exerciseData.superset = 1;

    var startDate = moment().startOf('day').valueOf();
    var endDate = moment().endOf('day').valueOf();

   // moment().startOf(String);
    $http.get('/workout/api/get/' + startDate + '/' + endDate).success(function (data) {
        $scope.workoutObjects = data.workoutObjects;
        $scope.workoutStatusCode = data.statusCode;
        $scope.workoutMessage = data.message;
        $scope.exerciseLoading = false;
    });
    $scope.createExercise = function () {
        $scope.exerciseLoading = true;
        $scope.exerciseStatusCode = 0;
        $scope.exerciseMessage = '';
        $scope.exerciseData['exercise1'] = self.searchText1;
        $scope.exerciseData['exercise2'] = self.searchText2;
        $scope.exerciseData['exercise3'] = self.searchText3;
        $scope.exerciseData['exercise4'] = self.searchText4;
        $scope.exerciseData['date'] =$scope.selectedDate;

        $http.post('/exercise/api/create', $scope.exerciseData).success(function (data) {
            $scope.exerciseLoading = false;
            $scope.exerciseStatusCode = data.statusCode;
            $scope.exerciseMessage = data.message;
            $scope.workoutObjects = data.workoutObjects;
        });
    };
    $scope.submitExercise = function () {
        $scope.itemLoading = true;
        $scope.selected['date'] = $scope.selectedDate;
        $http.post('/exercise/api/create-predetermined', $scope.selected).success(function (data) {
            $scope.itemLoading = false;
            $scope.workoutObjects = data.workoutObjects;
        });
    };

    $scope.addSet = function (workoutObject, index) {
        $scope.addSetLoadingArray[index] = true;
        $http.post('/set/api/add', {_id: workoutObject._id}).success(function (data) {
            $scope.addSetLoadingArray[index] = false;
            $scope.workoutObjects = data.workoutObjects;
        });
    };

    $scope.deleteSet = function (workoutObject, index) {
        $scope.editSetLoading = true;
        $http.post('/set/api/delete', {
            _id: workoutObject._id,
            index: index
        }).success(function (data) {
            $scope.editSetLoading = false;
            $scope.workoutObjects = data.workoutObjects;
            $scope.showModal = false;
        });
    };
    $scope.editSet = function () {
        $scope.editSetLoading = true;
        $http.post('/set/api/edit', {
            _id: $scope.editSetObject._id,
            index: $scope.selectedIndex,
            rep: $scope.repData,
            weight: $scope.weightData
        }).success(function (data) {
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
                    $scope.weightData[i] = currentSet.workoutSet[j].weight;
                    $scope.repData[i] = currentSet.workoutSet[j].rep;
                }
            }
        }
        $scope.editSetObject = workoutObject;
    };
    $scope.formatDate = function (inputDate) {
        var m = moment(inputDate);
        var array = [];
        array.push(m.format('ddd, MMM Do YYYY'));
        array.push(m.format('h:mm:ss a'));
        return array;
    };


    var self = this;

    self.simulateQuery = false;
    self.isDisabled = false;

    // list of `state` value/display objects
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;


    function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states;
        return results;
    };


    function searchTextChange(text) {
        //$log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        //$log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
        var allStates = "Test";

        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {

        var lowercaseQuery = angular.lowercase(query);
        var res = lowercaseQuery.match(/\S+/g);

        return function filterFn(state) {

            for (var i = 0; i < res.length; i++) {
                if (state.value.indexOf(res[i]) < 0) {
                    return false;
                }
            }
            return true;
        };

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
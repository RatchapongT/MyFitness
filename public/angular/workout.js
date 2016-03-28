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
        var allStates = "1 Leg Pushup, 90 90 Hamstring, Ab Crunch Machine, Ab Draw Leg Slide, Abdominal Pendulum, Aerobics, Air Bike, All Fours Squad Stretch, Alternate Heel Touchers, Alternate Leg Bridge, Alternate Leg Diagonal Bound, Alternate Leg Reverse Hyper on Flat Bench, Alternate Reach and Catch, Alternating Arm Cobra, Ankle Circles, Ankle On The Knee, Arm Circles, Back Extension Machine, Back Extension on Exercise Ball, Back Relaxation, Band Back Fly, Band Back Flyes, Band Bench Press, Band Calf Raise, Band Calf Raises, Band Cross Over, Band Good Morning, Band Hip Lift, Band Lateral Raises, Band Shoulder Press, Band Speed Alternating Biceps Curl, Band Squat, Band Upright Row, Band Weighted Sit Up, Bands Seated Shoulder Press on Exercise Ball, Barbell 1/2 Squat, Barbell 1/4 Squat, Barbell Ab Rollout, Barbell Ab Rollout on Knees, Barbell Behind The Back Wrist Curl, Barbell Behind The Head Military Press, Barbell Bench Press, Barbell Bent Arm Pullover, Barbell Bent One Arm Row, Barbell Bent Over Row, Barbell Bent Over Two Arm Row, Barbell Bicep Curl with Deadlift, Barbell Bicep Drag Curl, Barbell Body Row, Barbell Bradford Rocky Press, Barbell Clean, Barbell Clean and Jerk, Barbell Clean Deadlift, Barbell Clean From Blocks, Barbell Clean Pull, Barbell Close Grip Bench Press, Barbell Close Grip Preacher Curl, Barbell Close Grip Press Behind the Neck, Barbell Close Grip Seated Concentration Curl, Barbell Close Grip Standing Curl, Barbell Concentration Curl, Barbell Curl, Barbell Curls Lying Against An Incline, Barbell Deadlift, Barbell Decline Bench Lunge, Barbell Decline Bench Press, Barbell Decline Pullover, Barbell Deep Squat, Barbell Drag Curl, Barbell EZ Bar Reverse Grip Curl, Barbell Floor Calf Raise, Barbell Frankenstein Squat, Barbell Front Raise, Barbell Front Raise and Pullover, Barbell Front Squat, Barbell Front Squat, Barbell Full Squat, Barbell Glute Bridge, Barbell Good Morning, Barbell Good Morning Off Pins, Barbell Hack Squat, Barbell Hang Clean, Barbell Hang Clean Below the Knees, Barbell Hang Snatch, Barbell Hang Snatch Below the Knees, Barbell Heaving Snatch Balance, Barbell High Front Raise, Barbell High Inverted Row, Barbell Hip Thrust, Barbell Incline Bench Press, Barbell Incline Bench Pull, Barbell Incline Bench Row, Barbell Incline Close Grip Bench Press, Barbell Incline Shoulder Raise, Barbell Jefferson Squat, Barbell Jerk Balance, Barbell Jerk Dip Squat, Barbell JM Press, Barbell Lateral Lunge, Barbell Lunge, Barbell Lying Back of the Head Tricep Extension, Barbell Lying Cambered Row, Barbell Lying Close Grip Triceps Press To Chin, Barbell Lying High Bench Biceps Curl, Barbell Lying Rear Delt Raise, Barbell Lying Reverse Extension, Barbell Lying Triceps Extension, Barbell Lying Triceps Press, Barbell Military Press Behind Neck, Barbell Muscle Snatch, Barbell Neck Press, Barbell Olympic Squat, Barbell One Arm Bent Over Row, Barbell One Arm Bicep Curl, Barbell One Arm Floor Press, Barbell One Arm Side Deadlift, Barbell One Arm Snatch, Barbell One Leg Squat, Barbell Overhead Squat, Barbell Palms Down Wrist Curl Over A Bench, Barbell Palms Up Wrist Curl Over A Bench, Barbell Power Clean from Blocks, Barbell Power Jerk, Barbell Power Snatch, Barbell Power Snatch From Blocks, Barbell Preacher Curl, Barbell Press on Exercise Ball, Barbell Press Sit Up, Barbell Pullover and Press, Barbell Push Press, Barbell Push Press Behind The Neck, Barbell Rack Delivery, Barbell Rack Pulls, Barbell Rear Delt Row, Barbell Rear Delt Row To Neck, Barbell Reverse Curl, Barbell Reverse Grip Bent Over Row, Barbell Reverse Grip Decline Bench Press, Barbell Reverse Grip Incline Bench Press, Barbell Reverse Grip Incline Bench Row, Barbell Reverse Grip Skullcrusher, Barbell Reverse Grip Triceps Extension, Barbell Reverse Preacher Curl, Barbell Reverse Preacher Curls, Barbell Reverse Triceps Bench Press, Barbell Reverse Wrist Curl Over Bench, Barbell Rocking Standing Calf Raise, Barbell Romanian Deadlift, Barbell Romanian Deadlift From Deficit, Barbell Round The World Shoulder Stretch, Barbell Seated Alternating Front and Back Press, Barbell Seated Calf Raise, Barbell Seated Front Raise, Barbell Seated Good Mornings, Barbell Seated High Front Raise, Barbell Seated Overhead Triceps Extension, Barbell Seated Palms Down Wrist Curl, Barbell Seated Palms Up Wrist Curl, Barbell Seated Press, Barbell Seated Reverse Wrist Curl, Barbell Seated Twist, Barbell Shoulder Press, Barbell Shrug, Barbell Shrugs Behind The Back, Barbell Side Bend, Barbell Side Split Squat, Barbell Single Leg Squat, Barbell Snatch, Barbell Snatch Balance, Barbell Snatch Deadlift, Barbell Snatch from Blocks, Barbell Snatch Pull, Barbell Snatch Shrug, Barbell Speed Squat, Barbell Spider Curl, Barbell Split Clean, Barbell Split Jerk, Barbell Split Jump, Barbell Squat, Barbell Squat Jerk, Barbell Squat To A Bench, Barbell Squat to Shoulder Press, Barbell Squat to Upright Row, Barbell Squat with Narrow Stance, Barbell Standing Alternating Front and Back Press, Barbell Standing Calf Raise, Barbell Standing Front Raise Over Head, Barbell Standing Military Press, Barbell Standing Overhead Triceps Extension, Barbell Standing Press Behind The Neck, Barbell Standing Wide Grip Biceps Curl, Barbell Step Ups, Barbell Stiff Leg Deadlift on Bench, Barbell Stiff-Legged Deadlift, Barbell Sumo Deadlift, Barbell Triceps Extension, Barbell Up Right Row, Barbell Wide Grip Bench Press, Barbell Wide Grip Decline Bench Press, Barbell Wide Grip Decline Pullover, Barbell Wide Reverse Grip Bench Press, Barbell Wide Stance Squat, Barbell Wide Stance Stiff Leg Deadlift, Barbell Zercher Squat, Barbell Zercher Squat, Behind Head Chest Stretch, Bench Twisting Crunch, Bench Dip, Bench Press Machine, Bench Pushups, Bent Knee Hip Raise, Bent Knee Hundreds, Bent Knee Side Angle Pose, Bicep Curl Machine, Boat Pose, Bodyweight Lunge, Bodyweight Side Lunge, Bodyweight Standing Calf Raise, Bodyweight Step Up, Bodyweight Walking Lunge, Bodyweight Wall Squat, Bow Pose, Box Jump Down with 1 Leg Stabilization, Box Jump Multiple Response, Boxing, Bridge, Butt-Ups, Butterfly, C-Curve, Cable Back Incline Pushdown, Cable Bent Over Low Pulley Lateral, Cable Bent Over Low Pulley Side Lateral, Cable Calf Raise, Cable Close Grip Curl, Cable Concentration Curl, Cable Cross Over, Cable Crunch, Cable Deadlift, Cable Decline Chest Fly, Cable Decline One Arm Press, Cable Decline Press, Cable Decline Pullover, Cable Drag Curl, Cable Elevated Rows, Cable External Rotation, Cable Flat Bench Fly, Cable Fly on Exercise Ball, Cable Front Raise, Cable Full Range of Motion Straight Crossover, Cable High Cross Over, Cable High Curl, Cable High Pulley Overhead Tricep Extension, Cable Incline Bench Row, Cable Incline Fly, Cable Incline Fly on Exercise Ball, Cable Incline Press, Cable Incline Press on Exercise Ball, Cable Incline Pullover, Cable Incline Tricep Extension, Cable Incline Triceps Extension, Cable Inner Chest Press, Cable Internal Rotation, Cable Judo Flip, Cable Kneeling Concentration Triceps Extension, Cable Kneeling Crunch with Alternating Oblique Twists, Cable Kneeling Pulldown, Cable Kneeling Triceps Extension, Cable Lateral Raise, Cable Low Triceps Extension, Cable Lower Chest Raise, Cable Lying Bicep Curl, Cable Lying Close Grip Biceps Curl, Cable Lying Front Raise, Cable Lying Pullover, Cable Lying Shrug, Cable Lying Triceps Extension, Cable Lying Upright Row, Cable Mid Chest Crossovers, Cable One Arm Decline Chest Fly, Cable One Arm Fly on Exercise Ball, Cable One Arm High Curl, Cable One Arm High-Pulley Side Bends, Cable One Arm Incline Fly on Exercise Ball, Cable One Arm Incline Press, Cable One Arm Incline Press on Exercise Ball, Cable One Arm Lat Pulldown, Cable One Arm Lateral Raise, Cable One Arm Preacher Curl, Cable One Arm Press on Exercise Ball, Cable One Arm Reverse Fly, Cable One Arm Reverse Preacher Curl, Cable One Arm Seated Row, Cable One Arm Standing Overhead Tricep Extension, Cable One Arm Tricep Extension, Cable One Arm Tricep Pushdown, Cable One Leg Calf Raise, Cable One Leg Kickback, Cable One Leg Lying Knee Raise, Cable Overhead Curl, Cable Overhead Curl on Exercise Ball, Cable Pallof Press with Rotation, Cable Palm Rotational Row, Cable Preacher Curl, Cable Press on Exercise Ball, Cable Pull Through, Cable Pulldown Bicep Curl, Cable Rear Lateral Raise, Cable Reverse Crunch, Cable Reverse Curl, Cable Reverse Fly, Cable Reverse Grip Curl, Cable Reverse Grip Curls, Cable Reverse Grip Incline Tricep Extension, Cable Reverse Grip Low Tricep Kickback, Cable Reverse Grip Triceps Pushdown, Cable Reverse One Arm Curl, Cable Reverse One Arm Tricep Extension, Cable Reverse Preacher Curl, Cable Reverse Preacher Curl, Cable Reverse Wood Chops, Cable Rope Crossover Seated Row, Cable Rope Crunch, Cable Rope Elevated Seated Row, Cable Rope Extension Incline Bench Row, Cable Rope Extension Lying Pullover, Cable Rope Face Pull, Cable Rope Hammer Curls, Cable Rope Hammer Preacher Curl, Cable Rope High Pulley Overhead Tricep Extension, Cable Rope Incline Tricep Extension, Cable Rope Lat Pull Down, Cable Rope Lying on Floor Tricep Extension, Cable Rope One Arm Hammer Preacher Curl, Cable Rope Overhead Triceps Extension, Cable Rope Pull Up, Cable Rope Rear Delt Row, Cable Rope Row To Neck, Cable Rope Seated Row, Cable Rope Triceps Pushdown, Cable Rotation on Exercise Ball, Cable Row to Neck, Cable Russian Twists, Cable Seated Crunch, Cable Seated Curl, Cable Seated One Arm Concentration Curl, Cable Seated Overhead Curl, Cable Seated Reverse Grip Wrist Curl, Cable Seated Row, Cable Seated Shoulder Press, Cable Seated Shrug, Cable Shoulder Press, Cable Shrug, Cable Side Bends, Cable Squatting Curl, Cable Standing Behind the Back Wrist Curl, Cable Standing Biceps Curl, Cable Standing Crunch, Cable Standing Curl, Cable Standing Deltoid Raise, Cable Standing Leg Curl, Cable Standing Lift, Cable Standing Oblique Crunch, Cable Standing One Arm Bicep Curl, Cable Standing One Arm Low Pulley Triceps Extension, Cable Standing One Arm Row, Cable Standing Reverse Curl, Cable Standing Reverse Curl, Cable Standing Reverse Grip One Arm Overhead Tricep Extension, Cable Standing Row, Cable Standing Triceps Extension, Cable Standing Up Straight Crossovers, Cable Straight Arm Push Down, Cable Tricep Incline Pushdown, Cable Tricep Kickback, Cable Triceps Pushdown, Cable Twist on Exercise Ball, Cable Twisting Crunch, Cable Two Arm Curl on Incline Bench, Cable Two Arm Tricep Kickback, Cable Underhand Pull Down, Cable Up Right Row, Cable Upper Chest Crossovers, Cable Upper Row, Cable V Bar Pull Down, Cable V Bar Standing Row, Cable Wood Chops, Cable Wrist Curl, Calf Machine Shoulder Shrug, Calf Press On Leg Press, Calf Press on Leg Press Machine, Calf Raise On A Dumbbell, Calf Stretch With Hands Against Wall, Calf Stretch with Rope, Camel Pose, Cat Stretch, Chair Leg Extended Stretch, Chair Lower Back Stretch, Chair Upper Body Stretch, Chest and Front of Shoulder Stretch, Child's Pose, Child's Pose on Exercise Ball, Chin Up, Clap Push Up, Climbers Chin Up, Close Grip Chin Up, Close Grip Front Lat Pulldown, Close Grip Reverse Lat Pull Down, Close Grip Vertical Row, Close Hand Pushup, Close Triceps Pushup, Cobra, Crane Pose, Crescent Moon Pose, Cross Body Crunch, Cross Legged Erector Spinae, Cross Legged Lying Side Stretch, Cross Legged Twist, Cross-Legged Forward Fold, Crossover Reverse Lunge, Crunch with Hands Overhead, Crunches, Crunches with Legs on a Bench, Crunches with Legs on an Exercise Ball, Dancer's Stretch, Decline Ab Reach, Decline Bench Alternate Knee Raise, Decline Bench Alternate Leg Raise, Decline Bench Cable Crunch, Decline Bench Cable Knee Raise, Decline Bench Knee Raise, Decline Bench Leg Raise, Decline Bench Leg Raise with Hip Thrust, Decline Bench Twisting Sit Up, Decline Bench Weighted Twist, Decline Crunch, Decline Oblique Crunch, Decline Reverse Crunch, Deep Push Up, Depth Jump Leap, Dip, Dip Machine, Donkey Calf Raises, Dorsiflexion, Double Leg Butt Kick, Double Leg Hundreds, Double Leg Stretch, Downward Facing Balance, Downward Facing Dog, Downward Facing Dog-Single Leg, Downward Facing Puppy Dog, Dragon Flag, Drop Push Up, Dumbbell Seated Front Hammer Raises, Dumbbell Alternate Bent Over Kickback, Dumbbell Alternate Bent Over Reverse Fly, Dumbbell Alternate Bicep Curl, Dumbbell Alternate Hammer Curl, Dumbbell Alternate Hammer Preacher Curl, Dumbbell Alternate Incline Curl, Dumbbell Alternate Incline Hammer Curl, Dumbbell Alternate Lying Extension, Dumbbell Alternate Lying Reverse Fly, Dumbbell Alternate One Arm Standing Palms In Press, Dumbbell Alternate Preacher Curl, Dumbbell Alternate Rear Delt Fly on Exercise Ball, Dumbbell Alternate Reverse Fly on Incline Bench, Dumbbell Alternate Seated Arnold Press, Dumbbell Alternate Seated Bent Over Kickback, Dumbbell Alternate Seated Curl, Dumbbell Alternate Seated Hammer Curl, Dumbbell Alternate Seated Lateral Raise, Dumbbell Alternate Seated Palms In Press, Dumbbell Alternate Seated Press, Dumbbell Alternate Standing Arnold Press, Dumbbell Alternate Standing Lateral Raise, Dumbbell Alternating Arnold Press on Exercise Ball, Dumbbell Alternating Bicep Curl with Leg Raised on Exercise Ball, Dumbbell Alternating Cobra Prone Exercise Ball, Dumbbell Alternating Deltoid Raise, Dumbbell Alternating Lateral Raise on Exercise Ball, Dumbbell Alternating Seated Bicep Curl on Exercise Ball, Dumbbell Arnold Press, Dumbbell Around the Worlds, Dumbbell Bench One Leg Squat, Dumbbell Bench Press, Dumbbell Bent Arm Pullover, Dumbbell Bent Over Delt Raise, Dumbbell Bent Over Reverse Fly, Dumbbell Bent Over Row, Dumbbell Bicep Curl, Dumbbell Bicep Curl Lunge with Bowling Motion, Dumbbell Bicep Curl on Exercise Ball with Leg Raised, Dumbbell Bicep Curl With Stork Stance, Dumbbell Biceps Curl Reverse, Dumbbell Biceps Curl Squat, Dumbbell Biceps Curl V Sit on Dome, Dumbbell Close Grip Press, Dumbbell Cobra Prone on Exercise Ball, Dumbbell Concentration Curls, Dumbbell Cross Body Hammer Curl, Dumbbell Cuban Press, Dumbbell Deadlift, Dumbbell Decline Bench Lunge, Dumbbell Decline Bench Press, Dumbbell Decline Fly, Dumbbell Decline One Arm Fly, Dumbbell Decline One Arm Hammer Press, Dumbbell Decline Press, Dumbbell Decline Press on Exercise Ball, Dumbbell Decline Triceps Extension, Dumbbell Double Incline Shoulder Raise, Dumbbell External Rotation, Dumbbell Flexor Incline Curl, Dumbbell Fly, Dumbbell Fly on Exercise Ball, Dumbbell Forward Lunge Triceps Extension, Dumbbell Forward Lunge with Bicep Curl, Dumbbell Front Incline Raise, Dumbbell Front Raise, Dumbbell Front Two Raise, Dumbbell Hammer Curl on Exercise Ball, Dumbbell Hammer Curls, Dumbbell Hammer Grip Incline Bench Press, Dumbbell Hamstring Curl, Dumbbell High Curl, Dumbbell Incline Bench Curl, Dumbbell Incline Bench Hammer Curl, Dumbbell Incline Bench Press, Dumbbell Incline Bench Two Arm Row, Dumbbell Incline Curl, Dumbbell Incline Fly, Dumbbell Incline Fly on Exercise Ball, Dumbbell Incline Fly With A Twist, Dumbbell Incline Hammer Curls, Dumbbell Incline Hammer Press on Exercise Ball, Dumbbell Incline One Arm Fly, Dumbbell Incline One Arm Fly on Exercise Ball, Dumbbell Incline One Arm Hammer Press, Dumbbell Incline One Arm Hammer Press on Exercise Ball, Dumbbell Incline One Arm Press, Dumbbell Incline One Arm Press on Exercise Ball, Dumbbell Incline Press on Exercise Ball, Dumbbell Incline Press on Exercise Ball, Dumbbell Incline Triceps Extension, Dumbbell Incline Two Arm Extension, Dumbbell Iron Cross, Dumbbell Jumping Squat, Dumbbell Kickbacks on Exercise Ball, Dumbbell Kneeling Bicep Curl Exercise Ball, Dumbbell Kneeling Lateral Raise on Exercise Ball, Dumbbell Lateral Lunge with Bicep Curl, Dumbbell Lateral Raise, Dumbbell Lateral Raises on Exercise Ball, Dumbbell Lunges, Dumbbell Lying Across Face Triceps Extension, Dumbbell Lying One Arm Lateral Raise, Dumbbell Lying One Arm Lateral Raise, Dumbbell Lying Pronation, Dumbbell Lying Pullover on Exercise Ball, Dumbbell Lying Rear Delt Raise, Dumbbell Lying Rear Delt Row, Dumbbell Lying Rear Lateral Raise, Dumbbell Lying Reverse Fly, Dumbbell Lying Single Extension, Dumbbell Lying Supination, Dumbbell Lying Supine Biceps Curl, Dumbbell Lying Supine Two Arm Triceps Extension, Dumbbell Lying Triceps Extension, Dumbbell Lying Wide Curl, Dumbbell Middle Back Shrug, Dumbbell Neutral Wrist Curl Over Bench, Dumbbell One Arm Arnold Press on Exercise Ball, Dumbbell One Arm Bench Fly, Dumbbell One Arm Bench Press, Dumbbell One Arm Bench Press, Dumbbell One Arm Bent Over Reverse Fly, Dumbbell One Arm Chest Fly on Exercise Ball, Dumbbell One Arm Decline Chest Press, Dumbbell One Arm Fly on Exercise Ball, Dumbbell One Arm French Press on Exercise Ball, Dumbbell One Arm Front Raise, Dumbbell One Arm Front Raise on Incline Bench, Dumbbell One Arm Hammer Preacher Curl, Dumbbell One Arm Hammer Press, Dumbbell One Arm Hammer Press on Exercise Ball, Dumbbell One Arm Incline Chest Press, Dumbbell One Arm Incline Lateral Raise, Dumbbell One Arm Lateral Raise on Exercise Ball, Dumbbell One Arm Lying Rear Delt Row, Dumbbell One Arm Lying Reverse Fly, Dumbbell One Arm Neutral Wrist Curl Over Bench, Dumbbell One Arm Preacher Curl, Dumbbell One Arm Press on Exercise Ball, Dumbbell One Arm Prone Curl, Dumbbell One Arm Prone Hammer Curl, Dumbbell One Arm Pullover, Dumbbell One Arm Pullover on Exercise Ball, Dumbbell One Arm Rear Delt Fly on Exercise Ball, Dumbbell One Arm Reverse Fly on Incline Bench, Dumbbell One Arm Reverse Grip Press, Dumbbell One Arm Reverse Preacher Curl, Dumbbell One Arm Reverse Spider Curl, Dumbbell One Arm Reverse Wrist Curl Over Bench, Dumbbell One Arm Row, Dumbbell One Arm Seated Arnold Press, Dumbbell One Arm Seated Bent Over Reverse Fly, Dumbbell One Arm Seated Bicep Curl on Exercise Ball, Dumbbell One Arm Seated Curl, Dumbbell One Arm Seated Hammer Curl, Dumbbell One Arm Seated Neutral Wrist Curl, Dumbbell One Arm Seated Reverse Wrist Curl, Dumbbell One Arm Seated Shoulder Press, Dumbbell One Arm Seated Wrist Curl, Dumbbell One Arm Shoulder Press, Dumbbell One Arm Shoulder Press, Dumbbell One Arm Shoulder Press on Exercise Ball, Dumbbell One Arm Side Lateral Raise, Dumbbell One Arm Standing Arnold Press, Dumbbell One Arm Standing Curl, Dumbbell One Arm Standing Front Raise, Dumbbell One Arm Standing Hammer Curl, Dumbbell One Arm Standing Lateral Raise, Dumbbell One Arm Standing Palms In Press, Dumbbell One Arm Supinated Triceps Extension, Dumbbell One Arm Triceps Extension, Dumbbell One Arm Up Right Row, Dumbbell One Arm Wrist Curl Over Bench, Dumbbell One Arm Zottman Preacher Curl, Dumbbell One Leg Fly on Exercise Ball, Dumbbell One Leg Squat, Dumbbell Palm Rotational Row, Dumbbell Palms Down Wrist Curl Over A Bench, Dumbbell Palms In Bench Press, Dumbbell Palms In Bent Over Row, Dumbbell Palms In Bent Over Row, Dumbbell Palms In Incline Bench Press, Dumbbell Palms Up Wrist Curl Over A Bench, Dumbbell Pile Squat, Dumbbell Power Partials, Dumbbell Preacher Curl, Dumbbell Preacher Curl over Exercise Ball, Dumbbell Preacher Hammer Curl, Dumbbell Press on Exercise Ball, Dumbbell Prone Alternating Rear Delt Row on Exercise Ball, Dumbbell Prone Incline Biceps Curl, Dumbbell Prone Incline Hammer Curl, Dumbbell Prone One Arm Rear Delt Row on Exercise Ball, Dumbbell Prone Rear Delt Row on Exercise Ball, Dumbbell Prone Shoulder Raise on Exercise Ball, Dumbbell Pullover Hip Extension on Exercise Ball, Dumbbell Pullover on Exercise Ball, Dumbbell Raise, Dumbbell Rear Delt Fly on Exercise Ball, Dumbbell Rear Delt Row, Dumbbell Rear Lunge, Dumbbell Reverse Bench Press, Dumbbell Reverse Concentration Curl, Dumbbell Reverse Flyes, Dumbbell Reverse Flyes With External Rotation, Dumbbell Reverse Grip Incline Bench One Arm Row, Dumbbell Reverse Grip Incline Bench Two Arm Row, Dumbbell Reverse Preacher Curl, Dumbbell Reverse Spider Curl, Dumbbell Reverse Wrist Curl Over Bench, Dumbbell Seated Alternate Bent Over Reverse Fly, Dumbbell Seated Alternate Front Raise, Dumbbell Seated Alternate Hammer Curl on Exercise Ball, Dumbbell Seated Alternate Lateral Raise, Dumbbell Seated Alternating Shoulder Press on Exercise Ball, Dumbbell Seated Arnold Press on Exercise Ball, Dumbbell Seated Bent Over Reverse Fly, Dumbbell Seated Bent Over Triceps Extension, Dumbbell Seated Bent Over Two Arm Triceps Extension, Dumbbell Seated Bicep Curl, Dumbbell Seated Calf Raise, Dumbbell Seated Concentration Curl on Exercise Ball, Dumbbell Seated Curl, Dumbbell Seated Dublin Press, Dumbbell Seated Front Raise, Dumbbell Seated Hammer Curl, Dumbbell Seated Inner Biceps Curl, Dumbbell Seated Neutral Wrist Curl, Dumbbell Seated One Arm Bent Over Reverse Fly, Dumbbell Seated One Arm Front Raise, Dumbbell Seated One Arm Lateral Raise, Dumbbell Seated One Arm One Leg Bicep Curl on Exercise Ball, Dumbbell Seated One Leg Calf Raise, Dumbbell Seated Palms Down One Arm Wrist Curl, Dumbbell Seated Palms In Press, Dumbbell Seated Palms Up One Arm Wrist Curl, Dumbbell Seated Palms Up Wrist Curl, Dumbbell Seated Palms-Down Wrist Curl, Dumbbell Seated Reverse Grip One Arm Overhead Tricep Extension, Dumbbell Seated Reverse Grip Shoulder Press, Dumbbell Seated Reverse Wrist Curl, Dumbbell Seated Shoulder Press on Exercise Ball, Dumbbell Seated Side Bend, Dumbbell Seated Side Lateral Raise, Dumbbell Seated Triceps Press, Dumbbell See Saw Press, Dumbbell Shoulder Press, Dumbbell Shoulder Press on Exercise Ball, Dumbbell Shoulder Raise on Exercise Ball, Dumbbell Shoulder Shrug, Dumbbell Shrugs on Exercise Ball, Dumbbell Side Bend, Dumbbell Single Arm Pronated Triceps Extension, Dumbbell Single Arm Supinated Triceps Extension, Dumbbell Sit Up On Exercise Ball, Dumbbell Spider Curl, Dumbbell Split Jump, Dumbbell Squat, Dumbbell Squat To A Bench, Dumbbell Standing Alternate Front Raises, Dumbbell Standing Alternate Press, Dumbbell Standing Alternate Reverse Curl, Dumbbell Standing Alternating Tricep Kickback, Dumbbell Standing Arnold Press, Dumbbell Standing Bent Over One Arm Triceps Extension, Dumbbell Standing Bent Over Two Arm Triceps Extension, Dumbbell Standing Calf Raise, Dumbbell Standing Dublin Press, Dumbbell Standing One Arm Press, Dumbbell Standing One Arm Reverse Curl, Dumbbell Standing One Arm Triceps Extension, Dumbbell Standing One Leg Cobra, Dumbbell Standing One-Arm Curl Over Incline Bench, Dumbbell Standing Palms In One Arm Press, Dumbbell Standing Palms In Press, Dumbbell Standing Press, Dumbbell Standing Reverse Curl, Dumbbell Standing Straight Arm Front Delt Raise Above Head, Dumbbell Standing Triceps Extension, Dumbbell Standing Triceps Kickback, Dumbbell Step Up Single Leg Balance with Bicep Curl, Dumbbell Step Ups, Dumbbell Stiff Leg Deadlift, Dumbbell Stiff Leg Deadlift on Bench, Dumbbell Stiff-Legged Deadlift, Dumbbell Straight Arm Pullover, Dumbbell Tate Press, Dumbbell Tricep Kickback, Dumbbell Tricep Kickback With Stork Stance, Dumbbell Twisting Bench Press, Dumbbell Twisting Decline Sit Up, Dumbbell Twisting Standing Curl, Dumbbell Two Arm Seated Hammer Curl on Exercise Ball, Dumbbell Two Arm Side Bend, Dumbbell Upright Row, Dumbbell Walking Lunges, Dumbbell Wall Squat, Dumbbell Wood Chops, Dumbbell Zottman Curl, Dynamic Back Stretch, Dynamic Chest Stretch, Eagle Pose, Elbow Circles, Elbows Back Stretch, Elliptical Training, Exercise Ball Ab Curl, Exercise Ball Alternating Arm Ups, Exercise Ball Alternating One Arm Bridge, Exercise Ball Back Extension With Arms Extended, Exercise Ball Back Extension With Hands Behind Head, Exercise Ball Back Extension With Knees Off Ground, Exercise Ball Back Extension With Rotation, Exercise Ball Back Stretch, Exercise Ball Back Wall Circles, Exercise Ball Chest Stretch, Exercise Ball Cross Legged Bridge, Exercise Ball Cross Legged Crunch, Exercise Ball Crunch, Exercise Ball Dip, Exercise Ball Extended Arms Crunch, Exercise Ball Hand and Foot Exchange, Exercise Ball Hip Flexor Stretch, Exercise Ball Hip Roll, Exercise Ball Hip Thrust Bridge, Exercise Ball Hug, Exercise Ball Hundreds, Exercise Ball Incline Ab Crunch, Exercise Ball Jack Knife Push Up, Exercise Ball Knee Roll, Exercise Ball Lat Stretch, Exercise Ball Leg Lifts, Exercise Ball Lower Back Prone Stretch, Exercise Ball Lower Back Stretch, Exercise Ball Lying Side Lat Stretch, Exercise Ball Lying Side Stretch, Exercise Ball Narrow Push Up, Exercise Ball Oblique Curl, Exercise Ball on the Wall Calf Raise, Exercise Ball One Leg Crunch, Exercise Ball One Leg Prone Lower Body Rotation, Exercise Ball One Legged Bridge, Exercise Ball One Legged Diagonal Kick Hamstring Curl, Exercise Ball Pike Pushup, Exercise Ball Plank With Side Kick, Exercise Ball Prone Leg Raise, Exercise Ball Pull In, Exercise Ball Pyramid, Exercise Ball Reverse Crunch, Exercise Ball Reverse Supine Bridge, Exercise Ball Reverse Trunk Curl, Exercise Ball Roll Down, Exercise Ball Roman Twist, Exercise Ball Seated Hamstring Stretch, Exercise Ball Seated Head Tilt, Exercise Ball Seated Neck Extensor Stretch, Exercise Ball Seated Neck Flexor Stretch, Exercise Ball Seated Pelvic Circles, Exercise Ball Seated Quad Stretch, Exercise Ball Seated Side Bend, Exercise Ball Seated Triceps Stretch, Exercise Ball Side Crunch, Exercise Ball Side Crunch Against Wall, Exercise Ball Side Stretch, Exercise Ball Standing Hamstring Stretch, Exercise Ball Straight Legged Crunch, Exercise Ball Supine Triceps Extension, Exercise Ball Traveling Lunge, Exercise Ball Tricep Dip, Exercise Ball V Up, Exercise Ball Wall Squat, Exercise Ball Weighted Sit Up, Exercise Ball Wood Chops, Extended Arm Child Pose, EZ Bar Close Grip Curl, EZ Bar Curl, EZ Bar Decline Close Grip Skull Crusher, EZ Bar Decline Triceps Extension, EZ Bar French Press on Exercise Ball, EZ Bar Incline Triceps Extension, EZ Bar Lying Close Grip Behind the Head Triceps Extension, EZ Bar Reverse Grip Bent Over Row, EZ Bar Reverse Grip French Press, EZ Bar Reverse Grip Preacher Curl, EZ Bar Seated Close Grip Concentration Curl, EZ Bar Seated Reverse Grip French Press, EZ Bar Standing French Press, EZ Bar Triceps Extension, Field Sports, Fish Pose, Flat Bench Leg Pull In, Flat Bench Lying Leg Raise, Flutter Kick, Freehand Jump Squat, Frog Sit Ups, Front Leg Raises, Front Step Up, Full Range Of Motion Lat Pulldown, Gironda Sternum Chin Ups, Glute Kickback, Gorilla Chin Up with Crunch, Hack Calf Raise, Hack One Leg Calf Raise, Hack Squat, Hack Squat with Narrow Stance, Half Moon Stretch on Exercise Ball, Hammer Grip Pull Up, Hamstring Stretch, Handstand Pushups, Hanging Knee Raise, Hanging Leg Raise, Hanging Pike, Hanging Rotated Knee Raise, Hare Pose, Hero Pose, Hip Adduction, Hip Flexor and Quad Stretch, Hip Thrusts, Hug Knees to Chest, Hundreds, Hyperextensions - Back Extensions, Hyperextensions With No Bench, Incline Push Up Depth Jump, Indoor Cycling, Inline Skating, Inverted Row, Iron Cross Stretch, Iso Lateral Wide Pulldown, Isometric Chest Squeeze, Jackknife Sit up, Jackknife Sit-Up On Bench, Janda Sit Up, Jump Rope, Kettlebell Advanced Windmill, Kettlebell Alternating Floor Press, Kettlebell Alternating Hang Clean, Kettlebell Alternating Press, Kettlebell Alternating Renegade Row, Kettlebell Alternating Row, Kettlebell Arnold Press, Kettlebell Bent Press, Kettlebell Bottoms Up Clean From The Hang Position, Kettlebell Dead Clean, Kettlebell Double Alternating Hang Clean, Kettlebell Double Jerk, Kettlebell Double Push Press, Kettlebell Double Snatch, Kettlebell Double Windmill, Kettlebell Extended Range One Arm Floor Press, Kettlebell Figure Eight, Kettlebell Front Squats, Kettlebell Goblet Squat, Kettlebell Hang Clean, Kettlebell One Arm Clean, Kettlebell One Arm Clean And Jerk, Kettlebell One Arm Floor Press, Kettlebell One Arm Floor Press, Kettlebell One Arm Jerk, Kettlebell One Arm Military Press To The Side, Kettlebell One Arm Overhead Squat, Kettlebell One Arm Palm Clean, Kettlebell One Arm Para Press, Kettlebell One Arm Push Press, Kettlebell One Arm Row, Kettlebell One Arm Snatch, Kettlebell One Arm Split Jerk, Kettlebell One Arm Split Snatch, Kettlebell One Arm Swing, Kettlebell One Legged Deadlift, Kettlebell Open Palm Clean, Kettlebell Pass Between The Legs, Kettlebell Pistol Squat, Kettlebell Plyo Pushups, Kettlebell Seated Press, Kettlebell Seesaw Press, Kettlebell Sumo High Press, Kettlebell Thruster, Kettlebell Turkish Get Up Lunge, Kettlebell Turkish Get Up Squat, Kettlebell Two Arm Clean, Kettlebell Two Arm Jerk, Kettlebell Two Arm Military Press, Kettlebell Two Arm Row, Kettlebell Windmill, Knee Across The Body, Knee Circles, Knee Draw In, Knee Hip Raise On Parallel Bars, Knee Tuck Jump, Kneeling Forearm Stretch, Kneeling Hip Flexor, Kneeling Hip Flexor, Kneeling Jump Squat, Kneeling Lat Stretch, Kneeling Leg Curl, Kneeling Side Bend, Kneeling Squat, Leg Extension with One Leg, Leg Extensions, Leg Lift, Leg Over Floor Press, Leg Press, Leg Press Machine, Leg Press Machine One Leg Press with Wide Stance, Leg Press Machine With Narrow Stance, Leg Press Machine With One Leg, Leg Press Machine With Wide Stance, Leg Press with Narrow Stance, Leg Press with Wide Stance, Leg Pull In, Leg Raise, Leg Slide, Leg Slide with One Leg, Leg-Up Hamstring Stretch, Leverage Chest Press, Leverage Decline Chest Press, Leverage Incline Chest Press, Leverage Machine High Row, Leverage Machine Iso Row, Leverage Shoulder Press, Leverage Shrug, Locust Pose, Looking At Ceiling, Lower Abdominal Hip Roll, Lower Back Curl, Lying Alternate Floor Leg Raise, Lying Alternate Knee Raise, Lying Cable Crunch, Lying Cable Knee Raise on Bench, Lying Floor Knee Raise, Lying Heel Touches, Lying Hip Flexor, Lying Leg Curls, Lying Leg Raise with Hip Thrust on Bench, Lying Machine Squat, Lying to Side Plank, Machine Assisted Chin Up, Machine Assisted Dip, Machine Assisted Hammer Grip Pull Up, Machine Assisted Pull Up, Machine Curl With Hammer Grip, Machine Curl With Reverse Grip, Machine Decline Chest Press, Machine Deltoid Raise, Machine Fly, Machine Incline Chest Press, Machine Inner Chest Press, Machine Lat Pull Down, Machine Reverse Flyes, Machine Shoulder Press, Machine T-Bar Reverse Grip Row, Machine Triceps Extension, Medicine Ball Backward Throw, Medicine Ball Biceps Curl on Exercise Ball, Medicine Ball Catch and Overhead Throw, Medicine Ball Chest Pass, Medicine Ball Chest Push from 3 Point Stance, Medicine Ball Chest Push Multiple Response, Medicine Ball Chest Push Single Response, Medicine Ball Chest Push with Run Release, Medicine Ball Decline One Arm Overhead Throw, Medicine Ball Decline Two Arm Overhead Throw, Medicine Ball Full Twist, Medicine Ball Overhead Slam, Medicine Ball Sit Up on Exercise Ball, Medicine Ball Supine Chest Throw, Medicine Ball Supine One Arm Overhead Throw, Medicine Ball Supine Two Arm Overhead Throw, Medicine Ball Throw On Exercise Ball, Middle Back Stretch, Mighty Pose, Mixed Grip Chin Up, Modified Push Up to Forearms, Mountain Biking, Mountain Climbers, Narrow Grip Lat Pull Down, Neck Press, Oblique Crunches, Oblique Crunches with Bench, Oblique Raises on Parallel Bars, On Your Back Quad Stretch, On Your Side Quad Stretch, One Arm Against Wall, One Arm Chin Up, One Arm Iso Lateral High Row, One Arm Iso Lateral Wide Pulldown, One Armed Biased Push Up, One Half Locust, One Handed Hang, One Knee to Chest, One Leg 45 Degree Leg Press, One Leg Bodyweight Squat, One Leg Calf Press on Leg Press, One Leg Donkey Calf Raise, One Leg Floor Calf Raise, One Leg Hack Squat, One Leg Kickback, One Leg Reverse Hyper on Flat Bench, Opening Out Twist, Overhead Stretch, Parallel Bar Leg Raise, Passive Opening Out Twist, Pelvic Tilt Into Bridge, Peroneals Stretch, Pilates, Pin Presses, Plank, Plank on Exercise Ball, Plank with Feet on Bench, Plank with Side Kick, Plyo Push-Up, Posterior Capsule, Posterior Tibialis Stretch, Preacher Curl Machine, Prisoner Squat, Pull Ups, Push Up, Push Up On Exercise Dome, Push Up to Side Plank, Push Up with Feet Elevated, Push Up with Feet On An Exercise Ball, Quad Stretch, Reach and Catch, Rear Bodyweight Lunge, Rear Leg Raises, Reclining Big Toe Pose, Recumbent Bike, Reverse Crunch, Reverse Grip Lat Pull Down, Reverse Grip Machine Lat Pull Down, Reverse Grip Vertical Row, Reverse Hack Squat, Reverse Hyper on Flat Bench, Reverse Lying T Bar Machine Row, Revolved Abdomen Pose Sequence, Road Cycling, Rocket Jump, Rocky Pull Ups and Pulldowns, Roll Downs, Roll Over on Exercise Ball, Rolling, Roman Chair Twisting Knee Raise, Rowing, Runner's Stretch, Running, Sage Twist 1, Scalene, Scissor Kick, Scissors Jump, Scorpion, Seated Calf Raise, Seated Calf Stretch, Seated Flat Bench Leg Pull In, Seated Floor Hamstring Stretch, Seated Glute, Seated Hamstring and Calf Stretch, Seated Hamstring Stretch, Seated Hamstring Stretch on Exercise Ball, Seated Leg Curl, Seated Leg Curl with One Leg, Seated Leg Tucks, Seated Machine Row, Seated One Leg Calf Raise, Seated One Leg Calf Raise, Seated Overhead Stretch, Seated Tricep Dip, Seated Two Arm Palms Up Low Pulley Wrist Curl, Seated Wide Angle Pose Sequence, Shell Stretch, Shoulder Circles, Shoulder Raise, Shoulder Raise Machine, Shoulder Stretch, Side Angle Pose With Rotation, Side Bridge, Side Hop-Sprint, Side Jackknife, Side Step Up, Side to Side Box Shuffle, Side Wrist Pull, Side-Lying Floor Stretch, Single Bench Dip, Single Leg Butt Kick, Single Leg Curl, Single Leg Glute Bridge, Single Leg Push-Off, Single Leg Stride Jump, Sissy Squat, Sit Squat, Sit Up, Smith Machine Bench Press, Smith Machine Bent Over Row, Smith Machine Bicep Curl, Smith Machine Close Grip Bench Press, Smith Machine Close Grip Shoulder Press, Smith Machine Deadlift, Smith Machine Decline Bench Press, Smith Machine Decline Close Grip Bench Press, Smith Machine Frankenstein Squat, Smith Machine Front Squat, Smith Machine Good Morning, Smith Machine Hack Squat, Smith Machine Incline Bench Press, Smith Machine Incline Shoulder Raise, Smith Machine Incline Tricep Extension, Smith Machine Lunge, Smith Machine One Arm Row, Smith Machine One Leg Calf Raise, Smith Machine Overhead Shoulder Press, Smith Machine Rear Delt Row, Smith Machine Reverse Calf Raises, Smith Machine Reverse Close Grip Bench Press, Smith Machine Reverse Decline Close Grip Bench Press, Smith Machine Reverse Grip Bench Press, Smith Machine Reverse Grip Bent Over Row, Smith Machine Reverse Grip Incline Bench Press, Smith Machine Seated One Leg Calf Raise, Smith Machine Seated Wrist Curl, Smith Machine Shoulder Press, Smith Machine Shoulder Press Behind the Neck, Smith Machine Shrug, Smith Machine Single Leg Split Squat, Smith Machine Squat, Smith Machine Squat to Bench, Smith Machine Standing Behind the Back Wrist Curl, Smith Machine Stiff Legged Deadlift, Smith Machine Toe Raise, Smith Machine Upright Row, Smith Machine Wide Grip Bench Press, Smith Machine Wide Grip Decline Bench Press, Smith Machine Wide Grip Shoulder Press, Smith Machine Zercher Squat, Sphinx, Spinal Stretch, Spine Stretch, Spine Twist, Split Jump, Staff Pose, Standing Adductor, Standing Biceps Stretch, Standing Calf Raises, Standing Elevated Quad Stretch, Standing Gastrocnemius, Standing Gastrocnemius Calf Stretch, Standing Glute Kickback, Standing Half Moon, Standing Hamstring and Calf Stretch, Standing Hip Flexors, Standing Lateral Stretch, Standing Long Jump, Standing One Arm One Leg Opposite Reach, Standing One Leg Bodyweight Calf Raise, Standing Pelvic Tilt, Standing Quadriceps Stretch, Standing Soleus And Achilles Stretch, Standing Straight Leg Hamstring Contract Relax on Exercise Ball, Standing Toe Touches, Star Jump, Stationary Bike, Step Machine, Stork Stance, Stork Stance with Exercise Ball, Straddle Stretch, Straight Leg Heel on Toe, Straight Leg Outer Hip Abductor, Sun Salutation, Superman, Superman Leg Stretch, Supine Ab Crunch Machine, Supine Hamstring Stretch, Supine Knee to Chest, Supine Straight Leg Hamstring Stretch on Exercise Ball, Swimming, T Bar Lying Row, T Bar Row, Table Pose, Thigh Abductor, Thigh Adductor, Three Bench Dip, Toe Touchers, Torso Rotation, Towel Standing Triceps Extension, Transverse Step Up, Treadmill Running, Triangle Pose, Tricep Side Stretch, Tricep Stretch, Triceps Pushdown V Bar, Tuck Crunch, Turtle Pose, Twisting Floor Crunch, Twisting Hanging Knee Raise, Twisting Lying Cable Crunch, Two Leg Slide, Two Legged Supine Knee to Chest, Unilateral Row, Upper Back Stretch, Upward Facing Bow Pose, Upward Facing Dog, Upward Stretch, V Bar Pull Up, V Ups, Walking, Warrior 2 Pose, Warrior 3 Pose, Warrior Pose, Weight Plate Decline Crunch, Weight Plate Around the World Decline Crunch, Weight Plate Front Raise, Weight Plate High Front Raise, Weight Plate Hyperextensions on Exercise Ball, Weight Plate Lying Face Down Neck Resistance, Weight Plate Lying Face Up Neck Resistance, Weight Plate Oblique Twists, Weight Plate One Arm Shrug, Weight Plate Pinch, Weight Plate Pullover on Exercise Ball, Weight Plate Reverse Curl, Weight Plate Russian Twist, Weight Plate Shrugs, Weight Plate Side Bend, Weight Plate Side Bend on Exercise Ball, Weight Plate Sissy Squat, Weight Plate Squat, Weight Plate Standing Hand Squeeze, Weight Plate Twist, Weighted Bench Dip, Weighted Crunches, Weighted Drop Push Up, Weighted Exercise Ball Wall Squat, Weighted Hanging Knee Raise, Weighted Pull Ups, Weighted Side Touches, Weighted Three Bench Dips, Weighted Tricep Dips, Wide Grip Lat Pulldown, Wide Grip Pulldown Behind The Neck, Wide Grip Rear Pull-Up, Wide Hand Pushup, Wide Leg Stretch, Windshield Wipers, World's Greatest Stretch, Wrist Circles, Wrist Roller, Yoga, Z Pose";

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
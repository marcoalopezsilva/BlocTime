(function() {

    function HomeCtrl($scope, $interval, $filter, $timeout) {

      // Initiate Timer object
      $scope.timer = null;
      // Create booleans to track breaks
      $scope.onBreak = false;
      $scope.pomodoroBlockCompleted = null;
      // Create boolean to control Reset option
      $scope.resetOption = null;

      // Set max time to 25:00
      ALLOWED_TIME_BLOCK = 25*60;
      BREAK_BLOCK =  5*60;
      $scope.message = "Allowed time for Pomodoro block: " + ALLOWED_TIME_BLOCK/60 + " minutes"

      // Timer Start function
      $scope.startTimer = function () {
        console.log("Called startTimer function");
        $scope.message = "Timer started";
        $scope.time = ALLOWED_TIME_BLOCK;
        $scope.resetOption = true;
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            $scope.time = $scope.time - 1;
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
          } else {
            $scope.message = "Time is up!";
            $timeout(function() {
              $scope.message = "Allowed time for Pomodoro block: " + ALLOWED_TIME_BLOCK/60 + " minutes";
              $interval.cancel($scope.timer);
              $scope.timer = null;
              $scope.resetOption = null;
              $scope.pomodoroBlockCompleted = true;
            }, 1000);
          }
        }, 1000);
      };

      $scope.stopTimer = function () {
        console.log("Called stopTimer function");
        $scope.message = "Timer stopped";
        // Cancel Timer
        if (angular.isDefined($scope.timer)) {
          $interval.cancel($scope.timer);
          $timeout(function() {
            $scope.timer = null;
            $scope.message = "Allowed time for Pomodoro block: " + ALLOWED_TIME_BLOCK/60 + " minutes" }, 2000);
            $scope.resetOption = null;
            $scope.pomodoroBlockCompleted = null;
        }
      };

      $scope.resetTimer = function () {
        console.log("Called resetTimer function");
        $timeout(function() {$scope.message = "Timer reset!";});
        $interval.cancel($scope.timer);
        $scope.startTimer();
      };

      $scope.startBreak = function () {
        console.log("Called startBreak function");
        $scope.message = "Break initiated!";
        $scope.onBreak = true;
        $scope.pomodoroBlockCompleted = null;
        $scope.resetOption = null;
        $scope.time = BREAK_BLOCK;
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            $scope.time = $scope.time - 1;
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
          } else {
            $timeout(function() {
              $scope.message = "Break is over!";
            }, 1000);
            $interval.cancel($scope.timer);
            $scope.timer = null;
            $scope.startTimer();
            $scope.onBreak = false;
          }
        }, 1000);
      };

    }

    angular
        .module('pomodoroC230')
        .controller('HomeCtrl', ['$scope', '$interval', '$filter', '$timeout', HomeCtrl]);
})();

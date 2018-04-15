(function() {

    function HomeCtrl($scope, $interval, $filter, $timeout) {

      // Initiate Timer object
      $scope.timer = null;

      // Set max time to 25:00
      $scope.allowedTimeBlock = 25*60;
      $scope.message = "Allowed time for Pomodoro block: " + $scope.allowedTimeBlock/60 + " minutes"

      // Timer Start function
      $scope.startTimer = function () {
        console.log("Called startTimer function");
        $scope.message = "Timer started";
        $scope.time = $scope.allowedTimeBlock;
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            $scope.time = $scope.time - 1;
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
          } else {
            $scope.message = "Time is up!";
            $timeout(function() {
              $scope.message = "Allowed time for Pomodoro block: " + $scope.allowedTimeBlock/60 + " minutes";
              $interval.cancel($scope.timer);
              $scope.timer = null;
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
            $scope.message = "Allowed time for Pomodoro block: " + $scope.allowedTimeBlock/60 + " minutes" }, 2000);
        }
      };

      $scope.resetTimer = function () {
        console.log("Called resetTimer function");
        $timeout(function() {$scope.message = "Timer reset!";});
        $interval.cancel($scope.timer);
        $scope.startTimer();
      };

    }

    angular
        .module('pomodoroC230')
        .controller('HomeCtrl', ['$scope', '$interval', '$filter', '$timeout', HomeCtrl]);
})();

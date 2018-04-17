(function() {

    function HomeCtrl($scope, $interval, $filter, $timeout) {

      // Set max time to 25:00
      ALLOWED_TIME_BLOCK = 25*60;
      STANDARD_BREAK =  5*60;
      LONGER_BREAK = 30*60;
      ORIGINAL_MESSAGE = "Allowed time for Pomodoro block: " + ALLOWED_TIME_BLOCK/60 + " minutes"
      $scope.message = ORIGINAL_MESSAGE;

      // Initiate objects and variables needed for tracking
      $scope.timer = null;
      $scope.pomodoroBlockCompleted = null;
      $scope.numberPomodorosCompleted = 0;

      // Initialize show options variables
      $scope.showStartOption = true;
      $scope.showStopOption = null;
      $scope.showResetOption = null;
      $scope.showBreakOption = null;

      // Timer Start function
      $scope.startTimer = function () {
        console.log("Called startTimer function");
        $scope.message = "Timer started";
        $scope.time = ALLOWED_TIME_BLOCK;
        $scope.showStopOption = true;
        $scope.showResetOption = true;
        $scope.showStartOption = null;
        $scope.showBreakOption = null;
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
            $scope.time--;
          } else {
            $scope.message = "Time is up!";
            setTimeout(function(){$scope.message = ORIGINAL_MESSAGE}, 1000);
            $interval.cancel($scope.timer);
            $scope.timer = null;
            $scope.pomodoroBlockCompleted = true;
            $scope.numberPomodorosCompleted = $scope.numberPomodorosCompleted + 1;
            console.log("Pomodoro work blocks completed: " + $scope.numberPomodorosCompleted);
            $scope.showStartOption = true;
            $scope.showStopOption = null;
            $scope.showResetOption = null;
            $scope.showBreakOption = true;
          }
        }, 1000);
    };

      $scope.stopTimer = function () {
        console.log("Called stopTimer function");
        setTimeout(function() {$scope.message = "Timer stopped"}, 1000);
        // Cancel Timer
        $interval.cancel($scope.timer);
        $scope.message = ORIGINAL_MESSAGE;
        $scope.pomodoroBlockCompleted = null;
        $scope.showStartOption = true;
        $scope.showStopOption = null;
        $scope.showResetOption = null;
        $scope.showBreakOption = null;
      };

      $scope.resetTimer = function () {
        console.log("Called resetTimer function");
        setTimeout(function(){$scope.message = "Timer reset!"}, 1000);
        $interval.cancel($scope.timer);
        $scope.startTimer();
      };

      $scope.startBreak = function () {
        console.log("Called startBreak function");
        $scope.message = "Break initiated!";
        //I'll assume that the user should not be able to reset the timer when o break (would defeat the purpose of the Pomodoro method)
        $scope.showStartOption = null;
        $scope.showResetOption = null;
        $scope.showStopOption = true;
        $scope.showBreakOption = null;
        if ($scope.numberPomodorosCompleted == 4) {
          $scope.time = LONGER_BREAK;
          $scope.numberPomodorosCompleted = 0;
        } else {
          $scope.time = STANDARD_BREAK;
        }
        console.log("Break duration: " + $scope.time);
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
            $scope.time--;
          } else {
            setTimeout(function(){
              $scope.message = "Break is over!";
              $interval.cancel($scope.timer);
              $scope.timer = null;
              $scope.showStartOption = true;
              $scope.showStopOption = null;
              $scope.showBreakOption = null;
              $scope.showResetOption = null;
            }, 1000);
          //Next line is needed if the next block should automatically begin when the break is over
          //$scope.startTimer();
          }
        }, 1000);
      };

    }

    angular
        .module('pomodoroC230')
        .controller('HomeCtrl', ['$scope', '$interval', '$filter', '$timeout', HomeCtrl]);
})();

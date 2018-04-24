(function() {

    function HomeCtrl($scope, $interval, $filter, $timeout, Task) {

      // Make the Firebase data available to controller
      $scope.Task = Task;

      /* List of production-version time allowances
      ALLOWED_TIME_BLOCK = 25*60;
      STANDARD_BREAK =  5*60;
      LONGER_BREAK = 30*60;
      ORIGINAL_MESSAGE = "Allowed time for Pomodoro block: " + ALLOWED_TIME_BLOCK/60 + " minutes" */

      // List of test-version time allowances
      ALLOWED_TIME_BLOCK = 5;
      STANDARD_BREAK =  3;
      LONGER_BREAK = 4;
      ORIGINAL_MESSAGE = "Allowed time for Pomodoro block: " + Math.round(ALLOWED_TIME_BLOCK/60*100)/100 + " minutes"

      $scope.message = ORIGINAL_MESSAGE;

      // Initiate objects and variables needed for tracking
      $scope.timer = null;
      $scope.pomodoroBlockCompleted = null;
      $scope.breakCompleted = null;
      $scope.numberPomodorosCompleted = 0;

      //Initialize Buzz object
      var timerSound = new buzz.sound("/assets/Elevator Ding-SoundBible.com-685385892.mp3", {
          preload: true,
          autoplay: true
      });

      // Initialize show options variables
      $scope.showStartOption = true;
      $scope.showStopOption = null;
      $scope.showResetOption = null;
      $scope.showBreakOption = null;
      $scope.showAddTask = null;

      // Add watcher to play sound whenever a work-block (or a break) is completed
      $scope.$watchGroup(['pomodoroBlockCompleted', 'breakCompleted'], function() {
        //debugger;
        console.log("Watcher fired!");
        if ($scope.pomodoroBlockCompleted == true || $scope.breakCompleted == true) {timerSound.play()};
      });

      // Timer Start function
      $scope.startTimer = function () {
        console.log("Called startTimer function");
        $scope.pomodoroBlockCompleted = null;
        $scope.breakCompleted = null;
        $scope.message = "Timer started";
        $scope.time = ALLOWED_TIME_BLOCK;
        $scope.showStopOption = true;
        $scope.showResetOption = true;
        $scope.showStartOption = null;
        $scope.showBreakOption = null;
        $scope.showAddTask = null;
        $scope.timer = $interval(function () {
          if ($scope.time > 0) {
            var filteredTime = $filter('date')(new Date(1970,0,1).setSeconds($scope.time), 'mm:ss');
            $scope.message = filteredTime;
            $scope.time--;
          } else {
            $scope.message = "Time is up!";
            $scope.pomodoroBlockCompleted = true;
            $scope.showAddTask = true;
            setTimeout(function(){$scope.message = ORIGINAL_MESSAGE}, 1000);
            $interval.cancel($scope.timer);
            $scope.timer = null;
            $scope.numberPomodorosCompleted = $scope.numberPomodorosCompleted + 1;
            console.log("Pomodoro work blocks completed: " + $scope.numberPomodorosCompleted);
            $scope.showStartOption = true;
            $scope.showStopOption = null;
            $scope.showResetOption = null;
            $scope.showBreakOption = true;
          }
        }, 1000);
    };

      // Timer Stop function
      $scope.stopTimer = function () {
        console.log("Called stopTimer function");
        setTimeout(function() {$scope.message = "Timer stopped"}, 1000);
        // Cancel Timer
        $interval.cancel($scope.timer);
        $scope.message = ORIGINAL_MESSAGE;
        $scope.showStartOption = true;
        $scope.showStopOption = null;
        $scope.showResetOption = null;
        $scope.showBreakOption = null;
        $scope.pomodoroBlockCompleted = null;
        $scope.breakCompleted = null;
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
        $scope.pomodoroBlockCompleted = null;
        $scope.breakCompleted = null;
        //I'll assume that the user should not be able to reset the timer when o break (would defeat the purpose of the Pomodoro method)
        $scope.showStartOption = null;
        $scope.showResetOption = null;
        $scope.showStopOption = true;
        $scope.showBreakOption = null;
        $scope.showAddTask = null;
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
            $scope.breakCompleted = true;
            setTimeout(function(){
              $scope.message = "Break is over!";
              $interval.cancel($scope.timer);
              $scope.timer = null;
              $scope.showStartOption = true;
              $scope.showStopOption = null;
              $scope.showBreakOption = null;
              $scope.showResetOption = null;
            }, 100);
          //Next line is needed if the next block should automatically begin when the break is over
          //$scope.startTimer();
          }
        }, 1000);
      };

      $scope.addTask = function () {
        console.log("addTask function called");
        Task.sendTask($scope.newTaskName);
        this.newTaskName = null;
        $scope.showAddTask = null;
      };

    }

    angular
        .module('pomodoroC230')
        .controller('HomeCtrl', ['$scope', '$interval', '$filter', '$timeout', 'Task', HomeCtrl]);
})();

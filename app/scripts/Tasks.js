(function() {

  function Task($firebaseArray) {

    var Task = {};
    var ref = firebase.database().ref().child("Tasks");
    var tasks = $firebaseArray(ref);

    Task.all = tasks;

    Task.sendTask = function (name) {
      var tempholder = $firebaseArray(ref);
      tempholder.$add({task_name: name});
    };

    return Task;
  }

  angular
    .module('pomodoroC230')
    .factory('Task', ['$firebaseArray', Task]);
})();

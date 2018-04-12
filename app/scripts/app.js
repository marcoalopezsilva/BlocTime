(function() {
  function config($locationProvider, $stateProvider) {
       $locationProvider
           .html5Mode({
               enabled: true,
               requireBase: false
            });

       $stateProvider
           .state('home', {
               url: '/',
               controller: 'HomeCtrl as home',
               templateUrl: '/templates/home.html'
           });
   }
     angular
         .module('pomodoroC230', ['ui.router', 'firebase'])
         .config(config);
 })();

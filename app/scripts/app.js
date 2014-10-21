'use strict';
/*jshint -W079 */
/**
 * @ngdoc overview
 * @name jetgrizzlyApp
 * @description
 * # jetgrizzlyApp
 *
 * Main module of the application.
 */
angular.module('jetgrizzlyApp', [
  'jetgrizzlyApp.Auth',
  'jetgrizzlyApp.chat',
  'jetgrizzlyApp.Account',
  'jetgrizzlyApp.Room',
  'ui.router',
  'ui.bootstrap',
  'firebase'
])
  .config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise('/');
  $stateProvider.state('app',{
    abstract:true,
    templateUrl:'views/main.html',
    resolve: {
      user : function(SimpleLogin){
        return SimpleLogin.getUser();
      }
    },
    controller:function($scope,user, SimpleLogin){
      $scope.user = user;
    }
  });
})
.factory('config',function(){
  return {
    firebase:{url:'https://blistering-heat-6745.firebaseio.com'}
  };
});

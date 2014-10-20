'use strict';

/**
 * @ngdoc overview
 * @name jetgrizzlyApp
 * @description
 * # jetgrizzlyApp
 *
 * Main module of the application.
 */
var module = angular.module('jetgrizzlyApp', [
  'jetgrizzlyApp.Auth',
  'jetgrizzlyApp.chat',
  'jetgrizzlyApp.Account',
  'jetgrizzlyApp.Room',
  'ui.router',
  'ui.bootstrap',
  'firebase'
]);
module.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/");
  $stateProvider.state('app',{
    abstract:true,
    templateUrl:'views/main.html',
    resolve: {
      currentUser : function(Auth){
        return Auth.$getCurrentUser();
      }
    },
    controller:function($scope,Auth,currentUser){
      $scope.auth = Auth;
      $scope.currentUser = currentUser;
    }
  })
})
.run(function ($rootScope, $location, Auth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function (event, next) {
//    Auth.isAuthenticated().then(function(user) {
//      if (next.authenticate && !user) {
//        $location.path('/login');
//      }
//    });
  });
})
  .factory('config',function(){
    return {
      firebase:{url:'https://blistering-heat-6745.firebaseio.com'}
    };
  });

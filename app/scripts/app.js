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
  'ui.bootstrap'
]);

module.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/");
  $stateProvider.state('app',{
    abstract:true,
    template:'<ui-view></ui-view>',
    resolve: {
      currentUser : function(MockAuth){
        return MockAuth.getCurrentUser();
      }
    }
  })
})
.run(function ($rootScope, $location, MockAuth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function (event, next) {
    MockAuth.getCurrentUser(function(user) {
      if (next.authenticate && !user) {
        $location.path('/login');
      }
    });
  });
});

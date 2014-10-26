/*jshint -W020 */
'use strict';
//does not do much now, but provide a template/page for user account information
(function(){
var module = angular.module('jetgrizzlyApp.Account',['ui.router']);
module.config(function($stateProvider){
  $stateProvider.state('account',{
    url:'/account',
    parent:'app',
    templateUrl:'views/account/account.html',
    controller:function($scope,user){
      $scope.user = user;
    }
  });
});
})();
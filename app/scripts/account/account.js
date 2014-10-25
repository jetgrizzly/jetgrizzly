/*jshint -W020 */
'use strict';
(function(){
var module = angular.module('jetgrizzlyApp.Account',['ui.router']).config(function($stateProvider){
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
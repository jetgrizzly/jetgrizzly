"use strict";

var module = angular.module('jetgrizzlyApp.Auth',['ui.router']);
var previousLocation = null;
module.factory('MockAuth',function($timeout,$q){
  var getCurrentUser = function(){
    var d = $q.defer();
    $timeout(function(){
      var simulateAuth = false;
      if(simulateAuth){
        d.resolve({name:"mock user",username:'test1'});
      }else{
        d.resolve(null);
      }
    },300);
    return d.promise;
  };
  return {
    getCurrentUser: getCurrentUser
  };
});
module.run(function($rootScope,$location){
  $rootScope.$on('$stateChangeStart',function(event,toState,toParams,fromState,fromParams){
    previousLocation = $location.path();
  })
});
module.controller('LoginController',function($scope,$modalInstance){

});
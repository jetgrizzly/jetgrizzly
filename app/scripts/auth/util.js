'use strict';
angular.module('firebase.utils', ['firebase'])
.factory('fbutil', function($window, $firebase){
  function firebaseRef() {
    var ref = new $window.Firebase('https://blistering-heat-6745.firebaseio.com');
    return ref;
  }
	return {
		ref2: firebaseRef
	};
});
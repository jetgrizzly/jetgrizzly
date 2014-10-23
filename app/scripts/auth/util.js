angular.module('firebase.utils', ['firebase'])
.factory('fbutil', function($window, $firebase){
	return {
		ref: firebaseRef
	};

	function firebaseRef() {
		var ref = new $window.Firebase('https://blistering-heat-6745.firebaseio.com');
		return ref;
	}
})
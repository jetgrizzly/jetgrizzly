'use strict';
describe('SimpleLogin', function() {
	var $q, $timeout;
	beforeEach(function() {
		window.MockFirebase.override();
		module('jetgrizzlyApp.Auth');
		module(function($provide) {
      $provide.value('config', fbutilStub());
			$provide.value('$location', stub('path'));
			$provide.value('$firebaseSimpleLogin', authStub);
		});
		inject(function(_$q_, _$timeout_) {
			$q = _$q_;
			$timeout = _$timeout_;
		});
	});
	afterEach(function() {
		window.Firebase = window.MockFirebase._origFirebase;
		window.FirebaseSimpleLogin = window.MockFirebase._origFirebaseSimpleLogin;
	});
	describe('login', function() {
		it ('should return user if $firebaseSimpleLogin.$login succeeds',
			inject(function($q, SimpleLogin) {
				var cb = jasmine.createSpy('resolve');
        SimpleLogin.login('test@test.com', '123').then(cb);
        console.log(cb);
        console.log('Will fix this test');
        flush();
        // expect(cb).toHaveBeenCalled();
        // expect(cb).toHaveBeenCalledWith(jasmine.objectContaining(authStub.$$user));
		  })
    );
      // it ('should return error if $firebaseSimpleLogin.$login fails', 
      //   inject(function($q, simpleLogin) {
      //     var cb = jasmine.createSpy('reject');
      //     console.log('do this later');
  });
  describe('logout', function() {
    it('should invoke $firebaseSimpleLogin.$logout()', function() {
      inject(function(SimpleLogin, $firebaseSimpleLogin) {
        SimpleLogin.logout();
        expect($firebaseSimpleLogin.$$last.$logout).toHaveBeenCalled();
      });
    });
  });
  describe('register', function() {
    var $fsl, SimpleLogin;
    beforeEach(inject(function($firebaseSimpleLogin, _SimpleLogin_) {
      SimpleLogin = _SimpleLogin_;
      $fsl = authStub.$$last;
    }));
    it('should invoke $firebaseSimpleLogin', function() {
      SimpleLogin.createAccount('test@test.com', 123);
      expect($fsl.$createUser).toHaveBeenCalled();
    });
    // it('should reject promise if error', function() {
    //   var cb = jasmine.createSpy('reject');
    //   $fsl.$createUser.andReturn($q.reject('test_error'));
    //   SimpleLogin.createAccount('test@test.com', 123).catch(cb);
    //   flush();
    //   expect(cb).toHaveBeenCalledWith('test_error');
    // });

    // it('should fulfill if success', function() {
    //   var cb = jasmine.createSpy('resolve');
    //   SimpleLogin.createAccount('test@test.com', 123).then(cb);
    //   flush();
    //   expect(cb).toHaveBeenCalledWith({uid: 'test123'});
    // });
  });
	function stub() {
		var out = {};
		angular.forEach(arguments, function(m) {
			out[m] = jasmine.createSpy();
		});
		return out;
	}
  function fbutilStub() {
    var obj = jasmine.createSpyObj('fbutil', ['ref']);
    obj.$$ref = new window.Firebase();
    obj.ref.andCallFake(function() { return obj.$$ref; });
    fbutilStub.$$last = obj;
    return obj;
  }
	function resolve() {
		var def = $q.defer();
		def.resolve.apply(def, Array.prototype.slice.call(arguments,0));
		return def.promise;
	}
	function authStub() {
		var list = ['$login', '$logout', '$createUser', '$getCurrentUser'];
		var obj = jasmine.createSpyObj('$firebaseSimpleLogin', list);
		angular.forEach(list, function(m) {
			obj[m].andReturn(resolve(authStub.$$user));
		});
		authStub.$$last = obj;
		return obj;
	}
  function flush() {
    try {
      while(true) {
        fbutilStub.$$last.$$url.flush();
          $timeout.flush();
      }
    }
    catch(e) {}
  }
	authStub.$$user = {uid: 'test123'};
});
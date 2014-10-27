'use strict';
describe('SimpleLogin', function() {
	var $q, $timeout;
	beforeEach(function() {
    //need to override the firebase since it is attached to the window
    MockFirebase.override();
		module('jetgrizzlyApp.Auth');
		module(function($provide) {
      //The required variables in auth.js is being substituted by stubs
      //Stub functions are defined at the end of this page
      //These are mock dependencies used by our factories to isolate testing
      $provide.value('fbutil', fbutilStub());
			$provide.value('$firebaseSimpleLogin', authStub);
		});
    //inject a service under a different name so that we can locally assign
    //the local variables $q and $timeout the same name as the factories
		inject(function(_$q_, _$timeout_) {
			$q = _$q_;
			$timeout = _$timeout_;
		});
	});
  //put things back to the way they were before, no more mock
	afterEach(function() {
		Firebase = MockFirebase._origFirebase;
		FirebaseSimpleLogin = MockFirebase._origFirebaseSimpleLogin;
	});
	describe('login', function() {
		it ('should return user if $firebaseSimpleLogin.$login succeeds',
			inject(function($q, SimpleLogin) {
        //create random "bare" spy because there is not a function to spy on
				var cb = jasmine.createSpy('resolve');
        //the return of login should return a promise, with that promise
        //call the cb
        SimpleLogin.login('test@test.com', '123').then(cb);
        flush();
        //make sure that the stubs are actually being used and called using spy
        expect(cb).toHaveBeenCalledWith(jasmine.objectContaining(authStub.$$user));
		  })
    );
    it('should return error if $firebaseSimpleLogin.$login fails',
      inject(function($q, SimpleLogin) {
        //create random "bare" spy because there is not a function to spy on
        var cb = jasmine.createSpy('reject');
        authStub.$$last.$login.andReturn($q.reject('test_error', null));
        SimpleLogin.login('test@test.com', '123').catch(cb);
        flush();
        expect(cb).toHaveBeenCalledWith('test_error');
      })
    );
  });
  describe('logout', function() {
    it('should invoke $firebaseSimpleLogin.$logout()', function() {
      inject(function(SimpleLogin, $firebaseSimpleLogin) {
        //Make sure that the stub is being called when providing the function and method
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
      //Make sure that the stub is being called when providing the function and method
      SimpleLogin.createAccount('test@test.com', 123);
      expect($fsl.$createUser).toHaveBeenCalled();
    });
    it('should reject promise if error', function() {
      //create random "bare" spy because there is not a function to spy on
      var cb = jasmine.createSpy('reject');
      $fsl.$createUser.andReturn($q.reject('test_error'));
      SimpleLogin.createAccount('test@test.com', 123).catch(cb);
      flush();
      expect(cb).toHaveBeenCalledWith('test_error');
    });
    it('should fulfill if success', function() {
      //create random "bare" spy because there is not a function to spy on
      var cb = jasmine.createSpy('resolve');
      SimpleLogin.createAccount('test@test.com', 123).then(cb);
      flush();
      //expect the stub with uid provided to be called
      expect(cb).toHaveBeenCalledWith({uid: 'test123'});
    });
  });
  //is a stub for the util.js (compare this to the file)
  function fbutilStub() {
    //creates a spy object called fbutil with a ref2 method/object
    var obj = jasmine.createSpyObj('fbutil', ['ref2']);
    //this ref2 object makes a new Firebase with no url for testing
    obj.$$ref2 = new Firebase();
    obj.ref2.andCallFake(function() { return obj.$$ref2; });
    //for testing, flush will flush this out and return back 
    fbutilStub.$$last = obj;
    return obj;
  }
	function resolve() {
		var def = $q.defer();
		def.resolve.apply(def, Array.prototype.slice.call(arguments,0));
		return def.promise;
	}
  //make stub for firebasesimplelogin that is used for auth.js
	function authStub() {
    //this stub has functions below similar to the actual angularfire
		var list = ['$login', '$logout', '$createUser', '$getCurrentUser'];
    //creates a spy object called firebasesimplelogin with the functions as methods
		var obj = jasmine.createSpyObj('$firebaseSimpleLogin', list);
		//insert each list method to include the user provided below as an argument
    angular.forEach(list, function(m) {
			obj[m].andReturn(resolve(authStub.$$user));
		});
    //for testing, flush will flush this out and return back
		authStub.$$last = obj;
		return obj;
	}
	authStub.$$user = {uid: 'test123'};
  //flush until there is nothing left to flush or when something throws an error
  //necessary for createAccount which uses some chained promises that
  //iterate through set/remote/promise calls, all of which have to be flushed
  function flush() {
    try {
      while(true) {
        fbutilStub.$$last.$$ref2.flush();
          $timeout.flush();
      }
    }
    catch(e) {}
  }
  //if there are any errors, this will return the error
  function ErrorWithCode(code, msg) {
    this.code = code;
    this.msg = msg;
  }
  ErrorWithCode.prototype.toString = function() { return this.msg; }
});

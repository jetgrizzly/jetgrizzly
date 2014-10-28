'use strict';

describe('Service: playerState', function () {
  var $q,$timeout;
  // load the service's module
  beforeEach(function(){
    MockFirebase.override();

    module('jetgrizzlyApp');

    inject(function(_$q_, _$timeout_) {
      $q = _$q_;
      $timeout = _$timeout_;
    });
  });

  // instantiate service
  var playerState;
  beforeEach(inject(function (_playerState_) {
    playerState = _playerState_;
  }));

  it('should exist', function () {
    expect(!!playerState).toBe(true);
  });

  it('should have the expected functions',function(){
    var expectedFunctions=[
      'isPlaying',
      'getCurrentVideoId',
      'getCurrentVideoTime',
      'ready',
      'getNextVideo'
    ];

    expectedFunctions.forEach(function(functionName){
      expect(typeof playerState[functionName]).toBe('function');
    })
  });

  describe('the isPlayingFunction',function(){
    it('should start returning false',function(){
      expect(playerState.isPlaying()).toBe(false);
    });

    it('should return true when firebase starts playing',function(){

    });
  })


});

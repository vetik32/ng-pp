'use strict';

describe('app spec', function () {
  var $httpBackend;

  beforeEach(module('partnerApp'));
  beforeEach(module('ui.router'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');

    $httpBackend.whenGET(/\.\.\/views\/\\*/).respond();
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should transit to login', inject(function ($injector) {
    var $state = $injector.get('$state');
    var $rootScope = $injector.get('$rootScope');
    var AuthService = $injector.get('AuthService');
    var called = false;

    spyOn(AuthService, 'isAuthorized').andCallThrough();
    spyOn(AuthService, 'isLoggedIn').andCallThrough();

    $rootScope.$on('$stateChangeStart', function () {
      called = true;
    });

    $state.transitionTo('login');

    expect(called).toBeTruthy();
    expect(AuthService.isAuthorized).not.toHaveBeenCalled();
    expect(AuthService.isLoggedIn).not.toHaveBeenCalled();

    called = false;
    $state.transitionTo('home');
    $httpBackend.flush();
    expect(called).toBeTruthy();
    expect($state.current.name).toEqual('login');
    expect(AuthService.isAuthorized).toHaveBeenCalled();
    expect(AuthService.isLoggedIn).toHaveBeenCalled();

  }));

  it('should unauthorised access to home', inject(function ($injector) {
    var $state = $injector.get('$state');
    var AuthService = $injector.get('AuthService');
    var $rootScope = $injector.get('$rootScope');
    var called = false;

    var user = {
      name: 'test',
      'password': 'test',
      'authorized': true
    };

    AuthService.setUser(user);

    expect(AuthService.isLoggedIn()).toBeTruthy();
    expect(AuthService.isAuthorized(4)).toBeFalsy();


    $rootScope.$on('$stateChangeStart', function () {
      called = true;
    });

    spyOn($state, 'go').andCallThrough();

    $state.transitionTo('partners');
    $httpBackend.flush();
    expect(called).toBeTruthy();

    expect($state.go).toHaveBeenCalledWith('home');

  }));

});


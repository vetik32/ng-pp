'use strict';

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp'));

  var LoginCtrl, $httpBackend, $controller, $rootScope, $scope,
    $state, SessionService, AuthService;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    SessionService = $injector.get('SessionService');
    $state = $injector.get('$state');
    AuthService = $injector.get('AuthService');

    $scope = $rootScope.$new();
    function createController() {
      return $controller('LoginCtrl', {
        '$scope': $scope

      });
    }

    $httpBackend.whenGET('/verifylogin').respond(200, {});
    $httpBackend.whenGET('../views/login.html').respond();

    LoginCtrl = createController();
  }));

  it(' test', function () {
    spyOn(AuthService, 'isLoggedIn').andCallFake(function () {
      return true;
    });

    spyOn($state, 'go');

    $httpBackend.flush();

    expect(AuthService.isLoggedIn).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('home');

  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have login function that calls for SessionService with user credits', inject(function () {

    spyOn(SessionService, 'login');

    $scope.partner = {
      name: 'test',
      password: 'test'
    };

    $scope.$digest();
    $scope.login();
    $httpBackend.flush();

    expect(typeof $scope.login).toBe('function');
    expect(SessionService.login).toHaveBeenCalledWith($scope.partner, jasmine.any(Function), jasmine.any(Function));
  }));

  it('should go home if login is successful', inject(function () {
    spyOn(AuthService, 'isLoggedIn').andCallFake(function () {
      return true;
    });

    spyOn($state, 'go');

    $scope.partner = {
      name: 'test',
      password: 'test'
    };

    $scope.$digest();

    $scope.login();
    $httpBackend.expectPOST('/session.json').respond(200, {partner: {name: 'zzz'}});
    $httpBackend.flush();

    expect(AuthService.isLoggedIn).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('home');
  }));

  it('should show an error if login failed', inject(function () {

    spyOn(AuthService, 'isLoggedIn').andCallFake(function () {
      return false;
    });

    $scope.partner = {
      name: 'test',
      password: 'test'
    };

    $httpBackend.expectPOST('/session.json').respond(200, {partner: {name: 'zzz'}});
    $scope.login();
    $scope.$digest();

    $httpBackend.flush();

    expect(AuthService.isLoggedIn).toHaveBeenCalled();
    expect($scope.message).toEqual('Invalid username or password!');
    expect(!!$scope.hasErrorMessage()).toEqual(true);
  }));

  it('should show an error if login failed', inject(function () {

    $scope.partner = {
      name: 'test',
      password: 'test'
    };

    $httpBackend.expectPOST('/session.json').respond(400, {partner: {name: 'zzz'}});
    $scope.login();
    $scope.$digest();

    $httpBackend.flush();

    expect($scope.message).toEqual('Error: [object Object]');
    expect(!!$scope.hasErrorMessage()).toEqual(true);
  }));

});

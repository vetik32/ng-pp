'use strict';

describe('Controller: UserCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp'));

  var UserCtrl, createController,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    var $controller =$injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    createController = function() {
      return $controller('UserCtrl', {'$scope': scope });
    };

  }));

  it('UserCtrl should have several methods defined', inject(function() {
    UserCtrl = createController();
    expect(scope.getPartnerName).toBeDefined();
    expect(scope.logout).toBeDefined();
  }));

  it('UserCtrl should be able to access partner name', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);
    UserCtrl = createController();
    expect(scope.getPartnerName()).toEqual(user.name);
    expect(scope.navigation.length).toEqual(2);
  }));


  it('should have all navigation links defined for admin', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'admin': true,
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);
    UserCtrl = createController();
    expect(scope.navigation.length).toEqual(3);
  }));

  it('should logout user', inject(function($injector) {
    var $httpBackend =  $injector.get('$httpBackend');
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    $httpBackend.expectDELETE('/session.json').respond();
    $httpBackend.expectGET('../views/login.html').respond();

    AuthService.setUser(user);
    UserCtrl = createController();
    scope.logout();
    scope.$digest();

    $httpBackend.flush();

    expect(AuthService.getUser()).toBeNull();
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));
});

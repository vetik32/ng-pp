'use strict';

describe('Controller: HomeCtrl', function() {

  // load the controller's module
  beforeEach(module('partnerApp'));

  var HomeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();

    function createController() {
      return $controller('HomeCtrl', {'$scope': scope });
    }

    HomeCtrl = createController();
  }));


  it('should be able to access partner name', inject(function($injector) {
    var user = {
      'authorized': true,
      'key': 'QWE123',
      'name': 'kayak'
    };
    var AuthService = $injector.get('AuthService');

    AuthService.setUser(user);
    expect(scope.getPartnerName).toBeDefined();
    expect(scope.getPartnerName()).toEqual(user.name);
  }));


  it('should be able to clear errors', inject(function($injector) {
    var ErrorHandler = $injector.get('ErrorHandler');

    spyOn(ErrorHandler, 'clear');
    scope.hideErrors();
    expect(ErrorHandler.clear).toHaveBeenCalled();
  }));
});

'use strict';

describe('Controller: FooterCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp'));

  var FooterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FooterCtrl = $controller('FooterCtrl', {
      $scope: scope
    });
  }));

  it('FooterCtrl controller should set currentYear', function () {
    expect(typeof scope.currentYear).not.toBe('undefined');
  });

});

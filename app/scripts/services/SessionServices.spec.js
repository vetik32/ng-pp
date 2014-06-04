'use strict';

describe('SessionServices: SessionService', function() {
  var SessionService, AuthService, $httpBackend;
  var resultHandler, errorHandler;

  beforeEach(module('partnerApp'));
  beforeEach(module('SessionServices'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    AuthService = $injector.get('AuthService');
    SessionService = $injector.get('SessionService');
    $httpBackend.whenGET('../views/login.html').respond();

    // create handlers' spies
    resultHandler = jasmine.createSpy();
    errorHandler = jasmine.createSpy();

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should not logout if it\'s not logged in', inject(function() {

    spyOn(AuthService, 'logout');
    spyOn(AuthService, 'isLoggedIn').andCallFake(function(){
      return false;
    });

    SessionService.logout();
    $httpBackend.flush();

    expect(AuthService.logout).not.toHaveBeenCalled();
  }));

  it('should logout', inject(function($injector) {
    var $state = $injector.get('$state');

    spyOn($state, 'go');
    spyOn(AuthService, 'logout');
    spyOn(AuthService, 'isLoggedIn').andCallFake(function(){
      return true;
    });

    $httpBackend.expectDELETE('/session.json').respond(200);

    SessionService.logout();
    $httpBackend.flush();
    expect(AuthService.logout).toHaveBeenCalled();
    expect($state.go).toHaveBeenCalledWith('login');
  }));

  it('should alert with message if logout fails', inject(function() {

    spyOn(window, 'alert');
    spyOn(window.console, 'log');

    window.console = jasmine.createSpyObj('console', ['log']);
    spyOn(AuthService, 'isLoggedIn').andCallFake(function(){
      return true;
    });

    var errorResponse  = 'errorrrr!';
    $httpBackend.expectDELETE('/session.json').respond(401, errorResponse);
    SessionService.logout();
    $httpBackend.flush();
    expect(window.alert).toHaveBeenCalledWith('Error trying to log out, check the console for more details.');
    expect(window.console.log).toHaveBeenCalled();
  }));

  describe('login', function() {
    var result, newPartner;
    beforeEach(function() {
      result = { partner: {name: 'test', 'authorized': true}};
      newPartner = {
        name: 'test',
        'password': 'test'
      };

      spyOn(AuthService, 'setUser');
    });

    it('should set user', function() {

      $httpBackend.expectPOST('/session.json').respond(200, result);
      SessionService.login(newPartner, resultHandler, errorHandler);

      $httpBackend.flush();
      expect(AuthService.setUser).toHaveBeenCalled();
      expect(resultHandler).toHaveBeenCalled();

    });

    it('should call error handler is login fails', function() {

      $httpBackend.expectPOST('/session.json').respond(401, result);
      SessionService.login(newPartner, resultHandler, errorHandler);

      $httpBackend.flush();

      expect(AuthService.setUser).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('verifylogin', function() {
    var result, newPartner, partner;

    beforeEach(function() {
      result = { partner: {name: 'test', 'authorized': true}, admin: true, authorized: true};
      newPartner = {
        name: 'test',
        password: 'test'
      };
      partner = {
        name: 'test',
        authorized: result.authorized,
        admin: result.admin
      };

      spyOn(AuthService, 'setUser');
    });

    it('should setUser is if verification passes', function() {

      $httpBackend.expectGET('/verifylogin?name=test&password=test').respond(200, result);
      SessionService.verifylogin(newPartner, resultHandler, errorHandler);

      $httpBackend.flush();
      expect(AuthService.setUser).toHaveBeenCalledWith(partner);
      expect(resultHandler).toHaveBeenCalled();
    });

    it('should call error handler if verification fails', function() {

      $httpBackend.expectGET('/verifylogin?name=test&password=test').respond(400, result);
      SessionService.verifylogin(newPartner, resultHandler, errorHandler);

      $httpBackend.flush();
      expect(AuthService.setUser).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });

  });

  describe('updatePartner', function() {
    var result, newPartner, partner;

    beforeEach(function() {
      //return;
      result = {
        partner: {
          name: 'john',
          'authorized': true
        },
        admin: true,
        authorized: true
      };

      newPartner = {
        partner_id: 'john'
      };

      partner = {
        name: newPartner.partner_id,
        authorized: result.authorized,
        admin: result.admin
      };

      spyOn(AuthService, 'setUser');
    });

    it('should setUser(new partner) if updatePartner request passes', function() {

      $httpBackend.expectPUT('/updatepartner', newPartner).respond(200, result);
      SessionService.updatePartner(newPartner.partner_id, resultHandler, errorHandler);

      $httpBackend.flush();
      expect(AuthService.setUser).toHaveBeenCalledWith(partner);
      expect(resultHandler).toHaveBeenCalled();
    });
    it('should setUser(new partner) if updatePartner request passes', function() {

      $httpBackend.expectPUT('/updatepartner', newPartner).respond(401, result);
      SessionService.updatePartner(newPartner.partner_id, resultHandler, errorHandler);

      $httpBackend.flush();
      expect(AuthService.setUser).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
    });
  });
});


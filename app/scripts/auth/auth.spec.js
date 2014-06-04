'use strict';

describe('Authentication Module', function() {

  // load the controller's module
  beforeEach(module('Auth'));

  describe('Test first time login', function() {
    var scope, AuthService, ACCESS_LEVELS, $rootScope;

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      AuthService = $injector.get('AuthService');
      ACCESS_LEVELS = $injector.get('ACCESS_LEVELS');
      scope = $rootScope.$new();
    }));

    function checkSettingIncorectUser() {
      expect(AuthService.getUser()).toBeNull();
      expect(AuthService.isAuthorized()).toBe(false);
      expect(AuthService.isLoggedIn()).toBe(false);
      expect(AuthService.getUserKey()).toBeNull();
      expect(AuthService.getUserName()).toBeNull();
      expect(AuthService.getToken()).toEqual('');
    }

    it('AuthService is clean, and has nothing set yet', function() {
      checkSettingIncorectUser();
    });

    it('should return undefined when setting unauthorized user', function() {
      var user = {};
      AuthService.setUser(user);
      checkSettingIncorectUser();

      user = {
        'authorized': false
      };
      AuthService.setUser(user);
      checkSettingIncorectUser();
    });

    it('should return a user with PARTNER(authorized) role(all but admin)', function() {
      var user = {
        'authorized': true
      };
      AuthService.setUser(user);

      expect(AuthService.isLoggedIn()).toBe(true);
      expect(AuthService.getUser()).not.toBeUndefined();
      expect(AuthService.isAuthorized(ACCESS_LEVELS.PUB)).toBe(true);
      expect(AuthService.isAuthorized(ACCESS_LEVELS.PARTNER)).toBe(true);
      expect(AuthService.isAuthorized(ACCESS_LEVELS.ADMIN)).toBe(false);
    });

    it('should return a user with ADMIN(authorized with admin (all) privileges)', function() {
      var user = {
        'authorized': true,
        'admin': true
      };

      AuthService.setUser(user);
      expect(AuthService.isLoggedIn()).toBe(true);
      expect(AuthService.getUser()).not.toBeUndefined();
      expect(AuthService.isAuthorized(ACCESS_LEVELS.PUB)).toBe(true);
      expect(AuthService.isAuthorized(ACCESS_LEVELS.PARTNER)).toBe(true);
      expect(AuthService.isAuthorized(ACCESS_LEVELS.ADMIN)).toBe(true);
    });

    it('should return the key', function() {
      var user = {
        'authorized': true,
        'key': 'QWE123'
      };

      AuthService.setUser(user);
      expect(AuthService.getUserKey()).toBe(user.key);
    });

    it('should return the token', function() {
      var user = {
        'authorized': true,
        'token': 'QWE123'
      };

      AuthService.setUser(user);
      expect(AuthService.getToken()).toBe(user.token);
    });

    it('should return the name', function() {
      var user = {
        'authorized': true,
        'key': 'QWE123',
        'name': 'kayak'
      };

      AuthService.setUser(user);
      expect(AuthService.getUserName()).toBe(user.name);
    });

    it('should store the user into session and null it when logout', inject(function() {
      var user = {
        'authorized': true,
        'key': 'QWE123'
      };
      AuthService.setUser(user);
      AuthService.logout();
      var userFromStore = AuthService.getUser();
      expect(userFromStore).toBeNull();

      checkSettingIncorectUser();
    }));

  });
});

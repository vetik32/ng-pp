'use strict';

angular.module('SessionServices', ['ngResource', 'Auth'])
  .factory('SessionService', ['$log', '$resource', '$rootScope', '$state', 'AuthService',
  function ($log, $resource, $rootScope, $state, AuthService) {
    var login, verifylogin, logout, updatePartner, service, verificationService, partnerUpdateService;
    verificationService = $resource('/verifylogin', {}, {
      verifylogin: {
        method: 'GET'
      }
    });
    partnerUpdateService = $resource('/updatepartner', {}, {
      updatePartner: {
        method: 'PUT'
      }
    });
    service = $resource('/session.json', {}, {
      login: {
        method: 'POST'
      },
      logout: {
        method: 'DELETE'
      },
      updatePartner: {
        method: 'PUT'
      }
    });
    login = function(newPartner, resultHandler, errorHandler) {
      return service.login(newPartner, function(result) {
        var partner = result.partner || {};
        partner.authorized = result.authorized;
        AuthService.setUser(partner);
        if (angular.isFunction(resultHandler)) {
          return resultHandler(result);
        }
      }, function(error) {
        if (angular.isFunction(errorHandler)) {
          return errorHandler(error);
        }
      });
    };
    verifylogin = function(newPartner, resultHandler, errorHandler) {
      return verificationService.verifylogin(newPartner, function(result) {
        var partner = result.partner || {};
        partner.authorized = result.authorized;
        partner.admin = result.admin;
        AuthService.setUser(partner);
        if (angular.isFunction(resultHandler)) {
          return resultHandler(result);
        }
      }, function(error) {
        if (angular.isFunction(errorHandler)) {
          return errorHandler(error);
        }
      });
    };
    updatePartner = function(newPartner, resultHandler, errorHandler) {
      return partnerUpdateService.updatePartner({ 'partner_id': newPartner}, function(result) {
        var partner = result.partner || {};
        partner.authorized = result.authorized;
        partner.admin = result.admin;
        AuthService.setUser(partner);
        if (angular.isFunction(resultHandler)) {
          return resultHandler(result);
        }
      }, function(error) {
        if (angular.isFunction(errorHandler)) {
          return errorHandler(error);
        }
      });
    };
    logout = function() {

      if (!AuthService.isLoggedIn()) {
        return;
      }

      service.logout(function() {
        AuthService.logout();
        $state.go('login');
      }, function(errorResponse) {
        alert('Error trying to log out, check the console for more details.');
        if (console && console.log) {
          console.log(errorResponse);
        }
      });
    };

    return {
      login: login,
      verifylogin: verifylogin,
      logout: logout,
      updatePartner: updatePartner
    };
  }]);

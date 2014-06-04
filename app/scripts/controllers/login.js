'use strict';

angular.module('partnerApp')
    .controller('LoginCtrl', ['$scope', '$state', 'SessionService', 'AuthService',
    function ($scope, $state, SessionService, AuthService) {
      var loginErrorHandler, loginResultHandler, loginverificationResultHandler;
      $scope.partner = {};

      $scope.login = function() {
        return SessionService.login($scope.partner, loginResultHandler, loginErrorHandler);
      };
      loginResultHandler = function() {
        if (AuthService.isLoggedIn()) {
          $state.go('home');
        } else {
          $scope.message = 'Invalid username or password!';
        }
      };
      loginverificationResultHandler = function() {
        if (AuthService.isLoggedIn()) {
          $state.go('home');
        }
      };

      loginErrorHandler = function(error) {
        $scope.message = 'Error: ' + error;
      };

      $scope.hasErrorMessage = function() {
        return ($scope.message != null) && $scope.message.length;
      };

      SessionService.verifylogin($scope.partner, loginverificationResultHandler, loginErrorHandler);
    }
  ]);

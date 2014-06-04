'use strict';

angular.module('partnerApp').controller('HomeCtrl',
  ['$scope' ,'AuthService', 'ErrorHandler',
  function ($scope, AuthService, ErrorHandler) {

  // TODO: remove this, use same approach as in PartnerCtrl
  $scope.hideErrors = function(){
    ErrorHandler.clear();
  };

  $scope.getPartnerName = function(){
    return AuthService.getUserName();
  };

}]);



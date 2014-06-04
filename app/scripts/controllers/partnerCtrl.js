/*jshint unused: false */
'use strict';

angular.module('partnerApp').controller('PartnerCtrl',
  ['$scope', '$rootScope', '$location', 'PartnerService', 'SessionService', 'AuthService',
  function ($scope, $rootScope, $location, PartnerService, SessionService, AuthService) {

  var errorResultsToString;

  $scope.alerts = [];

  $scope.getPartnerName = function(){
    return AuthService.getUserName();
  };


  $scope.updatePartner = function(parnterId) {
    SessionService.updatePartner(parnterId);
  };

  $scope.createPartner = function() {
    PartnerService.create($scope.newpartner.partner, function() {
      $scope.alerts.push({msg: 'Partner created.', type: 'success'});
      refreshPartnersList();
    }, function(result) {
        $scope.alerts.push({msg: 'There was an error. ' + errorResultsToString(result.data), type: 'error'});
      });
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  errorResultsToString = function(data) {
    var error_pairs = _.pairs(data);
    return _.reduce(error_pairs, function(memo, d){
      return memo + d[0] + ' ' + d[1] + '.\n';
    }, '');
  };

  function refreshPartnersList() {
    $scope.partners = PartnerService.list();
  }

  refreshPartnersList();

}]);

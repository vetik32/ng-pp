(function (angular) {
  'use strict';

  angular.module('partnerApp').controller('FooterCtrl', ['$scope', function ($scope) {

    $scope.currentYear = (new Date()).getUTCFullYear();

  }]);

}(window.angular));

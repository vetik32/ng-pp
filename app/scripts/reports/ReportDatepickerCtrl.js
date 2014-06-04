'use strict';

angular.module('partnerApp')
  .controller('ReportDatepickerCtrl', [
    '$scope', '$modalInstance', 'reportFilter',
    function ($scope, $modalInstance, reportFilter) {

      $scope.range = {
        from: reportFilter.from,
        to: reportFilter.to
      };

      $scope.select = function () {
        $modalInstance.close($scope.range);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.rangeIsNotSelected = function () {
        return ($scope.range.from - reportFilter.from === 0) &&
          ($scope.range.to - reportFilter.to === 0);
      };
    }
  ]);

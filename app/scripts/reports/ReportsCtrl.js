'use strict';

angular.module('partnerApp')
  .controller('ReportsCtrl',
  [ '$scope', 'ReportsService', '$modal', 'promiseTracker',
    function($scope, ReportsService, $modal, promiseTracker) {

    var groupedValueBackup;

    $scope.reportFilter = {
      from: null,
      to: null
    };

    $scope.dates = [
      {
        'value': 29,
        'label': 'Last 30 days'
      },
      {
        'value': 6,
        'label': 'Last 7 days'
      },
      {
        'value': '-1',
        'label': 'Specific Date'
      }
    ];

    $scope.eventVolume = undefined;

    $scope.getReportFilter = function() {
      return $scope.reportFilter;
    };

    $scope.openSelectDateRangeDialog = function(value) {

      if (parseInt(value, 10) !== -1 ) {
        return;
      }

      var datePickerInstance = $modal.open({
        backdrop: false,
        keyboard: true,
        backdropClick: true,
        controller: 'ReportDatepickerCtrl',
        templateUrl: 'scripts/reports/reportDatepicker.tpl.html',
        resolve: {
          'reportFilter': $scope.getReportFilter
        }
      });

      datePickerInstance.result.then(function(newRange) {
        setDateRange(newRange);
        generateReportForNDays();
      });
    };

    $scope.$watch('dateRange', function(numberOfDays) {

      if (typeof numberOfDays === 'undefined' || parseInt(numberOfDays, 10) === -1) {
        return;
      }

      // last N days means yesterday - (N - 1) till yesterday
      // e.g. Today is 5th - last 4 days means: 1st,2nd,3rd,4th
      var to = new Date(moment().subtract('days', 1).format('L')).getTime();
      var from = moment(to).subtract('days', numberOfDays).valueOf();

      setDateRange({
        from: new Date(from),
        to: new Date(to)
      });
      generateReportForNDays();
    });

    var generateReportForNDays = function() {

      requestRangeData();
      requestDataForTables();

      angular.forEach($scope.listOfItem, function(item) {
        getTotalEventData(item.dimension, item);
      });
    };

    var setDateRange = function(range) {
      $scope.reportFilter.from = range.from;
      $scope.reportFilter.to = range.to;
    };

    // does selecting of default radio
    $scope.dateRange = $scope.dates[0].value;

    $scope.graphTypes = {
      'liniar': 'Line Graph',
      'bar': 'Bar Graph'
    };
    $scope.grouped = true;
    groupedValueBackup = $scope.grouped;

    $scope.rememberGroupState = function(){
      groupedValueBackup = $scope.grouped;
    };

    $scope.type = 'bar';

    $scope.switchChartType = function() {
      $scope.grouped = groupedValueBackup;

      if ($scope.type === 'liniar') {
        $scope.grouped = false;
      } else {
        $scope.grouped = groupedValueBackup;
      }
    };

    $scope.listOfItem = [
      {
        'name': 'Event Volume',
        'value': '',
        'dimension': 'event_type'
      },
      {
        'name': 'Unique Cookie Volume',
        'value': '',
        'dimension': 'unique_cookie_count'
      }
    ];

    function getTotalEventData(dimension, item) {
      var options = {
        'startTime': $scope.reportFilter.from,
        'endTime': $scope.reportFilter.to,
        'dimension': dimension
      };

      promiseTracker('eventVolumeReport' + dimension).addPromise(ReportsService.getDimensionData(options)
        .then(function(totalEvents) {
          item.value = totalEvents;
        }
      ));
    }

    function requestRangeData() {
      var options = {
        'startTime': moment($scope.reportFilter.from).startOf('day').valueOf(),
        'endTime': moment($scope.reportFilter.to).endOf('day').valueOf()
      };

      promiseTracker('eventVolumeChart').addPromise(ReportsService.getEventVolumeData(options)
        .then(function(volume) {
          $scope.eventVolume = volume;
        })
      );
    }

    function requestDataForTables() {
      var requestOptions = {
        'startTime': moment($scope.reportFilter.from).startOf('day').valueOf(),
        'endTime': moment($scope.reportFilter.to).endOf('day').valueOf()
      };

      promiseTracker('topDestinations')
        .addPromise(ReportsService.getTopDestionations(requestOptions)
          .then(function(data) {
            $scope.topDestinations = data;
          }));

      promiseTracker('topOriginations')
        .addPromise(ReportsService.getTopOriginationsData(requestOptions)
          .then(function(data) {
            $scope.topOriginations = data;
          }));

      promiseTracker('flightServiceClass')
        .addPromise(ReportsService.getServiceClassData(requestOptions)
          .then(function(data) {
            $scope.flightServiceClass = data;
          }));

      promiseTracker('tripDuration')
        .addPromise(ReportsService.getTripDurationData(requestOptions)
          .then(function(data) {
            $scope.tripDuration = data;
          }));

      promiseTracker('bookingLength')
        .addPromise(ReportsService.getBookingLengthData(requestOptions)
          .then(function(data) {
            $scope.bookingLength = data;
          }));
    }
  }]);

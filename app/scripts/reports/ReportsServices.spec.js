'use strict';

describe('Services: ReportsService', function () {

  beforeEach(module('ReportsServices', 'sjDates'));

  var ReportsService, $httpBackend, $scope, $rootScope, requestOptions;

  beforeEach(inject(function ($injector) {
    ReportsService = $injector.get('ReportsService');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $scope.partner = {
      name: 'test'
    };

    $scope.reportFilter = {
      'from': '2013-11-29',
      'to': '2013-11-30'
    };

    requestOptions = {
      'partner': $scope.partner.name,
      'startTime': moment($scope.reportFilter.from).startOf('day').valueOf(),
      'endTime': moment($scope.reportFilter.to).endOf('day').valueOf()
    };
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should have several methods defined', function () {
    expect(ReportsService.getTopDestionations).toBeDefined();
    expect(ReportsService.getTopOriginationsData).toBeDefined();
    expect(ReportsService.getServiceClassData).toBeDefined();
    expect(ReportsService.getDimensionData).toBeDefined();
    expect(ReportsService.getBookingLengthData).toBeDefined();
    expect(ReportsService.getTripDurationData).toBeDefined();
    expect(ReportsService.getEventVolumeData).toBeDefined();
  });

  describe('service should return empty array on server side errors', function () {
    var response, results, expectedResult;

    afterEach(inject(function () {
      $httpBackend.whenGET(/api\/reports\/\?[\w|\-\&|\=|\:|\+]*/).respond(response);
      $httpBackend.flush();
      expect(results).toEqual(expectedResult);
    }));

    it('getTopDestionations should return data', inject(function () {
      response = {
        'meta': {
        },
        'results': [
          {'count': 5, 'value': 'San Francisco'},
          {'count': 4, 'value': 'Newark'},

          {'count': 3, 'value': 'Bamako'},
          {'count': 2, 'value': 'Lucknow'},
          {'count': 1, 'value': 'Bloomington'}
        ]
      };

      ReportsService.getTopOriginationsData(requestOptions)
        .then(function (data) {
          results = data;
        });

      expectedResult = response.results;
    }));

    it('getDimensionData should return data', inject(function () {
      response = {
        'meta': {
          'total_events': 123456
        },
        'results': [
          {},
          {}
        ]
      };
      expectedResult = response.meta.total_events;

      ReportsService.getDimensionData(requestOptions)
        .then(function (data) {
          results = data;
        });
    }));

    it('getEventVolumeData should return data', inject(function ($injector) {
      var ReportUtils = $injector.get('ReportUtils');

      response = {
        'meta': {
          'total_events': 2177752,
          'end-time': '2013-12-01T02:00:00',
          'start-time': '2013-11-30T02:00:00',
          'self': '/api/reports/?date-rollup=True&exclude-blank-values=&start-time=2013-11-30T00:00+0200&end-time=2013-12-01T23:59+0200&dimension=event_type&partner__exact=United',
          'filters': ['partner__exact=United'],
          'dimension': 'event_type'
        },
        'results': [
          {'event_date': '2013-11-29', 'data': {'count': 1, 'value': 'Flight Search'}},
          {'event_date': '2013-11-29', 'data': {'count': 2, 'value': 'Home Page'}},
          {'event_date': '2013-11-29', 'data': {'count': 3, 'value': 'Flight Confirmation'}},
          {'event_date': '2013-11-29', 'data': {'count': 4, 'value': 'Boarding Pass'}},
          {'event_date': '2013-11-30', 'data': {'count': 1, 'value': 'Flight Search'}},
          {'event_date': '2013-11-30', 'data': {'count': 2, 'value': 'Home Page'}},
          {'event_date': '2013-11-30', 'data': {'count': 3, 'value': 'Flight Confirmation'}},
          {'event_date': '2013-11-30', 'data': {'count': 4, 'value': 'Boarding Pass'}}
        ]
      };

      expectedResult = ReportUtils.parseForChartFormat({
        to: moment('2013-11-30'),
        from: moment('2013-11-29'),
        data: response.results
      });

      ReportsService.getEventVolumeData(requestOptions)
        .then(function (data) {
          results = data;
        });
    }));

    it('getBookingLengthData should return data', inject(function ($injector) {
      var rollUpArray = ['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+'];
      var ReportUtils = $injector.get('ReportUtils');

      response = {
        results: [
          {value: '0', count: '1'},
          {value: '1', count: '2'},
          {value: '3', count: '2'},
          {value: '6', count: '1'},
          {value: '10', count: '1'},
          {value: '20', count: '2'},
          {value: '21', count: '2'},
          {value: '60', count: '2'}
        ]
      };

      expectedResult = ReportUtils.rollUpData(rollUpArray, response.results);

      ReportsService.getBookingLengthData(requestOptions)
        .then(function (data) {
          results = data;
        });
    }));

    it('getTripDurationData should return data', inject(function ($injector) {
      var rollUpArray = ['0', '1-3', '4-7', '8-14', '15+'];
      var ReportUtils = $injector.get('ReportUtils');

      response = {
        results: [
          {value: '0', count: '1'},
          {value: '1', count: '2'},
          {value: '3', count: '2'},
          {value: '6', count: '1'},
          {value: '10', count: '1'},
          {value: '20', count: '2'},
          {value: '21', count: '2'},
          {value: '60', count: '2'}
        ]
      };

      expectedResult = ReportUtils.rollUpData(rollUpArray, response.results);

      ReportsService.getTripDurationData(requestOptions)
        .then(function (data) {
          results = data;
        });
    }));

  });

  describe('service should return empty array on server side errors', function () {
    var result;
    var expectedResult;

    beforeEach(function () {
      result = null;
      expectedResult = []; // for most response
      $httpBackend.expectGET(/api\/reports\/\?[\w|\-\&|\=|\:|\+]*/).respond(500, []);
    });

    afterEach(function () {
      $httpBackend.flush();
      expect(result).toEqual(expectedResult);
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('getTopDestionations should return empty array in case of error', inject(function () {
      ReportsService.getTopOriginationsData(requestOptions)
        .then(function (data) {
          result = data;
        });
    }));

    it('getDimensionData should return empty array in case of error', inject(function () {
      ReportsService.getDimensionData(requestOptions)
        .then(function (data) {
          result = data;
        });
    }));

    it('getEventVolumeData should return empty array in case of error', inject(function () {
      expectedResult = {};
      ReportsService.getEventVolumeData(requestOptions)
        .then(function (data) {
          result = data;
        });
    }));

    it('getBookingLengthData should return empty array in case of error', inject(function () {
      expectedResult = {};
      ReportsService.getBookingLengthData(requestOptions)
        .then(function (data) {
          result = data;
        });
    }));

    it('getTripDurationData should return empty array in case of error', inject(function () {
      expectedResult = {};
      ReportsService.getTripDurationData(requestOptions)
        .then(function (data) {
          result = data;
        });
    }));

  });
});

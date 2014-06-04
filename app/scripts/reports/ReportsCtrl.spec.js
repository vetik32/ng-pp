'use strict';

describe('ReportsCtrl', function() {
  var ReportsCtrl, $scope, $rootScope, $controller, $httpBackend, ReportsService, $q;

  beforeEach(module('partnerApp'));

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');
    ReportsService = $injector.get('ReportsService');
    $q = $injector.get('$q');

    var getEventVolumeDataDeferred = $q.defer();
    getEventVolumeDataDeferred.resolve('eventVolumeData');

    spyOn(ReportsService, 'getEventVolumeData').andReturn(getEventVolumeDataDeferred.promise);

    $httpBackend.whenGET('../views/login.html').respond();
    $httpBackend.whenGET(/api\/reports\/\?[\w|\-\&|\=|\:|\+]*/).respond();

    function createController() {
      return $controller('ReportsCtrl', {'$scope': $scope });
    }

    ReportsCtrl = createController();
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should have values before getting reports', function() {
    expect($scope.dates.length).toEqual(3);
    expect($scope.eventVolume).toBeUndefined();
    expect($scope.dateRange).toEqual($scope.dates[0].value);
    expect($scope.reportFilter.from).toBeNull();
    expect($scope.reportFilter.to).toBeNull();
    expect($scope.graphTypes.liniar).toBeDefined();
    expect($scope.graphTypes.bar).toBeDefined();
    expect($scope.grouped).toEqual(true);
    expect($scope.openSelectDateRangeDialog).toBeDefined();
    expect(typeof $scope.openSelectDateRangeDialog).toEqual('function');
    expect($scope.rememberGroupState).toBeDefined();
    expect(typeof $scope.rememberGroupState).toEqual('function');
    expect($scope.type).toEqual('bar');
    expect($scope.switchChartType).toBeDefined();
    expect(typeof $scope.switchChartType).toEqual('function');
    expect($scope.listOfItem).toBeDefined();
    expect($scope.listOfItem.length).toEqual(2);
    $httpBackend.flush();
  });

  it('Should set report filter to default range: (yesterday - 29 days) - yesterday', function() {
    $scope.$digest();
    $httpBackend.flush();
    expect($scope.reportFilter.from).not.toBeNull();
    expect($scope.reportFilter.to).not.toBeNull();
    expect(moment($scope.reportFilter.to).diff(moment($scope.reportFilter.from), 'days')).toBe($scope.dates[0].value);
    //expect(ReportsService.getEventVolumeData).toHaveBeenCalled();
    //expect($scope.eventVolume).toEqual('eventVolumeData');
  });

  it('Should set report filter to 7 days', function() {
    //TODO : to add response check as well

    //spyOn($scope, 'openSelectDateRangeDialog');

    $scope.$digest();
    $scope.dateRange = $scope.dates[1].value;
    $scope.$digest();
    expect(ReportsService.getEventVolumeData).toHaveBeenCalled();

    expect($scope.dateRange).toBe($scope.dates[1].value);
    expect(moment($scope.reportFilter.to).diff(moment($scope.reportFilter.from), 'days')).toBe($scope.dates[1].value);
    $httpBackend.flush();
  });

  it('setting undefined or -1 has not impact on date range', function() {

    $scope.$digest();
    ReportsService.getEventVolumeData.reset();
    $scope.dateRange = undefined;
    $scope.$digest();
    expect(ReportsService.getEventVolumeData).not.toHaveBeenCalled();
    $scope.dateRange = $scope.dates[2].value;
    $scope.$digest();
    expect(ReportsService.getEventVolumeData).not.toHaveBeenCalled();
    $httpBackend.flush();
    expect(moment($scope.reportFilter.to).diff(moment($scope.reportFilter.from), 'days')).toBe($scope.dates[0].value);
  });

  it('should open datepicker if select rage (dates[2]) is selected', inject(function($injector) {
    var $modal = $injector.get('$modal');

    var deffer = $q.defer();

    spyOn($scope, 'getReportFilter');
    spyOn($modal, 'open')
      .andCallThrough()
      .andReturn({
        result: deffer.promise
      });

    $scope.openSelectDateRangeDialog(29);
    expect($modal.open).not.toHaveBeenCalled();

    // last item (select a range) was selected
    $scope.openSelectDateRangeDialog(-1);
    expect($modal.open).toHaveBeenCalled();
    expect(ReportsService.getEventVolumeData).not.toHaveBeenCalled();
    deffer.resolve({
      from: new Date('4/1/2014'),
      to: new Date('4/2/2014')
    });

    $httpBackend.flush();
    expect(ReportsService.getEventVolumeData).toHaveBeenCalled();

  }));

  it('should resolve "resolve" param used by datepicker modal', inject(function() {
    $httpBackend.whenGET('scripts/reports/reportDatepicker.tpl.html').respond();
    spyOn($scope, 'getReportFilter').andCallThrough();
    $scope.openSelectDateRangeDialog(-1);

    expect($scope.getReportFilter).toHaveBeenCalled();
    $httpBackend.flush();
  }));

  it('Should restore grouped to initial state after switching graph type "bar" to type "line"', function() {
    expect($scope.grouped).toBe(true);

    $scope.type = 'liniar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(false);
    $scope.type = 'bar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(true);
    $httpBackend.flush();
  });

  it('Should keep grouped to current state after switching graph type "bar" to type "line"', function() {

    //simulate uncheck grouped checkbox
    $scope.grouped = false;
    $scope.rememberGroupState();
    //simulate changing dropdown
    $scope.type = 'liniar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(false);

    //simulate changing dropdown
    $scope.type = 'bar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(false);

    //simulate changing dropdown
    $scope.type = 'liniar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(false);

    //simulate uncheck grouped checkbox
    $scope.grouped = true;
    $scope.rememberGroupState();

    //simulate changing dropdown
    $scope.type = 'bar';
    $scope.switchChartType();
    expect($scope.grouped).toBe(true);

    $httpBackend.flush();
  });
});

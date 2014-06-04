'use strict';

describe('Controller: ReportDatepickerCtrl', function () {

  // load the controller's module
  beforeEach(module('partnerApp'));
  beforeEach(module('ui.bootstrap.modal'));

  var ReportDatepickerCtrl, createController,
    $scope, $modalInstance;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($injector) {
    var $controller = $injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');
    var $modal = $injector.get('$modal');
    $modalInstance = $modal.open({template: '<div></div>'});

    $scope = $rootScope.$new();
    $scope.$digest();

    createController = function () {
      return $controller('ReportDatepickerCtrl', {
        '$scope': $scope,
        '$modalInstance': $modalInstance,
        'reportFilter': {
          'from': (new Date('1/1/14')).getTime(),
          'to': (new Date('1/2/14')).getTime()
        }
      });
    };

  }));

  it('should have several methods defined', inject(function () {

    ReportDatepickerCtrl = createController({'from': '1-1-203', 'to': '1-2-203'});

    expect($scope.range.to).toBeDefined();
    expect($scope.range.from).toBeDefined();
    expect($scope.select).toBeDefined();
    expect($scope.cancel).toBeDefined();
    expect($scope.rangeIsNotSelected).toBeDefined();
  }));

  it('should be able to select and close methods on modal instance', inject(function () {

    ReportDatepickerCtrl = createController();

    spyOn($modalInstance, 'close');
    spyOn($modalInstance, 'dismiss');

    $scope.select();
    $scope.cancel();

    expect($modalInstance.close).toHaveBeenCalled();
    expect($modalInstance.dismiss).toHaveBeenCalled();
  }));

  it('should return true if date rage didn\'t changed', function () {
    ReportDatepickerCtrl = createController();

    expect($scope.rangeIsNotSelected()).toEqual(true);

    $scope.range.from = (new Date('1/10/14')).getTime();
    expect($scope.rangeIsNotSelected()).toEqual(false);
    $scope.range.from = (new Date('1/1/14')).getTime();
    expect($scope.rangeIsNotSelected()).toEqual(true);

  });
});

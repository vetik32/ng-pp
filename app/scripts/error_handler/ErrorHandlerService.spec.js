/*jshint unused:false */

'use strict';

describe('Error Handler Service', function () {
  var errorMessage = 'An error';
  var element, $scope;

  beforeEach(module('ErrorHandlerService'));

  describe('ErrorHandlerService', function () {

    it('should init with empty body and hidden', inject(function ($rootScope, $compile, ErrorHandler) {

      $scope = $rootScope.$new();
      element = angular.element('<div class="text-error" ng-show="errorMessage" ng-bind="errorMessage"></div>');
      $compile(element)($scope);
      $scope.$digest();

      expect(element.text()).toBe('');
      expect(element.hasClass('ng-hide')).toBe(true);
    }));

    it('should handle error notification', inject(function ($rootScope, $compile, ErrorHandler) {
      $scope = $rootScope.$new();
      element = angular.element('<div class="text-error" ng-show="errorMessage" ng-bind="errorMessage"></div>');
      $compile(element)($scope);
      ErrorHandler.handle(errorMessage);
      $scope.$digest();
      expect(element.text()).toBe(errorMessage);
      expect(element.hasClass('ng-hide')).toBe(false);

    }));

    it('should clear and hide notification', inject(function ($rootScope, $compile, ErrorHandler) {
      $scope = $rootScope.$new();
      element = angular.element('<div class="text-error" ng-show="errorMessage" ng-bind="errorMessage"></div>');
      $compile(element)($scope);
      ErrorHandler.handle(errorMessage);
      $scope.$digest();
      expect(element.text()).toBe(errorMessage);

      ErrorHandler.clear();
      $scope.$digest();
      expect(element.text()).toBe('');
      expect(element.hasClass('ng-hide')).toBe(true);

    }));

    it('should clear and hide notification automatically in 10s', inject(function ($rootScope, $compile, ErrorHandler, $timeout) {
      $scope = $rootScope.$new();
      element = angular.element('<div class="text-error" ng-show="errorMessage" ng-bind="errorMessage"></div>');
      $compile(element)($scope);
      ErrorHandler.handle(errorMessage);
      $scope.$digest();
      expect(element.text()).toBe(errorMessage);
      $timeout.flush();
      expect(element.text()).toBe('');
      expect(element.hasClass('ng-hide')).toBe(true);

    }));

  });

  describe('http delay interceptor', function () {

    it('should abort requests when timeout promise resolves', function () {
      module(function ($httpProvider) {
        $httpProvider.interceptors.push('$httpDelayInterceptor');
      });


      inject(function ($rootScope, $compile, $http, $httpBackend) {

        $scope = $rootScope.$new();
        element = angular.element('<div class="text-error" ng-show="errorMessage" ng-bind="errorMessage"></div>');
        $compile(element)($scope);

        $httpBackend.expect('GET', '/reports').respond(0);
        $http({method: 'GET', url: '/reports'});
        $httpBackend.flush();

        expect(element.text()).toBe('Data could not be retrieved at this time. Please try again.');
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();

      });
    });
  });

});

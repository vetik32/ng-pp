'use strict';

angular.module('ErrorHandlerService', [])
  .constant('ONE_SECOND', 1000)
  .factory('ErrorHandler', ['$rootScope', '$timeout', 'ONE_SECOND',
    function ($rootScope, $timeout, ONE_SECOND) {

      return {
        handle: function (errorMessage) {
          var errorService = this;
          $rootScope.errorMessage = errorMessage;
          $timeout(function () {
            errorService.clear();
          }, 10 * ONE_SECOND);
        },
        clear: function () {
          $rootScope.errorMessage = '';
        }
      };
    }])
  .factory('$httpDelayInterceptor', ['$q', 'ErrorHandler', 'ONE_SECOND',
    function ($q, ErrorHandler, ONE_SECOND) {

      return {
        'request': function (config) {
          config.timeout = 90 * ONE_SECOND;

          return config || $q.when(config);
        },
        responseError: function (rejection) {
          var message = '';

          if (rejection.status === 0) {
            message = 'Data could not be retrieved at this time. Please try again.';
          }
          ErrorHandler.handle(message);

          return $q.reject(rejection);
        }
      };
    }]);

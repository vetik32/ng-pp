'use strict';

angular.module('IntegrationsService', ['ngResource'])
  .factory('IntegrationsGuide', ['$resource', function ($resource) {
    return $resource('data/guide_:guideType.json', {}, {
      query: {
        method: 'GET'
      }
    });
  }]);

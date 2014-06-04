'use strict';

angular.module('PartnerServices', ['ngResource'])
  .factory('PartnerService', function ($log, $resource) {
    return $resource('/admin.json', {}, {
      list: { method: 'GET', isArray: true },
      create: { method: 'POST' }
    });
  });

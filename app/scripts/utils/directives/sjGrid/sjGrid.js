'use strict';

angular.module('sj.grid', [])
    .directive('sjGrid', ['$filter', function ($filter) {
      return {
        restrict: 'A',
        templateUrl: 'scripts/utils/directives/sjGrid/sjGrid.tpl.html',
        scope: {
          limit : '=limit'
        },
        link: function(scope, element, attrs){
          var filters = {};

          scope.$parent.$watch(attrs.sjGrid, function (newVal) {
            var data = newVal;

            if (!data) {
              return;
            }

            if (scope.limit) {
              data = data.slice(0, scope.limit);
            }

            var fieldsToFilter =  _.keys(filters);

            _.each(fieldsToFilter, function(fieldToFilter){
              var filtersToApply = filters[fieldToFilter];

              _.each(data, function(entry){
                for (var index = 0; index < filtersToApply.length; index+= 1) {
                  entry[fieldToFilter] = $filter(filtersToApply[index])(entry[fieldToFilter]);
                }
              })

            });

            scope.data = data;
          });

          if (attrs.headers) {
            scope.headers = attrs.headers.split(',');
          }

          var fields = attrs.fields.split(',');

          _.each(fields, function(field, index){
            var properties =  field.split('|');

            if (properties.length > 1) {
              var fieldToFilter= properties[0];
              filters[fieldToFilter] = properties.slice(1);
              fields[index] = fieldToFilter;
            }
          });
          scope.fields = fields;

          element.find('table').addClass('-with-' + scope.fields.length + '-cols');
        }
      };
    }]);

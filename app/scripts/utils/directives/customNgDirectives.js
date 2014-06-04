(function(angular) {
  'use strict';

  angular.module('CustomNgDirectives', [])
    .directive('ngVisible', function() {
      return function(scope, element, attr) {
        scope.$watch(attr.ngVisible, function ngVisibleWatchAction(value) {
          element.css('visibility', (!!value) ? '' : 'hidden');
        });
      };
    });

}(window.angular));

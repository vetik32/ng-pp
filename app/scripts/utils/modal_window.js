'use strict';

angular.module('template/modal/window.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/modal/window.html',
      '<div class="modal {{ windowClass }}" ng-class="" ng-style="{\'z-index\': 1050 + index*10}" ng-transclude></div>');
}]);

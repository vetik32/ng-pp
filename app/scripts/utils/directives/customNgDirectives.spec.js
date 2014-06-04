describe('Custom Directives', function () {
  var element, $scope;

  beforeEach(module('CustomNgDirectives'));

  describe('Directive: ngVisible', function() {

    it(inject(function($rootScope, $compile) {
      $scope = $rootScope.$new();
      $scope.isVisible = false;
      element = angular.element('<div ng-visible="isVisible">text</div>');
      $compile(element)($scope);
      $scope.$digest();
      expect(element.css('visibility')).toBe('hidden');
      $scope.isVisible = true;
      $scope.$digest();
      expect(element.css('visibility')).toBe('');
    }));
  });
});

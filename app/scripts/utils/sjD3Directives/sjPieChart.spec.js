'use strict';

describe('Directive: PieChartDirective', function () {

  beforeEach(module('sj.d3Directives'));

  var element, scope;

  var dataExample1 = [
    {"count": 50, "value": "aaa"},
    {"count": 25, "value": "bbb"},
    {"count": 12, "value": "ccc"},
    {"count": 13, "value": "ddd"}
  ];

  var dataExample2 = [
    {"count": 5, "value": "aaa"},
    {"count": 10, "value": "bbb"},
    {"count": 25, "value": "ccc"},
    {"count": 50, "value": "ddd"},
    {"count": 100, "value": "eee"},
    {"count": 150, "value": "fff"},
    {"count": 200, "value": "ggg"}
  ];

  var invalidData = [
    {"count": 0, "value": "aaa"},
    {"count": 0, "value": "bbb"},
    {"count": 0, "value": "ccc"},
    {"count": 0, "value": "ddd"},
    {"count": 0, "value": "eee"},
    {"count": 0, "value": "fff"},
    {"count": 0, "value": "ggg"}
  ];

  function renderPieChart($compile, $rootScope, data2Test, elementTemplate) {

     var template = elementTemplate || '<div sj-pie-chart val="myData"></div>';
     inject(function($rootScope, $compile) {
       scope = $rootScope;

       scope.$apply(function() {
         scope.myData = data2Test;
       });

       element = angular.element(template);
       $compile(element)(scope);
       scope.$digest();
     });
  }

  function checkPieChart(data2Test, limit) {

     var data2Test = _.sortBy(data2Test, function(entry){
       return entry.value;
     });

     var svg = element.find('svg');
     expect(svg.length).toBe(1);
     expect(svg.find('.no-data').length).toBe(0);

     //it should contain legend (.legend) element with dataExample1.length
     var _$legend = $(svg).find('.legend');
     expect(_$legend.length).toBe(1);
     //it should contain 4 groups

    var length = limit || data2Test.length;
    expect(_$legend.find('> g').length).toBe(length);
     // each group should contain 2 text(label+value) + 1 circle element
     expect(_$legend.find('text').length).toBe(length * 2);
     expect(_$legend.find('circle').length).toBe(length);

     var _$labels = _$legend.find('> g text.label');
     var _$values = _$legend.find('> g text.value');

     for (var i = 0; i < length; i += 1) {
       expect(_$labels.eq(i).text()).toBe(data2Test[i].value);
       expect(_$values.eq(i).text()).toBe('' + data2Test[i].count);
     }

   }

  it('should render svg with 2 groups canvas,legend', inject(function ($rootScope, $compile) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element('<div sj-pie-chart val="myData" emptyText="No Data."></div>');
      $compile(element)(scope);
      scope.$digest();
    });

    var svg = element.find('svg');
    expect(svg.length).toBe(1);

    expect(svg.find('g').length).toBe(2);
  }));

  it('should render svg with 2 groups canvas,legend and a text - "No data."', inject(function ($rootScope, $compile) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;
      scope.$apply(function() {
        scope.myData = [];
      });

      element = angular.element('<div sj-pie-chart val="myData" emptyText="No Data."></div>');
      $compile(element)(scope);
      scope.$digest();

    });

    var svg = element.find('svg');
    expect(svg.length).toBe(1);

    expect(svg.find('g').length).toBe(2);
    expect(svg.find('text').text()).toBe('No Data.');
  }));

  it('should render limited to five elements', inject(function ($rootScope, $compile) {
    renderPieChart($compile, $rootScope, dataExample2,
      '<div sj-pie-chart val="myData" limit="5"></div>');
    checkPieChart(dataExample2, 5);
  }));


  it('should create a pie chart', inject(function($compile, $rootScope) {
    renderPieChart($compile, $rootScope, dataExample1);
    checkPieChart(dataExample1);
  }));

  it('should update existing pie chart', inject(function($compile, $rootScope) {
    renderPieChart($compile, $rootScope, dataExample1);

    checkPieChart(dataExample1);
    scope.$apply(function() {
      scope.myData = dataExample2;
    });
    checkPieChart(dataExample2);
  }));

  it('should clear existing pie chart then create another one', inject(function($compile, $rootScope) {

    scope = $rootScope;
    element = angular.element('<div sj-pie-chart val="myData" emptyText="No hay datos."></div>');
    $compile(element)(scope);
    scope.$digest();

    var svg = element.find('svg');
    expect(svg.length).toBe(1);

    expect(svg.find('g').length).toBe(2);

    scope.$apply(function() {
      scope.myData = dataExample1;
    });

    checkPieChart(dataExample1);

    scope.$apply(function() {
      scope.myData = [];
    });

    expect(svg.find('text').text()).toBe('No hay datos.');

    scope.$apply(function() {
      scope.myData = dataExample2;
    });
    checkPieChart(dataExample2);

  }));

  it('should ignore empty data', inject(function($compile, $rootScope) {

    scope = $rootScope;
    scope.myData = invalidData;

    element = angular.element('<div sj-pie-chart val="myData" emptyText="No hay datos."></div>');
    $compile(element)(scope);
    scope.$digest();

    var svg = element.find('svg');
    expect(svg.length).toBe(1);

    expect(svg.find('g').length).toBe(2);
    expect(svg.find('text').text()).toBe('No hay datos.');
  }));
});

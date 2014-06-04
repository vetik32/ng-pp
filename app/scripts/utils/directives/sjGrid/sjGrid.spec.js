'use strict';

describe('Directive: sj', function () {

  beforeEach(module('sj.grid'));

  beforeEach(module('scripts/utils/directives/sjGrid/sjGrid.tpl.html'));

  var element, scope;

  it('should create table with header, body limited to 3', inject(function($compile, $rootScope) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;

      scope.$apply(function() {
        var localData = [];
        for (var i = 1; i < 6; i += 1) {
          localData.push({
            'label': 'label ' + String.fromCharCode(64 + i),
            'value': 'value ' + i
          });
        }
        scope.myData = localData;
      });

      element = angular.element('<div sj-grid="myData" headers="Label,Value" fields="label,value" limit="3"></div>');
      scope = $rootScope;
      $compile(element)(scope);
      scope.$digest();
    });

    var table = element.find('table');
    var header = table.find('thead');
    var body = table.find('tbody');
    var dataRows = body.find('tr');

    expect(table.length).toBe(1);
    expect(table.hasClass('-with-2-cols')).toBe(true);
    expect(header.length).toBe(1);
    expect(header.find('tr').length).toBe(1);
    expect(header.find('th').length).toBe(2);
    expect(header.find('th').eq(0).text()).toBe('Label');
    expect(header.find('th').eq(1).text()).toBe('Value');
    expect(body.length).toBe(1);

    expect(dataRows.length).toBe(3);


    expect(dataRows.eq(0).find('td').eq(0).text()).toBe('label A');
    expect(dataRows.eq(0).find('td').eq(1).text()).toBe('value 1');
    expect(dataRows.eq(1).find('td').eq(0).text()).toBe('label B');
    expect(dataRows.eq(1).find('td').eq(1).text()).toBe('value 2');
  }));

  it('should create table with header, no body', inject(function($compile, $rootScope) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;

      element = angular.element('<div sj-grid="myData2" headers="Label,Value,Test" fields="label,value,test" limit="3"></div>');
      scope = $rootScope;
      $compile(element)(scope);
      scope.$digest();
    });

    var table = element.find('table');
    var header = table.find('thead');
    var body = table.find('tbody');
    var dataRows = body.find('tr');

    expect(table.length).toBe(1);
    expect(table.hasClass('-with-3-cols')).toBe(true);
    expect(header.length).toBe(1);
    expect(header.find('tr').length).toBe(1);
    expect(header.find('th').length).toBe(3);
    expect(header.find('th').eq(0).text()).toBe('Label');
    expect(header.find('th').eq(1).text()).toBe('Value');
    expect(body.length).toBe(1);

    expect(dataRows.length).toBe(0);
  }));

  it('should create table with header, body limited to 3, filtered', inject(function($compile, $rootScope) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;

      scope.$apply(function() {
        var localData = [];
        for (var i = 1; i < 6; i += 1) {
          localData.push({
            'label': 'label ' + String.fromCharCode(64 + i),
            'value':  i * 1000000
          });
        }
        scope.myData = localData;
      });

      element = angular.element('<div sj-grid="myData" headers="Label,Value" fields="label|uppercase,value|number" limit="3"></div>');
      scope = $rootScope;
      $compile(element)(scope);
      scope.$digest();
    });

    var table = element.find('table');
    var header = table.find('thead');
    var body = table.find('tbody');
    var dataRows = body.find('tr');

    expect(table.length).toBe(1);
    expect(table.hasClass('-with-2-cols')).toBe(true);
    expect(header.length).toBe(1);
    expect(header.find('tr').length).toBe(1);
    expect(header.find('th').length).toBe(2);
    expect(header.find('th').eq(0).text()).toBe('Label');
    expect(header.find('th').eq(1).text()).toBe('Value');
    expect(body.length).toBe(1);

    expect(dataRows.length).toBe(3);

    expect(dataRows.eq(0).find('td').eq(0).text()).toBe('LABEL A');
    expect(dataRows.eq(0).find('td').eq(1).text()).toBe('1,000,000');
    expect(dataRows.eq(1).find('td').eq(0).text()).toBe('LABEL B');
    expect(dataRows.eq(1).find('td').eq(1).text()).toBe('2,000,000');
    expect(dataRows.eq(2).find('td').eq(0).text()).toBe('LABEL C');
    expect(dataRows.eq(2).find('td').eq(1).text()).toBe('3,000,000');
  }));

});

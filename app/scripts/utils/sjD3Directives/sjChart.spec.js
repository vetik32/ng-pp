'use strict';

describe('Directive: sjChart', function () {


  var flushAllD3Transitions = function () {
    var now = Date.now;
    Date.now = function () {
      return Infinity;
    };
    d3.timer.flush();
    Date.now = now;
  };


  beforeEach(module('sj.d3Directives'));

  var element, scope;

  var dataExample1 = {
    "Cruise Search" : [
      {
        "time": 1328738400000,
        "count": 10
      },
      {
        "time": 1328824800000,
        "count": 20
      }],
    "Hotel Search" : [
      {
        "time": 1328738400000,
        "count": 20
      },
      {
        "time": 1328824800000,
        "count": 40
      }]
  };

  var dataExample2 = {
    "Cruise Search" : [
      {
        "time": 1328306400000,
        "count": 50
      },
      {
        "time": 1328392800000,
        "count": 40
      },
      {
        "time": 1328479200000,
        "count": 30
      },
      {
        "time": 1328565600000,
        "count": 20
      },
      {
        "time": 1328652000000,
        "count": 10
      }],
    "Hotel Search" : [
      {
        "time": 1328306400000,
        "count": 55
      },
      {
        "time": 1328392800000,
        "count": 55
      },
      {
        "time": 1328479200000,
        "count": 35
      },
      {
        "time": 1328565600000,
        "count": 35
      },
      {
        "time": 1328652000000,
        "count": 25
      }],
    "Flight Search": [
      {
        "time": 1328306400000,
        "count": 10
      },
      {
        "time": 1328392800000,
        "count": 20
      },
      {
        "time": 1328479200000,
        "count": 30
      },
      {
        "time": 1328565600000,
        "count": 40
      },
      {
        "time": 1328652000000,
        "count": 50
      }]
  };

  function renderAChart($rootScope, $compile, data) {
    scope = $rootScope;

    scope.$apply(function() {
      scope.myData = data;
    });

    element = angular.element('<div sj-chart val="myData" emptytext="No hay datos."></div>');
    $compile(element)(scope);
    scope.$digest();
  }

  it('should create empty svg element with "canvas" inside', inject(function($compile, $rootScope) {

    inject(function($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element('<div sj-chart val="myEmptyData" ></div>');
      $compile(element)(scope);
      scope.$digest();
    });


    var svg = element.find('svg');
    expect(svg.length).toBe(1);
    expect(svg.find('g').length).toBe(1);
    expect(svg.find('g').attr('class')).toBe('canvas');
  }));

  it('should create a chart (line)', inject(function($compile, $rootScope) {

    renderAChart($rootScope, $compile, dataExample1);

    var svg = element.find('svg');
    expect(svg.length).toBe(1);
    var _$canvas = $(svg).find('.canvas');
    expect(_$canvas.length).toBe(1);
    var _$canvasComponents = _$canvas.find('> g');

    //it should contains .bar element with 2 groups with 2 rect elements each
    var _$barsComponent = _$canvasComponents.filter('.bar');
    expect(_$barsComponent.length).toBe(1);

    expect(_$barsComponent.find('g').length).toBe(2);  // dataExample1.1stlevel.length
    expect(_$barsComponent.find('rect').length).toBe(4); //dataExample1.2ndlevel.length

    //it should contains .liniar element with 2 groups with one path each
    var _$liniarComponent = _$canvasComponents.filter('.liniar');
    expect(_$liniarComponent.length).toBe(1);
    expect(_$liniarComponent.find('> g').length).toBe(2);
    expect(_$liniarComponent.find('path').length).toBe(2);

    //it should contains legend (.legendWrap) element with 2 groups with 1 text element each
    var _$legendWrap = _$canvasComponents.filter('.legendWrap');
    expect(_$legendWrap.length).toBe(1);
    expect(_$legendWrap.find('g').length).toBe(2);
    // each group should contain rect and text element
    expect(_$legendWrap.find('rect').length).toBe(2);
    expect(_$legendWrap.find('text').length).toBe(2);

    // legend text should be equal to dataExample1.1stParamName, dataExample1.2ndParamName
    expect(_$legendWrap.find('text').eq(0).text()).toBe('Cruise Search');
    expect(_$legendWrap.find('text').eq(1).text()).toBe('Hotel Search');

    expect(_$canvasComponents.filter('.rules').length).toBe(1);
    expect(_$canvasComponents.filter('.labels').length).toBe(1);
    expect(_$canvasComponents.length).toBe(5);
  }));

  it('should update existing chart', inject(function($compile, $rootScope) {

    scope = $rootScope;
    renderAChart($rootScope, $compile, dataExample1);

    scope.$apply(function() {
      scope.myData = dataExample2;
    });

    var svg = element.find('svg');
    expect(svg.length).toBe(1);
    var _$canvas = $(svg).find('.canvas');
    expect(_$canvas.length).toBe(1);
    var _$canvasComponents = _$canvas.find('> g');

    //it should contains .bar element with 2 groups with 2 rect elements each
    var _$barsComponent = _$canvasComponents.filter('.bar');
    expect(_$barsComponent.length).toBe(1);

    expect(_$barsComponent.find('g').length).toBe(3);  // dataExample1.1stlevel.length
    expect(_$barsComponent.find('rect').length).toBe(15); //dataExample1.2ndlevel.length

    //it should contains .liniar element with 2 groups with one path each
    var _$liniarComponent = _$canvasComponents.filter('.liniar');
    expect(_$liniarComponent.length).toBe(1);
    expect(_$liniarComponent.find('> g').length).toBe(3);
    expect(_$liniarComponent.find('path').length).toBe(3);

    //it should contains legend (.legendWrap) element with 2 groups with 1 text element each
    var _$legendWrap = _$canvasComponents.filter('.legendWrap');
    expect(_$legendWrap.length).toBe(1);
    expect(_$legendWrap.find('g').length).toBe(3);
    // each group should contain rect and text element
    expect(_$legendWrap.find('rect').length).toBe(3);
    expect(_$legendWrap.find('text').length).toBe(3);

    // legend text should be equal to dataExample1.1stParamName, dataExample1.2ndParamName
    expect(_$legendWrap.find('text').eq(0).text()).toBe('Cruise Search');
    expect(_$legendWrap.find('text').eq(1).text()).toBe('Hotel Search');
    expect(_$legendWrap.find('text').eq(2).text()).toBe('Flight Search');

    expect(_$canvasComponents.filter('.rules').length).toBe(1);
    expect(_$canvasComponents.filter('.labels').length).toBe(1);
    expect(_$canvasComponents.length).toBe(5);
  }));

  it('should show no data text when there is no data', inject(function($compile, $rootScope) {

    scope = $rootScope;
    scope.myData = {};

    element = angular.element('<div sj-chart val="myData" emptytext="No hay datos."></div>');
    $compile(element)(scope);
    scope.$digest();

    var svg = element.find('svg');
    expect(svg.length).toBe(1);
    expect(svg.find('text').text()).toBe('No hay datos.');

    scope.myData = dataExample1;
    scope.$digest();

    var _$noDataText = $(svg).find('.no-data');
    expect(_$noDataText.length).toBe(0);
  }));

  it('should show no data text when there are some data then it\'s updated to empty data', inject(function($compile, $rootScope) {
    scope = $rootScope;
    renderAChart($rootScope, $compile, dataExample1);

    var svg = element.find('svg');
    expect(svg.length).toBe(1);
    var _$canvas = $(svg).find('.canvas');
    expect(_$canvas.length).toBe(1);
    var _$canvasComponents = _$canvas.find('> g');

    //it should contains .bar element with 2 groups with 2 rect elements each
    var _$barsComponent = _$canvasComponents.filter('.bar');
    expect(_$barsComponent.length).toBe(1);

    expect(_$barsComponent.find('g').length).toBe(2);  // dataExample1.1stlevel.length
    expect(_$barsComponent.find('rect').length).toBe(4); //dataExample1.2ndlevel.length

    //it should contains .liniar element with 2 groups with one path each
    var _$liniarComponent = _$canvasComponents.filter('.liniar');
    expect(_$liniarComponent.length).toBe(1);
    expect(_$liniarComponent.find('> g').length).toBe(2);
    expect(_$liniarComponent.find('path').length).toBe(2);

    //it should contains legend (.legendWrap) element with 2 groups with 1 text element each
    var _$legendWrap = _$canvasComponents.filter('.legendWrap');
    expect(_$legendWrap.length).toBe(1);
    expect(_$legendWrap.find('g').length).toBe(2);
    // each group should contain rect and text element
    expect(_$legendWrap.find('rect').length).toBe(2);
    expect(_$legendWrap.find('text').length).toBe(2);

    // legend text should be equal to dataExample1.1stParamName, dataExample1.2ndParamName
    expect(_$legendWrap.find('text').eq(0).text()).toBe('Cruise Search');
    expect(_$legendWrap.find('text').eq(1).text()).toBe('Hotel Search');

    expect(_$canvasComponents.filter('.rules').length).toBe(1);
    expect(_$canvasComponents.filter('.labels').length).toBe(1);
    expect(_$canvasComponents.length).toBe(5);

    scope.$apply(function() {
      scope.myData = [];
    });

    svg = element.find('svg');
    expect(svg.length).toBe(1);
    expect(svg.find('text').text()).toBe('No hay datos.');

  }));

  it('should transition from stack mode to bar, when grouped is modified',
    inject(function ($injector) {

      var $compile = $injector.get('$compile');
      var $rootScope = $injector.get('$rootScope');
      var $scope = $rootScope.$new();


      var element = angular.element('<div sj-chart val="myData" grouped="grouped"></div>');

      $compile(element)($scope);

      $scope.$apply(function () {
        $scope.grouped = true;
        $scope.myData = dataExample1;
      });

      flushAllD3Transitions();

      var svg = element.find('svg');
      var gBar = svg.find('g.data.bar');
      var gLayers = gBar.find('.layer');
      var rects = gBar.find('rect');

      expect(gLayers.length).toEqual(2);  // dataExample1.keys
      expect(rects.length).toEqual(4);   // dataExample1.keys * days

      var barWidth = rects[0].width.baseVal.value;
      expect(rects[0].width.baseVal.value).toEqual(rects[1].width.baseVal.value);   // dataExample1.keys * days
      expect(rects[1].width.baseVal.value).toEqual(rects[2].width.baseVal.value);   // dataExample1.keys * days

      $scope.$apply(function () {
        $scope.grouped = false;
      });
      $scope.$digest();

      expect(element.find('rect')[0].width.baseVal.value).toBeLessThan(barWidth);

    }));


  it('should render legend in two rows', inject(function ($injector) {
    var dataExample = {
      'Cruise Search': [
        {
          'time': 1328306400000,
          'count': 50
        }
      ],
      'Hotel Search': [
        {
          'time': 1328306400000,
          'count': 55
        }
      ],
      'Flight Confirmation': [
        {
          'time': 1328306400000,
          'count': 10
        }
      ]
    };

    var $compile = $injector.get('$compile');
    var $rootScope = $injector.get('$rootScope');
    var sjD3Utils = $injector.get('sjD3Utils');
    var $scope = $rootScope.$new();
    var element = angular.element('<div sj-chart val="myData" grouped="grouped"></div>');
    spyOn(sjD3Utils, 'getNodeWidth').andReturn(200);

    $compile(element)($scope);

    $scope.$apply(function () {
      $scope.grouped = true;
      $scope.myData = dataExample;
    });

    //flushAllD3Transitions();

    var svg = element.find('svg');
    var legend = svg.find('.legendWrap');
    var textGroups = legend.find('g');

    expect(textGroups.length).toEqual(3);
    expect(textGroups[0].getAttribute('transform')).toEqual('translate(5,5)');    // 1st position
    expect(textGroups[1].getAttribute('transform')).toEqual('translate(240,5)');  // same row , 1st group x + 200 fake return + 35 padding
    expect(textGroups[2].getAttribute('transform')).toEqual('translate(5,25)');   // next row 5 for x 25 for y

  }));
});

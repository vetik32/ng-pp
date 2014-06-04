'use strict';

describe('SJ D3 Util', function () {

  var utilInstance;

  beforeEach(module('sj.d3Directives'));

  beforeEach(inject(function ($injector) {
    utilInstance = $injector.get('sjD3Utils');
  }));

  it('should be defined', function() {
    expect(utilInstance).toBeDefined();
    expect(utilInstance.getTicksCount).toBeDefined();
  });

  it('should return number of ticks to be used to draw grid lines fox Y axe', function() {
    expect(utilInstance.getTicksCount(1200)).toEqual(10);
    expect(utilInstance.getTicksCount(3300)).toEqual(6); // 3500 display as maximum, 7 ticks
    expect(utilInstance.getTicksCount(4200)).toEqual(8);
  });

});

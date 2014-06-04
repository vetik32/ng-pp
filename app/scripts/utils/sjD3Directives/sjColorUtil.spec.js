'use strict';

describe('SJ Color Util', function () {

  var utilInstance;

  beforeEach(module('sj.d3Directives'));

  beforeEach(inject(function ($injector) {
    utilInstance = $injector.get('sjColorUtil');
  }));

  it('should be defined', function() {
    expect(utilInstance).toBeDefined();
  });

  it('should throw an exception when undefined key is used', function() {
    expect(function() {
      utilInstance.getColor('zzz');
    }).toThrow(new Error('sjColorUtil: no color for key: zzz'));
  });

  it('should throw an exception when we exceed the limit of unknown keys', function() {
    expect(function() {
      utilInstance.buildPalette(String('abcdefgh').split(''));
    }).toThrow(new Error('sjColorUtil: exceed unknown keys limit'));
  });

  it('should build color map, and return a color', inject(function($injector) {
    var map = ['Flight Search','Car Search'];
    var mapExtra = ['Marine Search', 'Various Search'];
    var SJ_COLOR_MAP = $injector.get('SJ_COLOR_MAP');
    var SJ_ADDITIONAL_COLOR_ARRAY = $injector.get('SJ_ADDITIONAL_COLOR_ARRAY');
    expect(utilInstance.getColor).toBeDefined();
    expect(utilInstance.buildPalette).toBeDefined();

    utilInstance.buildPalette(mapExtra);

    for (var i = 0; i < map.length;i+=1) {
      var key = map[i];
      expect(utilInstance.getColor(key)).toEqual(SJ_COLOR_MAP[key]);
    }

    for (var j = 0; j < mapExtra.length; j+=1) {
      var anotherKey = mapExtra[j];
      expect(utilInstance.getColor(anotherKey)).toEqual(SJ_ADDITIONAL_COLOR_ARRAY[j]);
    }

  }));

});

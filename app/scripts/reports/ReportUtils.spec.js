'use strict';

describe('ReportUtils: Rollup', function () {

  beforeEach(module('ReportsServices'));

  describe('count filters', function () {

    it('should count values less than 6',
      inject(function (ReportUtils) {
        var input = [
          {value: '0', count: '1'},
          {value: '1', count: '2'},
          {value: '3', count: '2'}
        ];

        expect(ReportUtils.rollUpData(['0', '1', '2', '3', '4', '5', '6+'], input)).toEqual([
          {value: '0', count: 1},
          {value: '1', count: 2},
          {value: '2', count: 0},
          {value: '3', count: 2},
          {value: '4', count: 0},
          {value: '5', count: 0},
          {value: '6+', count: 0}
        ]);

        expect(ReportUtils.rollUpData(['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+'], input))
          .toEqual([
            {value: '0', count: 1},
            {value: '1-3', count: 4},
            {value: '4-7', count: 0},
            {value: '8-14', count: 0},
            {value: '15-21', count: 0},
            {value: '22-30', count: 0},
            {value: '31-45', count: 0},
            {value: '46+', count: 0}
          ]);
      }));

    it('should group and count values equal or greater than 6',
      inject(function (ReportUtils) {
        var input = [
          {value: '6', count: '1'},
          {value: '20', count: '2'},
          {value: '21', count: '2'},
          {value: '60', count: '2'}
        ];

        expect(ReportUtils.rollUpData(['0', '1', '2', '3', '4', '5', '6+'], input)).toEqual([
          {value: '0', count: 0},
          {value: '1', count: 0},
          {value: '2', count: 0},
          {value: '3', count: 0},
          {value: '4', count: 0},
          {value: '5', count: 0},
          {value: '6+', count: 7}
        ]);

        expect(ReportUtils.rollUpData(['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+'], input))
          .toEqual([
            {value: '0', count: 0},
            {value: '1-3', count: 0},
            {value: '4-7', count: 1},
            {value: '8-14', count: 0},
            {value: '15-21', count: 4},
            {value: '22-30', count: 0},
            {value: '31-45', count: 0},
            {value: '46+', count: 2}
          ]);
      }));

    it('should group and count values equal or greater than 6 and count values less than 6',
      inject(function (ReportUtils) {
        var input = [
          {value: '0', count: '1'},
          {value: '1', count: '2'},
          {value: '3', count: '2'},
          {value: '6', count: '1'},
          {value: '10', count: '1'},
          {value: '20', count: '2'},
          {value: '21', count: '2'},
          {value: '60', count: '2'}
        ];

        expect(ReportUtils.rollUpData(['0', '1', '2', '3', '4', '5', '6+'], input)).toEqual([
          {value: '0', count: 1},
          {value: '1', count: 2},
          {value: '2', count: 0},
          {value: '3', count: 2},
          {value: '4', count: 0},
          {value: '5', count: 0},
          {value: '6+', count: 8}
        ]);

        expect(ReportUtils.rollUpData(['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+'], input))
          .toEqual([
            {value: '0', count: 1},
            {value: '1-3', count: 4},
            {value: '4-7', count: 1},
            {value: '8-14', count: 1},
            {value: '15-21', count: 4},
            {value: '22-30', count: 0},
            {value: '31-45', count: 0},
            {value: '46+', count: 2}
          ]);
      }));

    it('should return undefined if passed in undefined',
      inject(function (ReportUtils) {
        var input;
        var output;
        expect(ReportUtils.rollUpData(['0', '1', '2', '3', '4', '5', '6+'], input))
          .toEqual(output);

        expect(ReportUtils.rollUpData(['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+'], input))
          .toEqual(output);
      }));
  });

  describe('parse for chart format', function () {
    var ReportUtils, input, expectedOutput, output;

    beforeEach(inject(function ($injector) {
      ReportUtils = $injector.get('ReportUtils');
    }));

    it('should return empty object when params is empty or undefined', function () {
      input = {};
      expectedOutput = {};

      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "to" is missing or it is not a moment object');

      input.to = 1;
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "to" is missing or it is not a moment object');
      input.to = moment(new Date());

      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "from" is missing or it is not a moment object');

      input.from = 2;
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "from" is missing or it is not a moment object');
      input.from = moment(new Date());

      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "data" is missing or it is not an array');

      input.data = 1;
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "data" is missing or it is not an array');

      input.data = [];
      expect(ReportUtils.parseForChartFormat(input)).toEqual(expectedOutput);
    });

    it('should throw and error if format is not right', function () {
      var input = {
        to: moment('2013-11-30'),
        from: moment('2013-11-29')
      };

      input.data_wrong = 1;
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('param "data" is missing or it is not an array');
      delete input.data_wrong;

      input.data = [
        {'data_wrong': {}}
      ];
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('invalid format: "data item" should have data field');
      delete input.data;

      input.data = [
        {'data': { count_wrong: '1'}}
      ];
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('invalid format: "data field" should have count field');
      delete input.data;

      input.data = [
        {'data': { count: '1', 'value_wrong': 'zzz'}}
      ];
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('invalid format: "data field" should have value field');
      delete input.data;

      input.data = [
        {'event_date_wrong': '1-1-1', 'data': { count: '1', 'value': 'zzz'}}
      ];
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).toThrow('invalid format: "data item" should have event_date field');
      delete input.data;

      input.data = [
        {'event_date': '2013-11-21', 'data': { count: '1', 'value': 'zzz'}}
      ];
      expect(function () {
        output = ReportUtils.parseForChartFormat(input);
      }).not.toThrow();

      expect(output).not.toBe({});

    });

    it('should return data for drawing with d3', function () {
      var input = {
        to: moment('2013-12-01'),
        from: moment('2013-11-29'),
        data: [
          {'event_date': '2013-11-29', 'data': {'count': 1, 'value': 'Flight Search'}},
          {'event_date': '2013-11-29', 'data': {'count': 2, 'value': 'Home Page'}},
          {'event_date': '2013-11-29', 'data': {'count': 3, 'value': 'Flight Confirmation'}},
          {'event_date': '2013-11-29', 'data': {'count': 4, 'value': 'Boarding Pass'}},
          {'event_date': '2013-11-30', 'data': {'count': 1, 'value': 'Flight Search'}},
          {'event_date': '2013-11-30', 'data': {'count': 2, 'value': 'Home Page'}},
          {'event_date': '2013-11-30', 'data': {'count': 3, 'value': 'Flight Confirmation'}},
          {'event_date': '2013-11-30', 'data': {'count': 4, 'value': 'Boarding Pass'}}
        ]
      };

      var output = {
        'Flight Search': [
          {'count': 1, 'time': moment('2013-11-29').valueOf()},
          {'count': 1, 'time': moment('2013-11-30').valueOf()},
          {'count': 0, 'time': moment('2013-12-01').valueOf()}
        ],
        'Home Page': [
          {'count': 2, 'time': moment('2013-11-29').valueOf()},
          {'count': 2, 'time': moment('2013-11-30').valueOf()},
          {'count': 0, 'time': moment('2013-12-01').valueOf()}
        ],
        'Flight Confirmation': [
          {'count': 3, 'time': moment('2013-11-29').valueOf()},
          {'count': 3, 'time': moment('2013-11-30').valueOf()},
          {'count': 0, 'time': moment('2013-12-01').valueOf()}
        ],
        'Boarding Pass': [
          {'count': 4, 'time': moment('2013-11-29').valueOf()},
          {'count': 4, 'time': moment('2013-11-30').valueOf()},
          {'count': 0, 'time': moment('2013-12-01').valueOf()}
        ]
      };

      var parsedData = ReportUtils.parseForChartFormat(input);
      expect(parsedData).toEqual(output);
    });

  });
});

/*jshint unused:false */

'use strict';


angular.module('ReportsServices', ['ngResource', 'Auth'])
  .factory('ReportsService',
    ['$resource', '$q', 'ReportUtils', '$filter', 'AuthService',
    function($resource, $q, ReportUtils, $filter, AuthService) {

      var sanitizeTimeParameters = function (parameters) {
        parameters.startTime = $filter('sjISO_8601_Date')(parameters.startTime);
        parameters.endTime = $filter('sjISO_8601_Date')(parameters.endTime);
      };

      var getReportResource = function () {
        return $resource('api/reports/?date-rollup=:dateRollup&exclude-blank-values=:excludeBlankValues&start-time=:startTime&end-time=:endTime&dimension=:dimension&partner__exact=:partner', {}, {
          query: {
            method: 'GET',
            params: {
              partner: AuthService.getUserName()
            }
          },
          noBlankValuesQuery: {
            method: 'GET',
            params: {
              partner: AuthService.getUserName(),
              excludeBlankValues: 'True'
            }
          },
          eventTypeQuery: {
            method: 'GET',
            params: {
              partner: AuthService.getUserName(),
              dimension: 'event_type',
              dateRollup: 'True'
            }
          }
        });
      };

      var getDataPromise = function (options) {
        var parameters = options.parameters,
          trackerId = options.trackerId,
          rollUpArray = options.rollUpArray;
        var deferred = $q.defer();

        sanitizeTimeParameters(parameters);

        getReportResource().query(parameters, {
          tracker: trackerId
        }, function (response) {
          var bookingLengthData = ReportUtils.rollUpData(rollUpArray, response.results);
          deferred.resolve(bookingLengthData);
        }, function () {
          deferred.resolve([]);
        });

        return  deferred.promise;
      };

      var getBookingLengthData = function (parameters) {
        return getDataPromise({
          'parameters': angular.extend({dimension: 'booking_window'}, parameters),
          'trackerId': 'bookingLength',
          'rollUpArray': ['0', '1-3', '4-7', '8-14', '15-21', '22-30', '31-45', '46+']
        });
      };

      var getTripDurationData = function (parameters) {
        return getDataPromise({
          'parameters': angular.extend({dimension: 'trip_duration'}, parameters),
          'trackerId': 'tripDuration',
          'rollUpArray': ['0', '1-3', '4-7', '8-14', '15+']
        });
      };

      var getEventVolumeData = function (parameters) {
        var deferred = $q.defer();
        var from = moment(parameters.startTime);
        var to = moment(parameters.endTime);

        sanitizeTimeParameters(parameters);

        getReportResource().eventTypeQuery(parameters, {
          tracker: 'eventVolumeChart'
        }, function (response) {

          var volume = ReportUtils.parseForChartFormat({
            data: response.results,
            from: from,
            to: to
          });

          deferred.resolve(volume);
        }, function () {
          deferred.resolve({});
        });

        return  deferred.promise;
      };

      var getDimensionData = function (parameters) {
        var deferred = $q.defer();
        var total_events = 0;
        sanitizeTimeParameters(parameters);

        getReportResource().query(parameters, {
          tracker: 'eventVolumeReport' + parameters.dimension
        }, function (response) {
          if (response.meta && response.meta.total_events) {
            total_events = response.meta.total_events;
          }
          deferred.resolve(total_events);
        }, function () {
          deferred.resolve([]);
        });

        return  deferred.promise;
      };

      var getData = function (promiseName, parameters) {
        var deferred = $q.defer();

        sanitizeTimeParameters(parameters);

        getReportResource().noBlankValuesQuery(parameters, {
          tracker: promiseName
        }, function (response) {
          deferred.resolve(response.results);
        }, function () {
          deferred.resolve([]);
        });

        return  deferred.promise;
      };

      return {
        getReportResource: getReportResource,
        getTopDestionations: function (parameters) {
          return getData('topDestinations', angular.extend({dimension: 'top_destinations'}, parameters));
        },
        getTopOriginationsData: function (parameters) {
          return getData('topOriginations', angular.extend({dimension: 'top_origins'}, parameters));
        },
        getServiceClassData: function (parameters) {
          return getData('flightServiceClass', angular.extend({dimension: 'service_class'}, parameters));
        },
        getDimensionData: getDimensionData,
        getBookingLengthData: getBookingLengthData,
        getTripDurationData: getTripDurationData,
        getEventVolumeData: getEventVolumeData
      };
    }])
  .factory('ReportUtils', function () {
    function inRange(value, comparator) {
      var startValue, endValue;

      if (comparator.indexOf('-') !== -1) {           // range is a startValue-endValue
        startValue = comparator.split('-')[0];
        endValue = comparator.split('-')[1];
        return value >= startValue && value <= endValue;
      } else if (comparator.indexOf('+') !== -1) {    // range is startValue+
        startValue = comparator.split('+')[0];
        return value >= startValue;
      } else {
        return value === parseInt(comparator, 10);
      }
    }

    function rollUpData(rollUpArray, data) {
      var rollUpCount = {},
        output = [];

      if (_.isUndefined(data)) {
        return data;
      }

      _.each(rollUpArray, function (range) {
        rollUpCount[range] = 0;
      });

      _.each(data, function (data) {
        var count = parseInt(data.count, 10),
          value = parseInt(data.value, 10);

        if (!_.isUndefined(value) && !_.isUndefined(count)) {
          _.each(rollUpArray, function (range) {
            if (inRange(value, range)) {
              rollUpCount[range] += count;
            }
          });
        }
      });

      output = _.map(rollUpCount, function (value, key) {
        return {
          'value': key.toString(),
          'count': value
        };
      });

      return output;
    }

    function parseForChartFormat(args) {

      var current = args.from;
      var data = args.data;
      var to = args.to;

      if (!to || !moment.isMoment(to)) {
        throw 'param "to" is missing or it is not a moment object';
      }

      if (!current || !moment.isMoment(current)) {
        throw 'param "from" is missing or it is not a moment object';
      }

      if (!data || !_.isArray(data)) {
        throw 'param "data" is missing or it is not an array';
      }

      var volume = {};
      var defaultVolume = {};
      var defaultTypeVolume = {};

      while (!current.isAfter(to)) {
        defaultTypeVolume[current.startOf('day').toDate().getTime()] = true;
        current.add('days', 1);
      }

      _.each(data, function (item) {
        if (_.isUndefined(item.data)) {
          throw 'invalid format: "data item" should have data field';
        }

        if (_.isUndefined(item.data.count)) {
          throw 'invalid format: "data field" should have count field';
        }

        if (_.isUndefined(item.data.value)) {
          throw 'invalid format: "data field" should have value field';
        }

        if (_.isUndefined(item.event_date)) {
          throw 'invalid format: "data item" should have event_date field';
        }

        var key = item.data.value;
        if (_.isUndefined(volume[key])) {
          volume[key] = [];
          defaultVolume[key] = _.clone(defaultTypeVolume);
        }

        volume[key].push({
          count: item.data.count,
          time: moment(item.event_date).toDate().getTime()
        });

        delete defaultVolume[key][moment(item.event_date).toDate().getTime()];
      });

      _.each(defaultVolume, function (key, volumeType) {
        _.each(key, function (x, missedTime) {
          volume[this].push({
            count: 0,
            time: parseInt(missedTime, 10)
          });
        }, volumeType);
      });

      return volume;
    }

    return {
      rollUpData: rollUpData,
      parseForChartFormat: parseForChartFormat
    };

  });

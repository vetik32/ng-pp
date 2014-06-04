'use strict';

function insertNoDataText(svg, message) {
  svg.append('text')
    .attr('class', 'no-data')
    .attr('x', '50%')
    .attr('y', '50%')
    .attr('dy', '.3em')
    .text(message);
}

function removeNoDataText(svg) {
  svg.selectAll('.no-data').remove();
}

angular.module('sj.d3Directives', [])
  .constant('SJ_COLOR_MAP', {
    "Flight Search":"#e6550d",         // orange
    "Flight Confirmation":"#f8ad43",
    "Boarding Pass": "#ff8846",

    "Car Search": "#6dd9f2",           // light blue
    "Car Confirmation": "#e4f6ff",

    "Hotel Search": "#74c476",         // green
    "Hotel Confirmation": "#a1d99b",

    "Vacation Search": "#00b0ed",      // blue
    "Vacation Confirmation": "#3abeee",

    "Railway Search": "#00a4a0",       // turquoise
    "Railway Confirmation": "#2af1ec",

    "Cruise Search": "#3182bd",        // dark blue
    "Cruise Confirmation": "#6baed6",

    "Home Page": "#807f83"

  })
  .constant('SJ_ADDITIONAL_COLOR_ARRAY', ["#94ccb9", "#9ecae1", "#c7e9c0", "#636363", "#969696", "#bdbdbd", "#d9d9d9"])
  .service('sjColorUtil', ['SJ_COLOR_MAP','SJ_ADDITIONAL_COLOR_ARRAY', function(SJ_COLOR_MAP, SJ_ADDITIONAL_COLOR_ARRAY) {
    var fallbackColors = {}, missingColoursIndex;

    function addAColorToFallbackPalette(key) {
      if (missingColoursIndex >= SJ_ADDITIONAL_COLOR_ARRAY.length) {
        throw {
          type: 'Error',
          message : 'sjColorUtil: exceed unknown keys limit'
        };
      }

      fallbackColors[key] = SJ_ADDITIONAL_COLOR_ARRAY[missingColoursIndex];
      missingColoursIndex += 1;
    }

    return  {
      getColor : function(key) {
        var color = SJ_COLOR_MAP[key] || fallbackColors[key];

        if (!color) {
          throw {
            type: 'Error',
            message : 'sjColorUtil: no color for key: ' + key
          };
        }

        return color;
      },
      buildPalette: function(keys) {
        //redefine fallback palette each time
        fallbackColors = {};
        missingColoursIndex = 0;

        _.each(keys, function(key) {
          if (!SJ_COLOR_MAP[key]) {
            addAColorToFallbackPalette(key);
          }
        });
      }
    };
  }])
  .service('sjD3Utils', function() {
    return {
      getTicksCount: function (aValue) {
        var valueAsString = String(aValue + '');
        var count = Math.round(parseFloat(valueAsString[0] + '.' + valueAsString[1]));
        count = parseInt(count, 10);

        if (count < 3) {
          count = 10;
        } else if (count < 5) {
          count = count * 2;
        }

        return count;
      },
      getNodeWidth: function(node) {
        return d3.select(node).select('text').node().getComputedTextLength();
      }
    };
  })
  .directive('sjChart', ['sjColorUtil','sjD3Utils', function (sjColorUtil, sjD3Utils) {
    return {
      restrict: 'A',
      terminal: true,
      scope: {
        val: '=',
        type: '=',
        graphType: '=',
        rangeDate: '=',
        grouped: '='
      },
      link: function postLink(scope, element, attrs) {
        var WEEK_DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var margin = {top: 20, right: 10, bottom: 120, left: 110},
            width = 900 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var countAccessor = function (d) {
          return d.count;
        };

        var timeAccessor = function (d) {
          return d.time;
        };

        function getConcatinatedData(data) {
          return _.flatten(data);
        }

        function getNewCanvas(svg) {

          var canvas = svg.append('g').classed('canvas', true)
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          return canvas;
        }

        var svg = d3.select(element[0]).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom);

        var canvas = getNewCanvas(svg);

        var minMaxInterval = function(flattenData, fieldAccessorFn) {
          return d3.extent(flattenData, fieldAccessorFn);
        };

        function getCssClassNameForKey(key) {
          return key.replace(' ', '_');
        }

        scope.$watch('val', function (newVal) {

          // if 'val' is undefined, exit
          if (!newVal) {
            return;
          }

          var newValKeys = [];

          _.each(newVal, function(value, key) {
            newValKeys.push(key);
          });

          sjColorUtil.buildPalette(newValKeys);

          // clear the elements inside of the directive
          canvas.selectAll('*').remove();

          if (newValKeys.length === 0) {
            insertNoDataText(svg, attrs.emptytext);
            // clear the elements inside of the directive
            canvas.selectAll('*' ).remove();
            return;
          }

          removeNoDataText(svg);

          var stack = d3.layout.stack(),
              layers = stack(newValKeys.map(function(item) {
                return newVal[item].map(function(d) {
                  return { x: new Date(d.time), y: +d.count };
                });
              })),
              yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y; }); }),
              yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); });

          var yAxisMaxValue = scope.grouped ? yStackMax : yGroupMax;

          var timeDomain = minMaxInterval(getConcatinatedData(newVal), timeAccessor);

          var timeScaleOffset = 50;
          var xScale = d3.time.scale().domain(timeDomain).range([timeScaleOffset, width - timeScaleOffset]);
          var yDomain = [0, yAxisMaxValue];
          var y = d3.scale.linear().domain(yDomain).nice().range([height, 0]);

          var ticks = sjD3Utils.getTicksCount(yAxisMaxValue);

          var barsCount = layers[0].length;
          var tickCount = barsCount > 7 ? 6 : barsCount - 1;
          var xAxis = d3.svg.axis().scale(xScale).ticks(tickCount);  //TODO: set x axis ticks to 7/30/custom
          var yAxis = d3.svg.axis().scale(y).orient('left').ticks(ticks).tickPadding(15).tickSize(-width, 0);

          /* scales applied to data */
          function xData(e) {
            return xScale(timeAccessor(e));
          }

          function yData(e) {
            return y(countAccessor(e));
          }

          function updateYDomain(newDomain){
            y.domain(newDomain).nice();
          }

          function drawGrid() {

            var rules = canvas.append('g').classed('rules', true);
            var yGrid = rules.append('svg:g').classed('grid y_grid', true)
                .call(yAxis.scale(y));

            var xLabels = canvas.append('svg:g').classed('labels x_labels', true)
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis
                    .tickSize(0)
                    .tickPadding(30)
                    .tickFormat(d3.time.format('%x'))
                );

            //add week day above x axe labels
            xLabels.selectAll('.tick')
                .append('text')
                .classed('days', true)
                .attr('text-anchor', 'middle')
                .text(function (d) {
                  return WEEK_DAY[d.getDay()];
                })
                .attr('dy', 20);

            return {
              updateToNewScale: function () {
                var domainMaxValue = y.domain()[1];
                var ticks = sjD3Utils.getTicksCount(domainMaxValue);
                yGrid.transition(500).call(yAxis.scale(y).ticks(ticks));

                yGrid.selectAll('g').classed('major', true);

                var ticksArray = y.ticks(ticks);
                var newValues = [];

                for (var i = 0; i < ticksArray.length - 1; i += 1) {
                  newValues.push((ticksArray[i] + ticksArray[i + 1]) / 2);
                }

                var minorTicks = yGrid.selectAll('g.minor')
                  .data(newValues, function (d) {
                    return d;
                  });

                // update existing
                minorTicks
                  .enter()
                  .append('svg:g')
                  .attr('class', 'minor')
                  .append('line')
                  .attr('y1', y)
                  .attr('y2', y)
                  .attr('x1', 0)
                  .attr('x2', width);

                // remove extra
                minorTicks.exit().remove();

                yGrid.selectAll('.tick line').attr('x1', '-10');
              }
            };
          }

          var lineFunction = d3.svg.line()
              .x(function (e) {
                return xData(e);
              })
              .y(function (e) {
                return yData(e);
              });

          function drawLegend() {
            var ypos = 5,
              newxpos = 5,
              legendItemPadding = 35,
              xpos, series;

            _.each(newVal, function (partOfData, key) {
              var itemLegendGroup = legendWrap.append('g');

              var legendItemColor = sjColorUtil.getColor(key);

              itemLegendGroup.append('rect')
                .attr('width', 10)
                .attr('height', 6)
                .style('fill', legendItemColor);

              itemLegendGroup.append('text')
                .attr('dy', '7')
                .attr('dx', '15')
                .text(key);

            });

            series = legendWrap.selectAll('g');

            series.attr('transform', function (/*d, i*/) {
              var length =  sjD3Utils.getNodeWidth(this) + legendItemPadding;
              xpos = newxpos;

              if (width < margin.left + margin.right + xpos + length) {
                newxpos = xpos = 5;
                ypos += 20;
              }

              newxpos += length;

              return 'translate(' + xpos + ',' + ypos + ')';
            });

          }

          function drawLineGraphs() {
            var dataGroup = canvas
                .append('g').classed('data liniar', true);

            _.each(newVal, function (partOfData, key) {
              var group = dataGroup.append('g');

              var lineColor = sjColorUtil.getColor(key);

              group
                  .append('path')
                  .attr('class', getCssClassNameForKey(key))
                  .attr('d', lineFunction(partOfData))
                  .attr('stroke', lineColor)
                  .attr('stroke-width', 2)
                  .attr('fill', 'none');


            });

            return {
              updateToNewScale: function () {
                _.each(newVal, function (partOfData, key) {
                  var group = dataGroup.select('.' + getCssClassNameForKey(key));
                  group.transition().attr('d', lineFunction(partOfData));
                });

              }
            };
          }

          function drawBars(){
            var n = layers.length;
            var bandWidth =  (width - 3 * timeScaleOffset) / layers[0].length;
            var xRangeBand =  bandWidth > 25 ? layers.length * 12 : bandWidth; // 12px - ungrouped bar width
            var grouppedBarsOffset = xRangeBand/2;

            var dataGroup = canvas
                .append('g').classed('data bar', true);

            var layer = dataGroup.selectAll('.layer')
                .data(layers)
                .enter().append('g')
                .attr('class', 'layer')
                .style('fill', function(d, i) {
                  var key = newValKeys[i];
                  var color = sjColorUtil.getColor(key);

                  return color;
                });

            var rect = layer.selectAll('rect')
                .data(function(d) { return d; })
                .enter().append('rect')
                .attr('x', function (d/*,i, j*/) {
                  return xScale(d.x) - grouppedBarsOffset;
                })
                .attr('y', height)
                .attr('width', xRangeBand / n)
                .attr('height', 0);


            var bars = {
              transitionGrouped: function () {
                updateYDomain([0, yGroupMax]);

                rect.transition()
                    .duration(500)
                    .delay(function (d, i) {
                      return i * 10;
                    })
                    .attr('x', function (d, i, j) {
                      return xScale(d.x) - grouppedBarsOffset + xRangeBand / n * j;
                    })
                    .attr('width', xRangeBand / n)
                    .transition()
                    .attr('y', function (d) {
                      return y(d.y);
                    })
                    .attr('height', function (d) {
                      return height - y(d.y);
                    });
              },

              transitionStacked: function () {
                updateYDomain([0, yStackMax]);

                rect.transition()
                    .duration(500)
                    .delay(function (d, i) {
                      return i * 10;
                    })
                    .attr('y', function (d) {
                      return y(d.y0 + d.y);
                    })
                    .attr('height', function (d) {
                      return y(d.y0) - y(d.y0 + d.y);
                    })
                    .transition()
                    .attr('x', function (d) {
                      return xScale(d.x) - grouppedBarsOffset;
                    })
                    .attr('width', xRangeBand);
              }
            };

            return bars;
          }

          var legendWrap = canvas.append('g')
              .attr('class', 'legendWrap')
              .attr('transform', 'translate(' + 0 + ',' + (height + margin.bottom / 2) + ')');

          var grid = drawGrid();
          var lines = drawLineGraphs();
          var bars = drawBars();

          drawLegend();

          function updateCanvasElements() {
            canvas.select('.labels.y_labels').transition().call(yAxis);
            lines.updateToNewScale();
            grid.updateToNewScale();
          }

          scope.$watch('type', function(type){
            var dataGroups = canvas.selectAll('.data');
            dataGroups.style('display','none');
            dataGroups.filter('.' + type).style('display', '');
          });

          // setup a watch on 'grouped' to switch between views
          scope.$watch('grouped', function (grouped) {

            if (_.isUndefined(grouped)) {
              return;
            }

            if (grouped) {
              bars.transitionStacked();
            } else {
              bars.transitionGrouped();
            }

            updateCanvasElements();
          });
        }, true);
      }
    };
  }])
  .directive('sjPieChart', function () {
    return {
      'restrict': 'A',
      'terminal': true,
      'scope': {
        'limit': '=',
        'val': '='
      },
      link: function postLink(scope, element, attrs) {
        var PIE_MAX_ENTRIES = 6;
        var selector = element[0],
          width = 300,
          height = 300,
          margin = {
            'top': 20,
            'right': 0,
            'bottom': 20,
            'left': 140
          },
          radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 100);

        var valueAccessor = function (d) {
          return d.count;
        };

        var labelAccessor = function (d) {
          return d.value;
        };

        var pie = d3.layout.pie().value(valueAccessor);

        $(selector).empty();

        var svg = d3.select(selector).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

        var arcs = svg.append('g').attr('class', 'canvas')
          .attr('transform', 'translate(' + (width / 2 + margin.left) + ',' + height / 2 + ')');

        var legendElement = svg.append('g').attr('class', 'legend')
          .attr('width', 200)
          .attr('height', 200);

        var dataHasNewRealValue = false;

        scope.$watch('val', function (newVal, oldValue) {
          var noData = true;

          arcs.selectAll('*').remove();
          legendElement.selectAll('*').remove();
          removeNoDataText(svg);

          if (typeof newVal === 'undefined') {
             return;
          }

          noData = newVal.length === 0;

          if (newVal.length !== 0) {
            dataHasNewRealValue = _.find(newVal, function(object){
              return object.count !== 0;
            });
          }

          if (noData || !dataHasNewRealValue) {
            insertNoDataText(svg, attrs.emptytext);
            return;
          }

          if (scope.limit) {
            newVal = newVal.slice(0, scope.limit);
          }

          var sjPieChartColors = ['#00b0ed', '#3abeee', '#6dd9f2', '#e4f6ff', '#00a4a0',
            '#2af1ec', '#94ccb9', '#3182bd', '#6baed6', '#9ecae1'];
          var numberFormatter = d3.format(',');

          var g = arcs.selectAll('.arc')
            .data(pie(newVal))
            .enter().append('g')
            .attr('class', 'arc');

          g.append('path')
            .attr('d', arc)
            .style('fill', function (value, index) {
              return sjPieChartColors[index];
            });

          var legend = svg.selectAll('.legend')
            .attr('class', 'legend')
            .attr('width', 200)
            .attr('height', 200)
            .selectAll('g')
            .data(newVal)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
              return 'translate(0,' + i * 40 + ')';
            });

          legend.append('circle')
            .attr('transform', 'translate(5,10)')
            .attr('r', 5)
            .style('fill', function (value, index) {
              return sjPieChartColors[index];
            });

          legend.append('text')
            .attr('class', 'label')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .text(labelAccessor);

          legend.append('text')
            .attr('class', 'value')
            .attr('x', 24)
            .attr('y', 25)
            .attr('dy', '.35em')
            .text(function (d) {
              return numberFormatter(valueAccessor(d));
            });
        });
      }
    };
  });


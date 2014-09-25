'use strict';

angular.module('dataviz').directive('barchart', function () {
  return {
    restrict: 'E',
    scope: {
      stats: '=stats'
    },
    template: '<div class="chart-holder"></div>',
    link: function (scope, element, attrs) {
      var chartHolder = $(element.find('div')[0]),
        tooltip =d3.select("#tooltip");

      var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = chartHolder.width() - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
        .range([height, 0]);

      var color = d3.scale.ordinal()
        .range(["#5bc0de", "#c9302c"]);

      var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

      var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

      var svg = d3.select(element.find('div')[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("g")
        .attr("class", "x axis");

      svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Quantity");

      svg.selectAll('.x.axis')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.selectAll('.y.axis')
        .transition(750)
        .call(yAxis);

      scope.stats.$watch(updateChart);

      function updateChart() {
        var data = getDataModified(scope.stats);

        svg.selectAll(".g rect").remove();

        if (scope.stats.length === 0) {
          svg.selectAll(".g rect")
            .transition()
            .duration(500)
            .attr("y", function (d) {
              return  height;
            })
            .attr("height", function (d) {
              return 0;
            });
        }

        var ageNames = d3.keys(data[0]).filter(function (key) {
          return key !== "Job" && key !== 'ages';
        });

        data.forEach(function (d) {
          d.ages = ageNames.map(function (name) {
            return {name: name, value: +d[name]};
          });
        });

        x0.domain(data.map(function (d) {
          return d.Job;
        }));

        x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()])

        var max = d3.max(data, function (d) {
          return d3.max(d.ages, function (d) {
            return d.value;
          });
        });

        y.domain([0, (5 + max)]);

        svg.selectAll('.x.axis')
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        svg.selectAll('.y.axis')
          .transition(750)
          .call(yAxis);

        var state = svg.selectAll(".state")
          .data(data)
          .enter().append("g")
          .attr("class", "g")
          .attr("transform", function (d) {
            return "translate(" + x0(d.Job) + ",0)";
          });

        state.selectAll("rect")
          .data(function (d) {
            return d.ages;
          })
          .enter().append("rect")
          .attr("width", x1.rangeBand())
          .attr("x", function (d) {
            return x1(d.name);
          })
          .attr("y", function (d) {
            return  height;
          })
          .attr("height", function (d) {
            return 0;
          })
          .style("fill", function (d) {
            return color(d.name);
          })
          .transition()
          .duration(500)
          .attr("y", function (d) {
            return  y(d.value);
          })
          .attr("height", function (d) {
            return height - y(d.value);
          });


        var legend = svg.selectAll(".legend")
          .data(ageNames.slice().reverse())
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
          });

        legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

        legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function (d) {
            return d;
          });

        d3.selectAll(".g rect").on("mouseover", function(d) {
          tooltip
            .style("left", d3.event.pageX + 'px')
            .style("top", d3.event.pageY - 50 + 'px')
            .text(d.name + ' : ' + d.value);
          tooltip.classed("hidden", false);
          d3.select(this).attr("fill", "#000");
        })
          .on("mouseout", function(d) {
            tooltip.classed("hidden", true);
            d3.select(this).attr("fill", function(d) {return color(d)});
          });
      };

      function getDataModified(data) {
        var res = data.reduce(function (hashMap, item) {
          if (!hashMap[item.Job]) {
            hashMap[item.Job] = {
              Male: 0,
              Female: 0
            };
          }
          hashMap[item.Job][item.Gender]++;
          return hashMap;
        }, {});

        res = angular.extend({
          'Frontend': {
            'Male': 0,
            'Female': 0
          },
          'Backend': {
            'Male': 0,
            'Female': 0
          },
          'Qa': {
            'Male': 0,
            'Female': 0
          },
          'Other': {
            'Male': 0,
            'Female': 0
          }
        }, res);

        return Object.keys(res).map(function (key) {
          return {
            Job: key,
            Male: res[key].Male,
            Female: res[key].Female
          }
        });
      };
    }
  }
});
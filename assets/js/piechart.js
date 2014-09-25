'use strict';

angular.module('dataviz').directive('piechart', function () {
  return {
    restrict: 'E',
    scope: {
      stats: '=stats'
    },
    template: '<div class="chart-holder"></div>',
    link: function (scope, element, attrs) {
      var chartHolder = $(element.find('div')[0]);

      var width = chartHolder.width(),
        height = 400;

      var margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = chartHolder.width() - margin.left - margin.right;

      var radius = Math.min(width, height - margin.top - margin.bottom) / 2;

      var color = d3.scale.ordinal()
        .range(["#DE7949", "#9ABD4F", "#D1933B", "#9065A8"]);

      var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius);

      var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
          return d.value;
        });

      scope.stats.$watch(updateChart);

      function updateChart() {
        if(scope.stats.length === 0) {
          chartHolder.html('');
        }
        else{
          var data = getDataModifiedPie(scope.stats);

          chartHolder.html('');

          var svg = d3.select(element.find('div')[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("class", "hold")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


          var g = svg.selectAll(".hold")
            .data(data)
            .append("g");

          g.selectAll('path').remove();
          g.selectAll('text').remove();

          var arcs = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

          arcs.append("path")
            .style("fill", function (d, i) {
              return color(i);
            })
            .transition().duration(500)
            .attrTween('d', function(d) {
              var i = d3.interpolate(d.startAngle, d.endAngle);
              return function(t) {
                d.endAngle = i(t);
                return arc(d);
              }
            });

          arcs.append("text")
            .attr("transform", function (d) {
              return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .style("text-anchor", "middle")
            .text(function (d) {
              return d.data.label;
            });
        }
      };

      function getDataModifiedPie(data) {
        var res = data.reduce(function (hashMap, item) {
         hashMap[item.Job]++;
         return hashMap;
         }, {
          Frontend: 0,
          Backend: 0,
          Qa: 0,
          Other: 0
         });

        var frontend = res.Frontend > 0 ? Object.keys(res)[0] : '',
              backend =  res.Backend > 0 ? Object.keys(res)[1] : '',
              qa =  res.Qa > 0 ? Object.keys(res)[2] : '',
              other =  res.Other > 0 ? Object.keys(res)[3] : '';

        var obj = [
          {"label": frontend, "value": res.Frontend},
          {"label": backend, "value": res.Backend},
          {"label": qa, "value": res.Qa},
          {"label": other, "value": res.Other}
        ]

        return obj;
      }
    }
  }
});
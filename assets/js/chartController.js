'use strict';

angular.module('dataviz').controller('chartController', function ($scope, $firebase, Statistics) {

  $scope.data = Statistics;

  $scope.removeData = function () {
    Statistics.forEach(function(item) {
      Statistics.$remove(item);
    });
  }
});
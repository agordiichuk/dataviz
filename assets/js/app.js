'use strict';

var app = angular.module('dataviz', ['firebase', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('form', {
      url: "/form",
      templateUrl: "tpl/form.html",
      controller: 'formController'
    })
    .state('chart', {
      url: "/chart",
      templateUrl: "tpl/chart.html",
      controller: 'chartController'
    });
});
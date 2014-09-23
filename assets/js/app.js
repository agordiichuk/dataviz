'use strict';

var app = angular.module('dataviz', ['firebase', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('form', {
      url: "/",
      templateUrl: "tpl/form.html",
      controller: 'formController'
    })
    .state('chart', {
      url: "/chart",
      templateUrl: "tpl/chart.html",
      controller: 'chartController'
    });
});
'use strict';


var app = angular.module('dataviz', ['firebase', 'ui.router'])

  .value('fbURL', 'https://vivid-inferno-817.firebaseio.com/')

  .factory('Statistics', function ($firebase, fbURL) {
    return $firebase(new Firebase(fbURL)).$asArray();
  })

  .config(function ($stateProvider, $urlRouterProvider) {

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
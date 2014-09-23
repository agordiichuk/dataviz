'use strict';

angular.module('dataviz').controller('formController', function ($scope, $firebase, $timeout, Statistics) {

  $scope.data = Statistics;

  $scope.currentGender = 'Male';
  $scope.currentJob = 'Frontend';
  $scope.isSending = false;


  $scope.genderList = [
    {
      className: 'btn-info',
      iconClass: 'fa fa-male',
      value: 'Male',
      text: 'Male'
    },
    {
      className: 'btn-danger',
      iconClass: 'fa fa-female',
      value: 'Female',
      text: 'Female'
    }
  ];

  $scope.jobList = [
    {
      className: 'btn-primary',
      iconClass: 'fa fa-gamepad',
      value: 'Frontend',
      text: ' Front End Developer'
    },
    {
      className: 'btn-green',
      iconClass: 'fa fa-caret-square-o-right',
      value: 'Backend',
      text: 'Back End Developer'
    },
    {
      className: 'btn-warning',
      iconClass: 'fa fa-wrench',
      value: 'Qa',
      text: 'QA Developer'
    },
    {
      className: 'btn-inc',
      iconClass: 'fa fa-users',
      value: 'Other',
      text: 'Other (IT) job'
    }
  ];

  $scope.setGender = function (genderValue) {
    $scope.currentGender = genderValue;
  };

  $scope.setJob = function (jobValue) {
    $scope.currentJob = jobValue;
  };

  $scope.submit = function() {
    $scope.data.$add({
      Gender:  $scope.currentGender,
      Job: $scope.currentJob
    });
    toggleBodySate();
  };

  /**
   * Change state and show message if data sent
   */
  function toggleBodySate() {
    $scope.isSending = true;
    $timeout(function() {
      $scope.isSending = false;
    }, 1000);
  }

});
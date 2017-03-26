'use strict';

/**
 * @ngdoc function
 * @name hotMessApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hotMessApp
 */
angular.module('hotMessApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

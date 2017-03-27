'use strict';

angular.module('hotMessApp')
  .controller('payCtrl', ["$scope", "$location", "currentAuth", function ($scope, $location, currentAuth) {
    $scope.user = currentAuth;

    $scope.paySomeone = function (person, amount) {

    }
  }]);

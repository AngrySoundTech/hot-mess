'use strict';

angular.module('hotMessApp').controller('StatsCtrl', ["$scope", "auth", "currentAuth", "$location", "$timeout", function ($scope, auth, currentAuth, $location, $timeout) {
  $scope.user = currentAuth;

}]);

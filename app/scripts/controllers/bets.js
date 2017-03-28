angular.module('hotMessApp')
  .controller('BetsCtrl', ["$scope","$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

  }]);

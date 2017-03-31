'use strict';

angular.module('hotMessApp').controller('StatsCtrl', ["$scope", "auth", "currentAuth", "$location", "$timeout", function ($scope, auth, currentAuth, $location, $timeout) {
  $scope.user = currentAuth;

  $scope.totalMoney = 0;
  $scope.users = [];
  firebase.database().ref('/users/').on('value', users => {
    //users = users.val();
    let total = 0;
    $scope.users = [];
    users.forEach(user => {
      total += user.val().money;
      $scope.users.push(user.val());
    });
    $timeout(() => {
      $scope.totalMoney = total;
      $scope.users.sort((a,b) => {
        return b.money - a.money;
      });
    });
  });
}]);

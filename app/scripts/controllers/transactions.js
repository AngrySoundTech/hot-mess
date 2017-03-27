'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope","$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

    let transactionsRef = firebase.database().ref('transactions/');
    transactionsRef.on('value', function (transactions) {
      $timeout(function () {
        $scope.transactions = transactions.val();
      });
    });

    let moneyRef = firebase.database().ref('users/' + currentAuth.uid + '/money');
    moneyRef.on('value', function(money) {
        $timeout(function() {
          $rootScope.money = money.val();
        });
    });
  }]);

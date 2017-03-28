'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope","$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

    let transactionsRef = firebase.database().ref('transactions/').limitToFirst(20);
    transactionsRef.on('value', function (transactions) {
      $timeout(function () {
        let data = transactions.val();
        $scope.transactions = Object.keys(data).map((key) => {
          let obj = data[key];
          obj._key = key;
          return obj;
        });
      });
    });

    let moneyRef = firebase.database().ref('users/' + currentAuth.uid + '/money');
    moneyRef.on('value', function(money) {
        $timeout(function() {
          $rootScope.money = money.val();
        });
    });
  }]);

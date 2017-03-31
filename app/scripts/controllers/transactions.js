'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope", "$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

    let transactionsRef = firebase.database().ref('transactions/').limitToLast(20);
    transactionsRef.on('value', function (transactions) {
      $timeout(function () {
        $scope.transactions = objectToList(transactions.val());
      });
    });

    let loaded = false;
    let moneyRef = firebase.database().ref('users/' + currentAuth.uid + '/money');
    moneyRef.on('value', function(money) {
        $timeout(function() {
          $rootScope.money = money.val();
          if (loaded) {
            $rootScope.moneyChanged = true;
            setTimeout(() => {
              $timeout(() => {
                $rootScope.moneyChanged = false;
              });
            }, 1000);
          }
          loaded = true;
        });
    });

    let adminRef = firebase.database().ref('users/' + currentAuth.uid + '/admin');
    adminRef.on('value', admin => {
      $timeout(() => {
        $rootScope.admin = admin.val();
      });
    });
  }]);

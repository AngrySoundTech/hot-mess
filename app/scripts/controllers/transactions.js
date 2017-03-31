'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope", "$rootScope", "$timeout", "$location", "currentAuth", "mine", function ($scope, $rootScope, $timeout, $location, currentAuth, mine) {
    $scope.user = currentAuth;


    let transactionsRef = firebase.database().ref('transactions/');
    transactionsRef.on('value', function (transactions) {
      $timeout(function () {
        $scope.transactions = objectToList(transactions.val());

        if (mine) {
          $scope.transactions = $scope.transactions.filter(transaction => {
            return transaction.fromUser === $scope.user.uid || transaction.toUser === $scope.user.uid;
          });
        }
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

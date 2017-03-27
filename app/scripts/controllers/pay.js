'use strict';

angular.module('hotMessApp')
  .controller('PayCtrl', ["$scope", "$rootScope", "$location", "currentAuth", function ($scope, $rootScope, $location, currentAuth) {
    $scope.user = currentAuth;


    let usersRef = firebase.database().ref('users/');
    let currUserRef = firebase.database().ref('users/' + $scope.user.uid);

    usersRef.once('value').then(function (snapshot) {
      $scope.$apply(function(){
        $scope.users = snapshot.val();
      });
    });

    $scope.paySomeone = function () {
      if ($scope.uid && $scope.amount) {

        // TODO: Check user isn't themselves
        if ($scope.amount > $rootScope.money) {
          console.log("You don't have enough") //TODO Tell the user they're dumb
        } else {
          // TODO: This should be a function on the server so people can't abuse it.
          // Subtract money from current user
          currUserRef.update({
            money: $rootScope.money - $scope.amount
          });
          // Add money to new user
          let targetUserRef = firebase.database().ref('users/' + $scope.uid);
          targetUserRef.once('value').then(function (snapshot) {
            let targetUserName = snapshot.val().displayName;
            let targetUserAmount = snapshot.val().money;
            targetUserRef.update({
              money: targetUserAmount + $scope.amount
            });

            // Add transaction to database
            // TODO: Add description
            let transactionsRef = firebase.database().ref('transactions/');
            transactionsRef.push({
              fromUser: $scope.user.uid,
              fromUserName: $scope.user.displayName,
              toUser: $scope.uid, amount: $scope.amount,
              toUserName: targetUserName,
              time: firebase.database.ServerValue.TIMESTAMP
            });
          });
        }
      }
    }

  }]);

'use strict';

angular.module('hotMessApp')
  .controller('PayCtrl', ["$scope", "$rootScope", "$location", "currentAuth", function ($scope, $rootScope, $location, currentAuth) {
    $scope.user = currentAuth;


    let usersRef = firebase.database().ref('users/');
    let currUserRef = firebase.database().ref('users/' + $scope.user.uid);

    usersRef.once('value').then(function (snapshot) {
      $scope.$apply(function(){
        $scope.users = objectToList(snapshot.val());
      });
    });

    $scope.paySomeone = function () {
      if ($scope.selectedPerson && $scope.amount >= 1 && $scope.user.uid !== $scope.selectedPerson.uid) {

        // TODO: Check user isn't themselves
        if ($scope.amount > $rootScope.money ) {
          console.log("You don't have enough") //TODO Tell the user they're dumb
        } else {
          // TODO: This should be a function on the server so people can't abuse it.
          // Subtract money from current user
          currUserRef.update({
            money: $rootScope.money - Math.floor($scope.amount)
          });
          // Add money to new user
          let targetUserRef = firebase.database().ref('users/' + $scope.selectedPerson.uid);
          targetUserRef.once('value').then(function (snapshot) {
            let targetUserName = snapshot.val().displayName;
            let targetUserAmount = snapshot.val().money;
            targetUserRef.update({
              money: targetUserAmount + Math.floor($scope.amount)
            });

            // Add transaction to database
            // TODO: Add description
            let transactionsRef = firebase.database().ref('transactions/');
            transactionsRef.push({
              fromUser: $scope.user.uid,
              fromUserName: $scope.user.displayName,
              toUser: $scope.selectedPerson.uid,
              amount: Math.floor($scope.amount),
              toUserName: targetUserName,
              time: firebase.database.ServerValue.TIMESTAMP,
              description: $scope.description? $scope.description : ""
            });
          });
          $location.path('/')
        }
      }
    };

    $scope.searchUsers = (searchText) => {
      return $scope.users.filter((value) => {
        if (value.uid === $scope.user.uid) {
          return false
        } else {
          return value.displayName.toLowerCase().startsWith(searchText.toLowerCase());
        }
      });
    }

  }]);

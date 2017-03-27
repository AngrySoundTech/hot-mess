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

        if ($scope.amount > $rootScope.money) {
          console.log("You don't have enough") //TODO Tell the user they're dumb
        } else {
          // Subtract money from current user
          currUserRef.update({
            money: $rootScope.money - $scope.amount
          });
          // Add money to new user
          let targetUserRef = firebase.database().ref('users/' + $scope.uid);
          targetUserRef.once('value').then(function (snapshot) {
            let targetUserAmount = snapshot.val().money;
            targetUserRef.update({
              money: targetUserAmount + $scope.amount
            })
          });
        }
      }
    }

  }]);

'use strict';

angular.module('hotMessApp')
  .controller('PayCtrl', ["$scope", "$location", "currentAuth", function ($scope, $location, currentAuth) {
    $scope.user = currentAuth;


    let usersRef = firebase.database().ref('users/');
    usersRef.once('value').then(function (snapshot) {
      $scope.$apply(function(){
        $scope.users = snapshot.val();
      });
    });

    $scope.paySomeone = function () {
      if ($scope.uid && $scope.amount) {
        console.log("Paid " + $scope.uid + " " + $scope.amount); // TODO: Actually Pay
      }
    }

  }]);

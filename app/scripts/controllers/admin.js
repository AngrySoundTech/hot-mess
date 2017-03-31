'use strict';

// Ripped straight from the pay controller. God have mercy on my soul
angular.module('hotMessApp').controller('AdminCtrl', ["$scope", "$rootScope", "auth", "currentAuth", "$location", "$timeout", function ($scope, $rootScope, auth, currentAuth, $location, $timeout) {
  $scope.user = currentAuth;

  // Redirect user if they're not admin
  if (!$rootScope.admin) {
    $timeout(() => {
      $location.path('/');
    });
  }

  let usersRef = firebase.database().ref('users/');
  usersRef.once('value').then(function (snapshot) {
    $scope.$apply(function(){
      $scope.users = objectToList(snapshot.val());
    });
  });

  $scope.paySomeone = function () {
    if ($scope.selectedPerson && $scope.amount >= 1) {

      // TODO: This should be a function on the server so people can't abuse it.
      // Add money to new user
      let targetUserRef = firebase.database().ref('users/' + $scope.selectedPerson.uid);
      targetUserRef.once('value').then(function (snapshot) {
        let targetUserName = snapshot.val().displayName;
        let targetUserAmount = snapshot.val().money;
        targetUserRef.update({
          money: targetUserAmount + Math.floor($scope.amount)
        });
      });
      $location.path('/')
    }
  };

  $scope.searchUsers = (searchText) => {
    return $scope.users.filter((value) => {
      return value.displayName.toLowerCase().startsWith(searchText.toLowerCase());
    });
  }

  }]);

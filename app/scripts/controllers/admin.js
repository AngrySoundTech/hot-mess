'use strict';

angular.module('hotMessApp').controller('AdminCtrl', ["$scope", "auth", "currentAuth", "$location", "$timeout", function ($scope, auth, currentAuth, $location, $timeout) {
  $scope.user = currentAuth;

  // Redirect user if they're not admin
  // I'm rushing so this is ugly as hell
  const currentUserRef = firebase.database().ref('users/' + $scope.user.uid);
  currentUserRef.once('value').then((user) => {
    user = user.val();
    if (!user.admin) {
      $timeout(() => {
        $location.path('/');
      });
    }
  });
  }]);

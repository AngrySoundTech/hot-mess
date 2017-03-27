'use strict';

angular.module('hotMessApp')
  .controller('MainCtrl', ["auth", "$scope", "$location", function (auth, $scope, $location) {

    $scope.logout = function () {
      auth.$signOut();
      console.log('logged out');
      $location.path('/login');
      $scope.authData = null;
    };

  }]);

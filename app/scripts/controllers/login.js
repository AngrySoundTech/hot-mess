'use strict';
/**
 * @ngdoc function
 * @name hotMessApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('hotMessApp')
  .controller('LoginCtrl', ["$scope", "auth", "$location", function ($scope, auth, $location) {

    $scope.loginBtn = true;
    $scope.logoutBtn = true;

    auth.$onAuthStateChanged(function (authData) {
      if (authData) {
        console.log(" logged: " + authData.uid);
        $scope.logoutBtn = true;
        $scope.loginBtn = false;
        $location.path('/account');
      }
    });



      // SignIn with a Provider
      $scope.oauthLogin = function (provider) {
        auth.$signInWithRedirect(provider)
          .then(function (authData) {
            console.log("logged");
            redirect();
          })
          .catch(function (error) {
            console.log("login error");
            showError(error);
          })
      };

      // Anonymous login method
      $scope.anonymousLogin = function () {
        auth.$signInAnonymously()
          .then(function (authData) {
            console.log("logged ", authData.uid);
          })
          .catch(function (error) {
            console.log("login error ", error);
          })
      };





    function redirect() {
      $location.path('/account');
    }

    function showError(err) {
      $scope.err = err;
    }


  }]);

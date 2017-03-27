'use strict';
/**
 * @ngdoc function
 * @name hotMessApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Manages authentication to any active providers.
 */
angular.module('hotMessApp')
  .controller('LoginCtrl', ["$scope", "auth", "$location", "$firebaseArray", function ($scope, auth, $location, $firebaseArray) {

    $scope.loginBtn = true;
    $scope.logoutBtn = true;

    auth.$onAuthStateChanged(function (authData) {
      if (authData) {
        console.log(" logged: " + authData.uid);
        $scope.logoutBtn = true;
        $scope.loginBtn = false;
        redirect()
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
      $location.path('/');
    }

    function showError(err) {
      $scope.err = err;
    }


  }]);

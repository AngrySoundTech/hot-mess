'use strict';
/**
 * @ngdoc function
 * @name muck2App.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Provides rudimentary account management functions.
 */
angular.module('hotMessApp')
  .controller('AccountCtrl', ["$scope", "auth", "currentAuth", function (
    $scope,
    auth,
    currentAuth

  ) {

  $scope.user = {
    uid: currentAuth.uid,
    name: currentAuth.displayName,
    photo: currentAuth.photoURL,
    email: currentAuth.email
  };

  $scope.updateProfile = function(name, imgUrl) {
    firebase.auth().currentUser.updateProfile({
      displayName: name,
      photoURL: imgUrl
    })
      .then(function () {
        console.log("updated");
      })
      .catch(function (error) {
        console.log("error ", error);
      })
  };

  }]);

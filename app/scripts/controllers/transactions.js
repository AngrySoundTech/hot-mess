'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope","$rootScope", "$location", "currentAuth", function ($scope, $rootScope, $location, currentAuth) {
    $scope.user = currentAuth;

    var moneyRef = firebase.database().ref('users/' + currentAuth.uid + '/money');
    moneyRef.on('value', function(money) {
      $scope.$apply(function(){
        $rootScope.money = money.val();
      });

    });

    $rootScope.formatMoney = function () {
      if ($rootScope.money) {
        return "$" + $rootScope.money.toLocaleString('en-US');
      } else {
        return "$0"
      }
    }
  }]);

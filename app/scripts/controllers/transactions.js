'use strict';

angular.module('hotMessApp')
  .controller('TransCtrl', ["$scope","$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

    var moneyRef = firebase.database().ref('users/' + currentAuth.uid + '/money');
    moneyRef.on('value', function(money) {
        $timeout(function() {
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

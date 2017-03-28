angular.module('hotMessApp')
  .controller('BetsCtrl', ["$scope","$rootScope", "$timeout", "$location", "currentAuth", function ($scope, $rootScope, $timeout, $location, currentAuth) {
    $scope.user = currentAuth;

    let activeBetsRef = firebase.database().ref("bets/active");
    let inactiveBetsRef = firebase.database().ref("bets/inactive");

    activeBetsRef.on('value', (activeBets) => {
      $timeout(() => {
        let data = activeBets.val();
        $scope.activeBets = Object.keys(data).map((key) => {
          let obj = data[key];
          obj._key = key;
          return obj;
        });
      });
    });

    $scope.createBet = (description) => {
      activeBetsRef.push({
        description: description,
        creator: $scope.user.uid,
        creatorDisplayName: $scope.user.displayName,
      });
      $location.path('/bets');
    };
  }]);

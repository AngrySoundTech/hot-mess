angular.module('hotMessApp')
  .controller('BetsCtrl', ["$scope", "$timeout", "$location", "currentAuth", "$routeParams", function ($scope, $timeout, $location, currentAuth, $routeParams) {
    $scope.user = currentAuth;

    let activeBetsRef = firebase.database().ref("bets/active");
    let inactiveBetsRef = firebase.database().ref("bets/inactive");

    setCurrentBet($routeParams.id);

    activeBetsRef.on('value', (activeBets) => {
      $timeout(() => {
        $scope.activeBets = objectToList(activeBets.val());
      });
    });

    /**
     * Creates a bet with the given description / current user as the creator,
     * and redirects to /bets
     * @param description The description of the bet
     */
    $scope.createBet = (description) => {
      activeBetsRef.push({
        description: description,
        creator: $scope.user.uid,
        creatorDisplayName: $scope.user.displayName,
      });
      $location.path('/bets');
    };

    function setCurrentBet(id) {
      if (!id) return;

      // We assume the same id can't exist in both active and inactive.
      activeBetsRef.child(id).once('value', (bet) => {
        if (bet.val()) {
          $timeout(() =>{
            $scope.currentBet = bet.val()
          })
        }
      });
      inactiveBetsRef.child(id).once('value', (bet) => {
        if (bet.val()) {
          $timeout(() =>{
            $scope.currentBet = bet.val()
          })
        }
      })
    }

  }]);

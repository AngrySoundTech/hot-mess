'use strict';
angular.module('hotMessApp')
  .controller('BetsCtrl', ['$scope', '$timeout', '$location', 'currentAuth', '$routeParams', function ($scope, $timeout, $location, currentAuth, $routeParams) {
    $scope.user = currentAuth;

    let activeBetsRef = firebase.database().ref('bets/active');
    let inactiveBetsRef = firebase.database().ref('bets/inactive');

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
     * @param option1 The first option
     * @param option2 The second option
     */
    $scope.createBet = (description, option1, option2) => {
      activeBetsRef.push({
        description: description,
        option1: option1,
        option2: option2,
        creator: $scope.user.uid,
        creatorDisplayName: $scope.user.displayName,
      });
      $location.path('/bets');
    };

    /**
     * Selects the winner of a bet
     * @param winner the winning option of the bet
     */
    $scope.selectWinner = (winner) => {
      let activeBetRef = firebase.database().ref('bets/active/'+$routeParams.id);

      if (winner === 'option1' || winner === 'option2') {
        activeBetRef.update({
          winner: winner
        });
      }

      moveRecord(activeBetRef, inactiveBetsRef)
    };

    function setCurrentBet(id) {
      if (!id) {
        return;
      }

      // We assume the same id can't exist in both active and inactive.
      activeBetsRef.child(id).on('value', (bet) => {
        if (bet.val()) {
          $timeout(() =>{
            $scope.currentBet = bet.val();
          });
        }
      });
      inactiveBetsRef.child(id).on('value', (bet) => {
        if (bet.val()) {
          $timeout(() => {
            $scope.currentBet = bet.val();
          });
        }
      });
    }

  }]);

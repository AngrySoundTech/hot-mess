'use strict';
angular.module('hotMessApp')
  .controller('BetsCtrl', ['$scope', '$rootScope', '$timeout', '$location', 'currentAuth', '$routeParams', function ($scope, $rootScope, $timeout, $location, currentAuth, $routeParams) {
    $scope.user = currentAuth;

    let activeBetsRef = firebase.database().ref('bets/active');
    let inactiveBetsRef = firebase.database().ref('bets/inactive');

    let currUserRef = firebase.database().ref('users/' + $scope.user.uid);

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

    $scope.betOn = (betAmount, option) => {
      if (betAmount >= 1 && (option === 'option1' || option === 'option2')) {
        firebase.database().ref('bets/active/' + $routeParams.id).once('value').then((bet) => {
          if (!(bet.child('betsOn-option1/'+$scope.user.uid).exists() || bet.child('betsOn-option2/+'+$scope.user.uid).exists())) {
            // Assume we're betting on an active bet because that makes sense
            firebase.database().ref('bets/active/' + $routeParams.id + "/betsOn-" + option + "/" + $scope.user.uid ).set({
              amount: betAmount,
              displayName: $scope.user.displayName,
              uid: $scope.user.uid
            });
            firebase.database().ref('bets/active/' + $routeParams.id + "/pool").transaction((pool) => {
              return pool + betAmount;
            });
            firebase.database().ref('users/' + $scope.user.uid).update({
              money: $rootScope.money - Math.floor(betAmount)
            });
          }
        });
      }
    };

    /**
     * Selects the winner of a bet
     * @param winner the winning option of the bet
     */
    $scope.selectWinner = (winner) => {
      // Assume the bet is active if we're betting on it
      let activeBetRef = firebase.database().ref('bets/active/'+$routeParams.id);

      if (winner === 'option1' || winner === 'option2') {
        activeBetRef.update({
          winner: winner
        });
      }

      let optpot = 0;
      firebase.database().ref('bets/active/' + $routeParams.id + '/betsOn-' + winner).once('value', (bets) => {
        bets.forEach((bet) => {
          bet = bet.val();
          optpot += bet.amount;
        });

        let paidOut = 0;
        bets.forEach((bet) => {
          bet = bet.val();
          let percentOfPool = (100 * bet.amount) / optpot;
          let winnings = (percentOfPool / 100) * $scope.currentBet.pool;
          paidOut += winnings;
          let targetUserRef = firebase.database().ref('users/' + bet.uid);
          targetUserRef.once('value').then(function (snapshot) {
            let targetUserAmount = snapshot.val().money;
            targetUserRef.update({
              money: targetUserAmount + Math.floor(winnings)
            });
          });
        });
      });

      moveRecord(activeBetRef, inactiveBetsRef);
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
            $scope.hasPlacedBet = bet.child('betsOn-option1/' + $scope.user.uid).exists() || bet.child('betsOn-option2/'+$scope.user.uid).exists();
          });
        }
      });
      inactiveBetsRef.child(id).on('value', (bet) => {
        if (bet.val()) {
          $timeout(() => {
            $scope.currentBet = bet.val();
            $scope.hasPlacedBet = bet.child('betsOn-option1/' + $scope.user.uid).exists() || bet.child('betsOn-option2/'+$scope.user.uid).exists();
          });
        }
      });
    }

  }]);

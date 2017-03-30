const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.transferMoney = functions.database.ref('/transactions/{transactionID}').onWrite(event => {

  const transaction = event.data.val();

  const fromUserRef = admin.database().ref('/users/' + transaction.fromUser);
  const toUserRef   = admin.database().ref('/users/' + transaction.toUser);

  // Subtract money from the sender
  fromUserRef.child('money').transaction(money => {
      return money - transaction.amount
  });

  // Add money to the receiver
  toUserRef.child('money').transaction(money => {
    return money + transaction.amount;
  });

  console.log("Transferred ", transaction.amount, " from ",
    transaction.fromUser, " (", transaction.fromUserName, ") to ",
    transaction.toUser,   " (", transaction.toUserName,   ")");

});

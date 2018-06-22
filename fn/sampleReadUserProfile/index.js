console.log('Loading function');

// dependencies
var AWS = require('aws-sdk');
var crypto = require('crypto');
var cryptoUtils = require('./lib/cryptoUtils');
var config = require('./config');

// Get reference to AWS clients
var dynamodb = new AWS.DynamoDB();
var ses = new AWS.SES();

function getUser(email, fn) {
  dynamodb.getItem({
    TableName: config.DDB_TABLE,
    Key: {
      email: {
        S: email
      }
    }
  }, function(err, data) {
    if (err) return fn(err);
    else {
      if ('Item' in data) {
        var verified = data.Item.verified.BOOL;
        var name = data.Item.name.S;
        fn(null, name, verified);
      } else {
        fn(null, null); // User not found
      }
    }
  });
}

exports.handler = function(event, context) {

  var email = event.email;

  getUser(email, function(err, name, verified) {
    if (err) {
      context.fail('Error in getUser: ' + err);
    } else {
    	context.succeed({name: name, verified: verified});
    }
  });
}

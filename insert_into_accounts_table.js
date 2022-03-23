/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/

var mysql = require("mysql");
var crypto = require('crypto');

//CLEARDB_DATABASE_URL: mysql://b3116ee54ec363:4ac9d462@us-cdbr-east-06.cleardb.net/heroku_3276367e1f6997f?reconnect=true
var con = mysql.createConnection({
  host: "us-cdbr-east-06.cleardb.net",
  user: "b3116ee54ec363", // replace with the database user provided to you
  password: "4ac9d462", // replace with the database password provided to you
  database: "heroku_3276367e1f6997f", // replace with the database user provided to you
  port: 3306
});

con.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected!");

  var rowToBeInserted = {
    acc_name: 'charlie', // replace with acc_name chosen by you OR retain the same value
    acc_login: 'charlie', // replace with acc_login chosen by you OR retain the same vallue
    acc_password: crypto.createHash('sha256').update("tango").digest('base64') // replace with acc_password chosen by you OR retain the same value
  };

  var sql = ``;
  con.query('INSERT tbl_accounts SET ?', rowToBeInserted, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Value inserted");
  });
});

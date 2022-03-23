/*
TO DO:
-----
READ ALL COMMENTS AND REPLACE VALUES ACCORDINGLY
*/
var mysql = require("mysql");
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
  var sql = `CREATE TABLE tbl_accounts(acc_id INT NOT NULL AUTO_INCREMENT,
                                       acc_name VARCHAR(20),
                                       acc_login VARCHAR(20),
                                       acc_password VARCHAR(50), PRIMARY KEY (acc_id))`;
  con.query(sql, function(err, result) {
    if(err) {
      throw err;
    }
    console.log("Table created");
  });
});

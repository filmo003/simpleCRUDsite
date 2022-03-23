//mysql -u C4131S20U33 -hcse-larry.cse.umn.edu -P3306 -p C4131S20U33

var mysql = require("mysql");
var crypto = require('crypto');

var con = mysql.createConnection({ //lol good ol plaintext credentials, definitely should not be used in production
host: "cse-larry.cse.umn.edu",
user: "C4131S20U33", // replace with the database user provided to you
password: "1119", // replace with the database password provided to you
database: "C4131S20U33", // replace with the database user provided to you
port: 3306
});
function checkUser(name, password){
    con.connect(function(err) {
        if (err) {
          throw err;
        };
        console.log("Connected!");
        var hashPass=crypto.createHash('sha256').update(password).digest('base64')
        var query=("SELECT * FROM tbl_accounts t WHERE t.acc_name="+name+" AND t.acc_password="+hashPass)
        var sql = ``;
        con.query(query, function(err, result) {
          if(err) {
            throw err;
            console.log("Error in login.js")
          }
          console.log("Select successful");
        });
      });


}
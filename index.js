// YOU CAN USE THIS FILE AS REFERENCE FOR SERVER DEVELOPMENT

// include the express module
var express = require("express");

// create an express application
var app = express();

// helps in extracting the body portion of an incoming request stream
var bodyparser = require('body-parser');

// fs module - provides an API for interacting with the file system
var fs = require("fs");

// helps in managing user sessions
var session = require('express-session');

// native js function for hashing messages with the SHA-256 algorithm
var crypto = require('crypto');

// include the mysql module
var mysql = require("mysql");

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// use express-session
// in mremory session is sufficient for this assignment
app.use(session({
  secret: "csci4131secretkey",
  saveUninitialized: true,
  resave: false}
));

// server listens on port 9007 for incoming connections
//app.listen(9007, () => console.log('Listening on port 9007!'));
//app.listen(9019, () => console.log('Listening on port 9019!'));
app.listen(process.env.PORT || 9019, () => console.log('Listening on port 9019!'));

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/welcome.html');
});

// // GET method route for the contact page.
// It serves contact.html present in client folder
app.get('/contact',function(req, res) {
	if(req.session.value==1){
		console.log("session value = "+req.session.value);
		res.sendFile(__dirname + '/client/contact.html');
	}
	else{
		console.log("redirecting: session value incorrect");
		res.redirect('/login');
	}
});

// GET method route for the addContact page.
// It serves addContact.html present in client folder
app.get('/addContact',function(req, res) {
	if(req.session.value==1){
		console.log("session value = "+req.session.value);
		res.sendFile(__dirname + '/client/addContact.html');
	}
	else{
		console.log("redirecting: session value incorrect");
		res.redirect('/login');
	}
});
//GET method for stock page
app.get('/stock', function (req, res) {
	if(req.session.value==1){
		console.log("session value = "+req.session.value);
		res.sendFile(__dirname + '/client/stock.html');
	}
	else{
		console.log("redirecting: session value incorrect");
		res.redirect('/login');
	}
});

app.get('/admin', function (req, res) {
	if(req.session.value==1){
		console.log("session value = "+req.session.value);
		res.sendFile(__dirname + '/client/adminpage.html');
	}
	else{
		console.log("redirecting: session value incorrect");
		res.redirect('/login');
	}
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});

// GET method to return the list of contacts
// The function queries the tbl_contacts table for the list of contacts and sends the response back to client
app.get('/getListOfContacts', function(req, res) {
	var stmt="SELECT * FROM contact_info"
	con.query(stmt, function(err, result) {
		if(err) {
		  throw err;
		  console.log("Error in login.js")
		}
		console.log(result);
		res.status(200).send(result);
	  });
});


// POST method to insert details of a new contact to tbl_contacts table
app.post('/postContact', function(req, res) {
	var rowToBeInserted = {
		name: req.body.contactName,
		email: req.body.email,
		address: req.body.address,
		phoneNumber: req.body.phoneNumber,
		favoritePlaceURL: req.body.favoritePlaceURL,
		favoritePlace: req.body.favoritePlace
	};
	con.query('INSERT contact_info SET ?', rowToBeInserted, function(err, result) {
		if(err) {
		  throw err;
		}
		console.log("Value inserted");
	});
	res.redirect('/contact');
	//stmt = "INSERT INTO contact_info (name,email,address,phoneNumber,favoritePlaceURL,favoritePlace) VALUES ('test','t@est','123 test street','5555555555','https://www.google.com','testPlace');
});

// POST method to validate user login
// upon successful login, user session is created
app.post('/sendLoginDetails', function(req, res) {
	console.log(req.body);
	var username = req.body.name;
	var password = req.body.password;
	console.log("username: "+username);
	console.log("password: "+password);
	password = crypto.createHash('sha256').update(password).digest('base64');
	console.log("encrypted password: "+password);

	//var stmt="SELECT acc_name FROM tbl_accounts WHERE acc_login='?' AND acc_password='?';";
	//console.log("Query is: "+stmt);
	con.query("SELECT acc_name FROM tbl_accounts WHERE acc_login=? AND acc_password=?;",[username,password], function(err, result) {
		if(err) {
		  throw err;
		  console.log("Error in login.js")
		}
		//console.log(result[0].acc_name);
		if (result[0]==null){ //incorrect usn/pass
			console.log("incorrect usn/pass");
			res.status(200).send("inp")
		}
		else if(req.session.value>=1){
			console.log("already logged in");
			res.status(200).send("ali");
		}
		else{
			console.log("Starting Session");
			req.session.value = 1;
			req.session.user=username; //logs the username of the current user.
			res.redirect('/contact');
		}
	});
});

app.get('/getUsers', function(req, res) {
	var stmt="SELECT * FROM tbl_accounts"
	con.query(stmt, function(err, result) {
		if(err) {
		  throw err;
		  console.log("Error in login.js")
		}
		console.log(result);
		res.status(200).send(result);
	  });
});

app.post('/addUser', function(req, res) {
	var flag = true;
	console.log("Post Request for addUser: "+req.body);
	var rowToBeInserted = {
		acc_name: req.body.name,
		acc_login: req.body.login,
		acc_password: crypto.createHash('sha256').update(req.body.password).digest('base64')
	  };
	con.query('SELECT acc_name FROM tbl_accounts WHERE acc_login = ?',req.body.login, function(err, result) {
		if(err) {
			throw err;
			console.log("Error in addUser first query")
		}
		if(result[0]==undefined){//no results returned from query
			con.query("INSERT INTO tbl_accounts SET ?", rowToBeInserted, function(err, result) {
				if(err) {
				throw err;
				console.log("Error in addUser second query")
				}
				console.log("Insert Succesfull");
				res.status(200).send({flag:true});
			});
		}
		else{ //login name already present
			console.log("login already present");
			res.status(200).send({flag:false});
			flag=false;
		}
	});
});

app.post('/deleteUser', function(req, res) {
	console.log("Current user is: "+req.session.user+req.body.login);
	if(req.session.user==req.body.login){
		res.status(200).send({flag:false});
	}
	else{
		con.query("DELETE FROM tbl_accounts WHERE acc_login = ?",req.body.login, function(err, result) {
			if(err) {
			throw err;
			console.log("Error in deleteUser");
			}
			console.log(result);
			res.status(200).send({flag:true});
		});
	}
});

app.post('/updateUser', function(req, res) {
	console.log("\nUpdating User")
	console.log("Current user is: "+req.session.user+req.body.id);
	if(req.session.user==req.body.login){
		res.status(200).send({flag:false});
	}
	else{
		console.log("!!!!!!!!!!!!!!!!!"+req.body.password);
		if(req.body.name!="" && req.body.password!="" && req.body.login!=""){
			var rowToBeUpdated = {
				acc_name: req.body.name,
				acc_login: req.body.login,
				acc_password: crypto.createHash('sha256').update(req.body.password).digest('base64')
				};
			con.query("UPDATE tbl_accounts SET ? WHERE acc_id = ?",[rowToBeUpdated,req.body.id], function(err, result) {
				if(err) {
					throw err;
					console.log("Error in updateUser");
				}
				console.log("Update Succesfull");
				res.status(200).send({flag:true});
			});
		}
		else{
			res.status(200).send({flag:false});
		}
	}
});

app.get('/userLogin',function(req,res){
	res.send({login:req.session.user});
});

// middle ware to serve static files
app.use('/client', express.static(__dirname + '/client'));


app.get('/first',function(req,res){
	console.log("Starting Session");
	req.session.value = 1;
	res.send('Started Session');
});

app.get('/second',function(req,res){
	console.log("Attempting to visit second");
	if (!req.session.value)
		res.send('Session Not Started');
    else {
		console.log("Got to else in second");
		req.session.value += 1;
		var newval = req.session.value;
		res.send('Session value: ' + newval);
	}
});

// log out of the application  THIS IS An Answer to the Class EXERCISE!!!
// destroy user session
app.get('/logout', function(req, res) {
	if(!req.session.value) {
		res.send('Session not started, can not logout!');
	} else {
		console.log ("Successfully Destroyed Session!");
		req.session.destroy();
		res.redirect('/login');
	}
});

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  res.status(404).send('404 Page Not Found');
});



//mysql -u C4131S20U33 -hcse-larry.cse.umn.edu -P3306 -p C4131S20U33

var mysql = require("mysql");
var crypto = require('crypto');

var con;

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });

let xml_string = fs.readFileSync("./dbconfig.xml", "utf8");
parser.parseString(xml_string, function(error, result) {
    if(error === null) {
		console.log(result.dbconfig.host[0]);
		con = mysql.createPool({
		connectionLimit: 100,
		host:result.dbconfig.host[0],
		user:result.dbconfig.user[0],
		password:result.dbconfig.password[0],
		database:result.dbconfig.database[0],
		port:result.dbconfig.port[0]
		});
    }
    else {
        console.log(error);
    }
});

con.getConnection(function(err) {
	if (err) {
	throw err;
	};
console.log("Connected to MySQL!");
});



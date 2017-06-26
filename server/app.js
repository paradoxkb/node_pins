/**
 * Created by watcher on 1/31/17.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const md5 = require('md5');
var expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var fs    = require("fs");
var Q     = require("q");
var deferred = Q.defer();
var glob = require("glob");
const config = require('./config/config.js');
require('./db/mongoose');
var Pins = require('./db/pins');
var Users = require('./db/users');
let CurrentUser = {};

async function validateToken(token, id) {

	await Users.find({ userID : id }).then(function (data) {
		CurrentUser = data;
	});

	return CurrentUser.token == token;
}

function generateToken(id, name) {

	const header = {"typ" : "JWT", "alg" : "MD5"};

	const IDb64 = new Buffer(id).toString('base64');
	const nameb64  = new Buffer(id).toString('base64');
	const payLoad = md5(IDb64 + nameb64);

	return 0;
}

function convertToFile(strFile, id) {

	const filePath = __dirname + '/../build/img';
	let error = false;
	const reg = new RegExp('^data:image\/(png|jpeg|jpg|gif);base64,');
	const matchesExt = strFile.match(reg);

	const ext = Array.isArray(matchesExt) ? matchesExt[1] : false;
	const base64Data = strFile.replace(reg, '');

	fs.writeFile(filePath + `/${id}.${ext}`, base64Data, 'base64', function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(filePath + `/${id}.${ext}`);
		}
	});

	return "img" + `/${id}.${ext}`;
}

function deleteImg( img ) {

	glob("build/img/*.*",function(err,files){

		if (err) throw err;

		files.forEach(function(item,index,array){

			if(img == item) {
				fs.unlink(item, function(err){
					if (err) throw err;

				});
			}
		});
	});

}

const app = express();

app.use(cors());
app.use(expressJWT({secret: "I've farted, but I'll never tell...",

	getToken: function fromHeaderOrQuerystring (req) {
		if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

			const token = req.headers.authorization.split(' ')[1];
			const userID = req.headers.userid;

			if(validateToken(token, userID)) {
				return token;
			}
		}
		return null;
	}
}).unless({path: ['/adduser']}));


// Setup logger

app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}));

app.use(bodyParser.json({
	limit: '10mb'
}));

app.post('/clearAll', (req, res) => {

	var toRemove;
	var author = req.headers.userid;

	Pins.getPinsByAuthor(author, (err, success) => {
		if(!err) {
			toRemove = success.map((pin, index) => {
				return pin.img;
			});
		}
		else {
			console.log(err);
		}

		toRemove.forEach((item, index, array) => {
			deleteImg( item );
		})

	});
	Pins.find({ author: req.headers.userid }).remove().exec();
	res.send('success');
});

app.post('/removepin/:target', (req, res) => {

	const target = req.params.target;


	//validate user

	const author = req.headers.userID;
	Pins.find({id: target, author: author}, () => {

		Pins.remove({id: target}, function (err, response) {

			Pins.getPinById( (error,success) => {
				deleteImg(success.img);
			});

			(!err) ? res.send('success') : res.send('error');
		});
	});
});

app.post('/addpin', (req, res) => {

	var pin = req.body;

	if (req.body.img) {
		const filePath = convertToFile(req.body.img, req.body.id);

		pin.img = filePath;
	}

	const newPin = new Pins(pin);

	newPin.save((err, result) => {
		if(!err) {
			res.send(result);
		} else {
			res.send('error');
		}
	});
});

app.post('/adduser', (req, res) => {

	const user = req.body;

	Users.findOne({userID : user.userID}, function(err, docs) {

		//we check if user already exists in the db
		if(!docs) {

			//if user doesn't exists in the db we create a new user

			const myToken = jwt.sign({ id: user.userID, name: user.name}, "I've farted, but I'll never tell...");
			user.token = myToken;

			const newUser = new Users(user);

			newUser.save((err, result) => {

				if(!err) {

				const userInfo = { "userID" : result.userID, "name" : result.name, "token" : result.token };

				res.send(userInfo);
			}
			else {
					res.send('error');
				}
			});
		} else {
			res.send(docs);
		}
	});
});

app.get('/pins', (req, res) => {

	Pins.getPinsByAuthor(req.headers.userid, (err, result) => {
		if(!err) {
			res.send(result);
		}
		else {
			res.send(err);
		}
	});
});

app.get('/users', (req, res) => {
	Users.find({ facebookID: req.headers.userid }, function (err, users) {
	if(!err) {
		res.send(users);
	} else {
		console.log('err', err);
	}
})
});

app.post('/singlepin/:target', (req, res) => {
	const target = req.params.target;
	Pins.find({id: target}, function (err, pins) {
		if(!err) {
			res.send(pins);
		} else {
			console.log('err', err);
		}
	});
});

app.post('/updatestamp/:target', (req, res) => {
	const target = req.params.target;
	Pins.find({id: target}, function (err, pins) {
		if(!err) {
			var today = new Date();
			var date = {day: 0, month: 0, year: 0};
			date.day   = today.getDate();
			date.month = today.getMonth() + 1;
			date.year  = today.getFullYear();

			if(date.day < 10) {
				date.day = '0' + date.day;
			}

			if(date.month < 10) {
				date.month = '0' + date.month
			}

			date = date.day + '/' + date.month + '/' + date.year;

			pins.timestamp = date;

			pins.save(function(err, updatedPin) {
				res.send(updatedPin);
			});

		} else {
			console.log('err', err);
		}
	});
});

app.post('/imagepin/:target', (req, res) => {
	const target = req.params.target;
	Pins.find({id: target}, function (err, pins) {
		if(!err) {
			res.send(pins[0].img);
		} else {
			console.log('err', err);
		}
	});
});

/////////////////////////////////////////////////////////////////////////////////
//////////////////////////////   OAuth  ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



module.exports = app;
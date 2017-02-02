/**
 * Created by watcher on 1/31/17.
 */
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
require('./db/mongoose');

var Pins = require('./db/pins');

const app = express();

// Setup logger
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.post('/removepin/:target', (req, res) => {
	const target = req.params.target;
	Pins.remove({_id: target}, function (err, response) {
		(!err) ? res.send('success') : res.send('error');
	})
});
app.post('/addpin', (req, res) => {
	const pin = req.body;
	const newPin = new Pins(pin);
	newPin.save((err, result) => {
		if(!err) {
			res.send('success');
		} else {
			res.send('error');
		}
	});
})
app.get('/pins', (req, res) => {
	Pins.find({}, function (err, pins) {
		if(!err) {
			res.send(pins);
		} else {
			console.log('err', err);
		}
	})
});

app.post('/singlepin/:target', (req, res) => {
	const target = req.params.target;
	console.log(target);
	Pins.find({_id: target}, function (err, pins) {
		if(!err) {
			res.send(pins);
		} else {
			console.log('err', err);
		}
	});
});


module.exports = app;
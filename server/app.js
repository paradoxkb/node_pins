/**
 * Created by watcher on 1/31/17.
 */
const express = require('express');
const morgan = require('morgan');
const path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

const Pins = require('./db/pins');

const app = express();


var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => {console.log('Db connected')});

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(bodyParser.json());
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.post('/removepin', (req, res) => {
	const target = req.body.target;
	Pins.remove({id: target}, function (err, response) {
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

app.post('/singlepin', (req, res) => {
	const target = req.body.target;
	Pins.find({id: target}, function (err, pins) {
		if(!err) {
			res.send(pins);
		} else {
			console.log('err', err);
		}
	});
});

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
	res.write('sended data');
	res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;
/**
 * Created by watcher on 1/31/17.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
require('./db/mongoose');

var Pins = require('./db/pins');

const app = express();

app.use(cors());
app.use(fileUpload());

// Setup logger
app.use(bodyParser.urlencoded({
	limit: '10mb',
	extended: true
}));
app.use(bodyParser.json({
	limit: '10mb'
}));

app.post('/upload', function(req, res) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.sampleFile;
	const fileName = path.resolve('./') + '/build/img/' + sampleFile.name;
	// Use the mv() method to place the file somewhere on your server
	sampleFile.mv(fileName, function(err) {
		if (err)
			return res.status(500).send(err);

		res.send('File uploaded!');
	});
});

app.post('/clearAll', (req, res) => {
	Pins.find({}).remove().exec();
	res.send('success');
});

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
			res.send(result);
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
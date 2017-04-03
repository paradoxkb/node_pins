/**
 * Created by watcher on 1/31/17.
 */
var mongoose = require('mongoose');

var pinsSchema = new mongoose.Schema({
	id: Number,
	title: String,
	lat: String,
	lng: String,
	img: String,
	description: String,
	DateFrom: String,
	DateUntil: String

});

module.exports = mongoose.model('Pins', pinsSchema);
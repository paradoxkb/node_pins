/**
 * Created by watcher on 1/31/17.
 */
var mongoose = require('mongoose');

var pinsSchema = new mongoose.Schema({
	id: String,
	title: String,
	lat: String,
	lng: String,
	img: String,
	description: String,
	DateFrom: String,
	DateUntil: String,
	author: String

});

pinsSchema.statics.getPinsByAuthor = function(author, cb) {

	return this.find({ author: author }, cb);
};

pinsSchema.statics.getPinByID = function(id, cb) {

	return this.findOne({ id: id }, cb);
};
module.exports = mongoose.model('Pins', pinsSchema);
/**
 * Created by watcher on 1/31/17.
 */
var mongoose = require('mongoose');

var pinsSchema = new mongoose.Schema({
	id: Number,
	value: String
});

module.exports = mongoose.model('Pins', pinsSchema);
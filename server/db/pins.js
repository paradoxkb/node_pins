/**
 * Created by watcher on 1/31/17.
 */
var mongoose = require('mongoose');
var db = mongoose.connection;

var pinsSchema = mongoose.Schema({
	id: {type: Number},
	value: {type: String}
});

var Pins = db.model('pins', pinsSchema);


module.exports = Pins
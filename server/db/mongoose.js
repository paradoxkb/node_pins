/**
 * Created by watcher on 2/1/17.
 */
var mongoose    = require('mongoose');

mongoose.connect('mongodb://root:qwerty1@ds023560.mlab.com:23560/pinkeys');

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('connection error:', err.message);
});
db.once('open', function callback () {
	console.log("Connected to DB!");
});

/**
 * Created by watcher on 2/1/17.
 */
var mongoose    = require('mongoose');

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('connection error:', err.message);
});
db.once('open', function callback () {
	console.log("Connected to DB!");
});

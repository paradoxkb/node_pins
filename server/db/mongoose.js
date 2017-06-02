/**
 * Created by watcher on 2/1/17.
 */
var mongoose    = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://Avraam:66292400Aa@ds137110.mlab.com:37110/pinkeys');

var db = mongoose.connection;

db.on('error', function (err) {
	console.log('connection error:', err.message);
});
db.once('open', function callback () {
	console.log("Connected to DB!");
});

/**
 * Created by 1mperec on 4/26/17.
 */

var mongoose = require('mongoose');

var usersSchema = new mongoose.Schema({
    userID: String,
    name: String,
    token: String
});

module.exports = mongoose.model('Users', usersSchema);
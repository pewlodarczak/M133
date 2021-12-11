// Schritt 3 - Das mongoose Modul laden
var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	name: String,
	desc: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});
/*
var userSchema = new mongoose.Schema({
	userName: String,
	password: String

})*/

// Image ist das model mit dem schema imageSchema
module.exports = new mongoose.model('Image', imageSchema);
//module.exports = new mongoose.model('User', userSchema);

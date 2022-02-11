var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
	title: String,
	userNames: {
		type: String,
		value: [],
	},
	note: String,
});

module.exports = mongoose.model('note', noteSchema);

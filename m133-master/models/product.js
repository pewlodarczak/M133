var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
	name: String,
	price: Number,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

module.exports = mongoose.model("Product", ProductSchema);
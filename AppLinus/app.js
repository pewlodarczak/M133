// Schritt 1 - set up express & mongoose
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

var fs = require('fs');
var path = require('path');
require('dotenv/config');

app.use(express.static(__dirname));

// Schritt 2 - Verbindung zur Datenbank
mongoose.connect(process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected')
	});

// Schritt 3 - Code in ./models.js

// Schritt 4 - Set up EJS
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// EJS als templating engine setzen
app.set("view engine", "ejs");

// Schritt 5 - Set up multer um upload files zu speichern
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

// Schritt 6 - Das mongoose model für Image
var imgModel = require('./model/models');
const { PRIORITY_ABOVE_NORMAL } = require('constants');

// Schritt 7 - the GET request handler that provides the HTML UI

app.use(express.static(__dirname));

/*
console.log(__dirname)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
})
*/

app.get('/', (req, res) => {
	console.log('index')
	res.render('index') // render, nicht sendFile
});

app.get('/login', (req, res) =>  {
	res.render("login")
})
app.get('/imagesPage', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			console.log('render("imagesPage")')
			res.render("imagesPage", {items: items});
		}
	});
})
app.get('/register', (req, res) => {
	res.render("register")
})

// Schritt 8 - the POST handler for processing the uploaded file
app.post('/', upload.single('image'), (req, res, next) => {

	var obj = {
		name: req.body.name,
		desc: req.body.desc,
		img: {
			data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
			contentType: 'image/png'
		}
	}
	imgModel.create(obj, (err, item) => {
		if (err) {
			console.log(err);
		}
		else {
			// item.save();
			console.log('redirect(/)')
			res.redirect('/');
		}
	});
});

app.post

// Schritt 9 - Den Server port setzen
var port = process.env.PORT || '3000'
app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})


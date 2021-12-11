var express = require('express')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
var imgModel = require('./model/models');
require('dotenv/config');

var fs = require('fs');
var path = require('path');

//app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(__dirname));

// Schritt 2 - Verbindung zur Datenbank
mongoose.connect(process.env.MONGO_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true }, err => {
		console.log('connected to ' + process.env.MONGO_URL)
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

var port = process.env.PORT
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

app.get('/', (req, res) => {
    console.log('index')
    res.render('index')
})

app.get('/images', (req, res) => {
    console.log('images')
    res.render('images')
})

app.get('/upload', (req, res) => {
    console.log('upload')
    res.render('uploadImages');
    /*
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('uploadImages', { items: items });
		}
	});*/
});

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
			res.redirect('/upload');
		}
	});
});

app.get('/show', (req, res) => {
	imgModel.find({}, (err, items) => {
		if (err) {
			console.log(err);
			res.status(500).send('An error occurred', err);
		}
		else {
			res.render('displayImg', { items: items });
		}
	});
});

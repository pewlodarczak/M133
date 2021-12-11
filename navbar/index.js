var express = require('express')
var app = express()

app.set("view engine", "ejs");

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/Index', (req, res) => {
	res.render('index');
});

var port = '8080'

app.listen(port, err => {
	if (err)
		throw err
	console.log('Server listening on port', port)
})
const express = require('express')
const app = express()

const port = 8080;

app.use(express.static(__dirname));

console.log(__dirname)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/index.html');
})
app.get('/algos', function (req, res) {
    res.sendFile(__dirname + '/html/algos.html');
  })
app.listen(port, () => console.log('The server running on Port ' + port));

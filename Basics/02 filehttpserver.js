var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  
  fs.readFile('html/index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);

/*
var http = require('http');
var fs = require('fs');

const port = 8080;

http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile('Basics/html/index.html', function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            return res.end();
        });
    } else {
            res.end('Invalid Request!');
    }
    
}).listen(port, () => console.log(`Server running on port "${port}"`));
*/
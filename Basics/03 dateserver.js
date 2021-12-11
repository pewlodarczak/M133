var http = require('http');
var dt = require('./modules/datemodule');

port = 8080

/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<h2>The date and time are currently: </h2><br><p>" + dt.myDateTime() + "</p>");
  res.end();
}).listen(8080);
*/

function createResponse (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write("<h2>The date and time are currently: </h2><br><p>" + dt.myDateTime() + "</p>");
  res.end();
}

server = http.createServer(createResponse)
server.listen(port)

console.log("HTTP Server running")
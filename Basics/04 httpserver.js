var http = require('http') // include a module

const port = 8080

const httpfunc = (req, res) =>  {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello World!</h2>');
}

const server = http.createServer(httpfunc);
  
server.listen(port, () => console.log(`Server running on port ${port}`));

/*
// compact version
http.createServer(function (req, res)  {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<h1>Hello World!</h2>');
}).listen(port, () => console.log(`Server running on port ${port}`));
*/
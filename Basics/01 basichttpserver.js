var http = require('http');

var server = http.createServer(function (req, res) {

  if (req.url == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(
      `<html><body style="text-align:center;">
            <h1 style="color:blue;">Welcome to Node.js</h1>
            <p><h2>Landing page</h2></p>
            <p>
            <a href="/links">Go to links</a>
            </p>
            <p>
            <a href="/algo">Go to algorithms</a>
            </p>
            </body></html>`);
    res.end();
  }
  else if (req.url == "/links") {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
          <html><body style="text-align:center;">
            <h1 style="color:blue;">Link list</h1>
            <p>
            <a href="https://slashdot.org/">
              Slashdot
            </a>
            </p>
            <p>
            <a href="https://www.engadget.com/">
            Engadget
          </a>
          </p>
          <p>
          <a href="https://www.imdb.com/">
          imdb
        </a>
        </p>
        <p>
        <a href="/">
        Back home
      </a>
      </p>

          </body></html>`);
    res.end();//end the response

  }
  else if (req.url == "/algo") {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<html><body style="text-align:center;">
        <h1 style="color:blue;">Algorithms</h1>
        <p>
        <a href="https://howtodoinjava.com/java-algorithms-implementations/">
          Java algorithms
        </a>
        </p>
        <p>
        <a href="/">
        Back home
      </a>
      </p>

      </body></html>`);
    res.end(); //end the response

  }
  else
    res.end('Invalid Request!'); //end the response

  // Server object listens on port 8081
}).listen(3000, () => console.log('Server running on port 3000'));

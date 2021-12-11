const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

port = 8080

//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname)))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})

app.get('/file', function(req, res) {
  res.sendFile(path.join(__dirname + '/file.htm'))
})

/*
app.use('/file', (req, res) => {
  // **modify your existing code here**
  fs.readFile('data.json', (e, data) => {
     if (e) throw e;
     res.send(data);
  });
});*/

let jsonData = require('./data.json');
/*
app.use('/file', (req, res) => {
  // **modify your existing code here**
  fs.readFile('data.json', function(err, data) {
    // Check for errors
    if (err) throw err;
    // Converting to JSON
    const users = JSON.parse(data);
    //console.log(users); // Print users
    //res.send(users);
    console.log(jsonData); // Print users
    res.send(jsonData);

  });
});
*/

app.get('/videos', function(req, res) {
  res.sendFile(path.join(__dirname + '/videos.htm'))
})

app.get('/video1', function(req, res) {
  const path = 'assets/Road.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.get('/video2', function(req, res) {
  const path = 'assets/Seoul.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    if(start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n'+start+' >= '+fileSize);
      return
    }
    
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})

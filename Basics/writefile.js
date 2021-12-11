var fs = require('fs');

fs.writeFile('newfile.txt', 'Hello content!', function (err) {
  if (err) throw err;
  console.log('Saved!');
}); 

const fs = require('fs');

var array = fs.readFileSync('Basics/Random/INFA2b.txt').toString().split("\n");
array.splice(array.length-1, 1)

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}
  
shuffle(array);
//console.log(array);
for(i in array) {
    console.log(array[i]);
}





/**************************************
 * ACID problem from muti user but fast than db
 * ACID property not support data shoude be safe
 * **************** */




//CRUD Josn file data
var fs = require('fs');

// thing.json data
var dict = {
    "one": [15, 4.5],
    "two": [34, 3.3],
    "three": [67, 5.0],
    "four": [32, 4.1]
};


//******************read json file data*******************

// var sample = require('./thing.json');
let sample = JSON.parse(fs.readFileSync("thing.json"));

console.log(sample);



//***********************update json data****************
// sample.one[0] = 10
// console.log((sample.one[0]));


// sample = {
//     "one": [1, 4.5],
//     "two": [34, 3.3],
//     "three": [67, 5.0],
//     "four": [32, 4.1]
// }


//********************delete json object*******************
// delete sample.one


var dictstring = JSON.stringify(sample);

//********************************create data/ write data best for large file asynchronous********
fs.writeFile("thing.json", dictstring, function (err, result) {
    if (err) console.log('error', err);
});


// fs.writeFileSync("thing.json", dictstring);



// find value in object
let obj = arr.find(data => data.name === 'Krunal');


var check = productImages.filter(p => p.id === product.id);

// products.slice(0, 11).map(item => (





// get new array extract from object
const countries = [
    { name: "India", capital: "Delhi" },
    { name: "US", capital: "Washington" },
    { name: "Russia", capital: "Moscow" },
    { name: "Singapore", capital: "Singapore" },
    { name: "China", capital: "Beijing" },
    { name: "France", capital: "Paris" },
];

const cityNames = Array.from(countries, ({ capital }) => capital);
console.log(cityNames); // ['Delhi, 'Washington', 'Moscow', 'Singapore', 'Beijing', 'Paris']



//two array combine
array1.concat(array2, array3, ..., arrayX)




// unique remove dulicat of aary
console.log([...new Set([1, 2, 4, 4, 3])]); // [1, 2, 4, 3]



// remove new line from string
message.replace(/[\r\n]+/gm, ""));



// swap element
var x = 10,
    y = 20;

[x, y] = [y, x];
console.log(x); // 20
console.log(y); // 10



//destructuring assignment
var { name, age } = { name: "John", age: 32 };
console.log(name); // John
console.log(age); // 32



//aray
// Arrays.sort();
// fruits.reverse()
// numeric sort array
// const points = [40, 100, 1, 5, 25, 10];
// points.sort(function (a, b) { return a - b });

// //filter or use numbers.every() or numbers.some() or numbers.find()
// const numbers = [45, 4, 9, 16, 25];
// const over18 = numbers.filter((value, index, array) => {
//     return value > 18;
// });



// let sum = numbers.reduce((total, value, index, array) => {
//     return total + value;
// });
  
//   or reduceRight() rom left - to - right in the array




// //index of  or use fruits.lastIndexOf()
// const fruits = ["Apple", "Orange", "Apple", "Mango"];
// let position = fruits.indexOf("Apple") + 1;




// // JavaScript Array Keys()
// he Array.keys() method returns an Array Iterator object with the keys of an array.
// const fruits = ["Banana", "Orange", "Apple", "Mango"];
// const keys = fruits.keys();


// fruits.includes("Mango"); // is true





// Math.round(x)	Returns x rounded to its nearest integer
// Math.ceil(x)	Returns x rounded up to its nearest integer
// Math.floor(x)	Returns x rounded down to its nearest integer
// Math.trunc(x)	Returns the integer part of x(new in ES6)
// Math.sign(x) returns if x is negative, null or positive:
// Math.abs(x) returns the absolute(positive) value of x:
// Math.pow(8, 2);
// Math.sqrt(64);
// Math.min(0, 150, 30, 20, -8, -200);
// Math.max(0, 150, 30, 20, -8, -200);
// // Returns a random integer from 0 to 99:
// Math.floor(Math.random() * 100);




// getFullYear()	Get year as a four digit number(yyyy)
// getMonth()	Get month as a number(0 - 11)
// getDate()	Get day as a number(1 - 31)
// getDay()	Get weekday as a number(0 - 6)
// getHours()	Get hour(0 - 23)
// getMinutes()	Get minute(0 - 59)
// getSeconds()	Get second(0 - 59)
// getMilliseconds()	Get millisecond(0 - 999)
// getTime()	Get time(milliseconds since January 1, 1970)








// Regular Expression
// i	Perform case -insensitive matching	
// g	Perform a global match(find all matches rather than stopping after the first match)	
// m	Perform multiline matching


// [abc]	Find any of the characters between the brackets
// [0 - 9]	Find any of the digits between the brackets
//     (x | y)	Find any of the alternatives separated with |


// \d	Find a digit
// \s	Find a whitespace character
// \b	Find a match at the beginning of a word like this: \bWORD, or at the end of a word like this: WORD\b


// /m/.test("Str")
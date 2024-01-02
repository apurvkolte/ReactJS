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
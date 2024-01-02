// convert object to array in react

var myMap = new Map().set(1, "hey").set(2, "you"),
    mapData = JSON.stringify([...myMap]),
    values = JSON.parse(mapData).map(d => d[1]);
console.log("mapData:", mapData);
console.log("values:", values);




// json representation of objects
console.dir(obj);

// table format
console.table(obj)



const user = { name: "John", id: 1, city: "Delhi" };
console.log("Hello %s, your details %o are available in the object form", "John", user);
// Hello John, your details {name: "John", id: 1, city: "Delhi"} are available in object






// comapre axcat two arrays
const arrayFirst = [1, 2, 3, 4, 5];
const arraySecond = [1, 2, 3, 4, 5];
console.log(
    arrayFirst.length === arraySecond.length &&
    arrayFirst.every((value, index) => value === arraySecond[index])
); // true


// if sort then comapre
const arrayFirst = [2, 3, 1, 4, 5];
const arraySecond = [1, 2, 3, 4, 5];
console.log(
    arrayFirst.length === arraySecond.length &&
    arrayFirst.sort().every((value, index) => value === arraySecond[index])
); //true

//sort array
[11, 60].sort((a, b) => a - b)







//minmum max value inaaray
Math.min.apply(null, arr)

or

var marks = [50, 20, 70, 60, 45, 30];
function findMin(arr) {
    var length = arr.length;
    var min = Infinity;
    while (length--) {
        if (arr[length] < min) {
            min = arr[length];
        }
    }
    return min;
}

function findMax(arr) {
    var length = arr.length;
    var max = -Infinity;
    while (length--) {
        if (arr[length] > max) {
            max = arr[length];
        }
    }
    return max;
}

console.log(findMin(marks));
console.log(findMax(marks));




String represent of object are
uneval(a)
toString()
JSON.toStringify()


Object.seal() =.oject cannt deleted or add but you can chnage
const object = {
    property: "Welcome JS world",
};
Object.seal(object);
object.property = "Welcome to object world";
console.log(Object.isSealed(object)); // true
delete object.property; // You cannot delete when sealed
console.log(object.property); //Welcome to object world
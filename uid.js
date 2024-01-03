1.//create unique order id for order_id in indicent
var date = new Date();
var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
];
var uuid = components.join("");
return uuid

//output  "124021106664"




function generateUniqueId() {
    const timestamp = new Date().getTime().toString(16); // Convert timestamp to hexadecimal
    const randomPart = Math.random().toString(16).substring(2); // Generate a random hexadecimal string

    return timestamp + randomPart;
}

const uniqueId = generateUniqueId();
console.log(uniqueId); // "18ccde7cb7b81d2149a0d752"




new Date().getTime().toString(36) + Math.random().toString(36).slice(2)


// 2
new Date().valueOf();

// output 1704173466160
new Date().getTime();
// output > 1704173706816
(new Date().getTime()).toString(36);
// output "lqvx1n8o"

// 3
Date.now() + ((Math.random() * 100000).toFixed());
//output 1704173871279 best for miili second




//5
Math.floor(new Date().valueOf() * Math.random())
//output 1636094169651

//3
function getRandomNumbers() {
    const typedArray = new Uint8Array(10);
    const randomValues = window.crypto.getRandomValues(typedArray);
    return randomValues.join('');
}

//output "167221781501662233178121114"





// Date cen be more than last 7 days
(new Date() - new Date(order.order_date)) / 86400000 > 7




// unique id
Date.now()
String(Date.now()).slice(3, 13)




String(user.date).substring(0, 10)


// setter & getter in javascript
exports.order = {

    // data property
    firstName: 'Monika',

    // accessor property(getter)
    get getName() {
        return this.firstName;
    },

    //accessor property(setter)
    set changeName(newName) {
        this.firstName = newName;
    }
};




const { order } = require('./order')

// change(set) object property using a setter
order.changeName = "Monika Patil"


// accessing data property
console.log(order.firstName); // Monica

// accessing getter methods
console.log(order.getName); // Monica
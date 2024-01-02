exports.order = {

    // data property
    orderString: 'NEW',

    // accessor property(getter)
    get getName() {
        return this.orderString;
    },

    //accessor property(setter)
    set changeName(newName) {
        this.orderString = newName;
    }
};
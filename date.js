function date() {
    var d = new Date();
    today = [d.getMonth() + 1,
    d.getDate(),
    d.getFullYear()].join('/') + ' ' +
        [d.getHours(),
        d.getMinutes(),
        d.getSeconds()].join(':');
    return today;
}

export default date;

//> "1/24/2024 10:32:49"

//new Date().toLocaleString()
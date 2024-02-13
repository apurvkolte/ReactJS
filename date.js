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

//sql  select DATE_FORMAT(NOW(),'%d/%m/%Y %H:%i:%s');




var d = new Date("2023-01-22 00:00:00").toLocaleDateString('en-IN');
// "22/01/2023"

var d = new Date("2023-01-22 00:00:00").toLocaleString('en-IN')
//"22/01/2023, 00:00:00"


const date = new Date("2023-01-22 00:00:00");
console.log(date.getDate() + '/' + date.getMonth() + 1 + '/' + date.getFullYear());
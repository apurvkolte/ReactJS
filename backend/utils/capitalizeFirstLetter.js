exports.capitalizeFirstLetter = (str) => {
    const arr = str.split(" ");
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const str2 = arr.join(" ").replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim();
    return str2;
}
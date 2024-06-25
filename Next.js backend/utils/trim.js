exports.trim = (str) => {
    const str2 = str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim();
    return str2;
}
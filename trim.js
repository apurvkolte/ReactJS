exports.trim = (str) => {
    const str2 = str.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim();
    return str2;
}



//trim(req.body.description);

// url space reomve
// str.replace(/%20/g, " ");
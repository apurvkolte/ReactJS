var pincodeDirectory = require('india-pincode-lookup');


// onKeyUp={() => postalAddress(443112)}

function postalAddress(postalCode) {
    const pincodeDir = pincodeDirectory.lookup(postalCode);
    if (pincodeDir.length) {
        setState(capitalCase(pincodeDir[0].stateName.toLowerCase()))
        setCity((pincodeDir[0].taluk === 'NA' ? "" : pincodeDir[0].taluk + ", Ds: ") + pincodeDir[0].districtName)
        setCountry("India")
    }
}



import pincode from "pincode-distance"
const Pincode = new pincode();
// var distance = Pincode.getDistance("411027", `${shippingInfo.postalCode ? shippingInfo.postalCode : ""}`);
// var shippingPriceDistance;
    
  // if (distance <= 100) {
    //     shippingPriceDistance = 0
    // }
    // if (distance === -1) {
    //     shippingPriceDistance = 2000;
    //     distance = 1900
    // }

    // if (distance > 100) {
    //     shippingPriceDistance = 200
    // }

    // if (distance >= 500) {
    //     shippingPriceDistance = 500
    // }

    // if (distance >= 1000) {
    //     shippingPriceDistance = 1000
    // }

    // if (distance >= 2000) {
    //     shippingPriceDistance = 3000
    // }

    // if (distance >= 3500) {
    //     shippingPriceDistance = 3500
    // }

    // console.log("distance", distance);
    // console.log("orderStockResult", orderStockResult);
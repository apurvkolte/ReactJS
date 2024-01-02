
// Display Money in Indian Format
export const displayMoney = (n) => {
    const numFormat = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    });

    return numFormat.format(n).split('.', 1);
};
//displayMoney(product.sale_price);

// Calculate Discount Percentage 
export const calculateDiscount = (discountedPrice, originalPrice) => {
    const discountedPercent = (discountedPrice / originalPrice) * 100;

    return Math.round(discountedPercent);
};


// Calculate Total Amount
export const calculateTotal = (arr) => {
    const total = arr.reduce((accum, val) => accum + val, 0);

    return total;
};



// export const getDiscount = (price, discount) => {
//     const discountPrice = (price - ((discount / 100.0) * price));
//     return discountPrice
// }
// getDiscount(1000,10)
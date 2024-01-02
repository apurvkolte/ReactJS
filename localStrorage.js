localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
cartItems = JSON.parse(window.localStorage.getItem('cartItems'))
window.localStorage.removeItem('cartItems');


localStorage.setItem('shippingInfo', JSON.stringify(data))
shippingInfo.address1  //get
localStorage.removeItem("mytime"); //remove
shippingInfo.city



//session store data until browser not closed
sessionStorage.setItem('orderInfo', JSON.stringify(data))
const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
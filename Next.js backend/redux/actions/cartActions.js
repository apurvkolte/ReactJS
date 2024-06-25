import axios from "axios";
import { ADD_TO_CART, REMOVE_ITEM_CART, ADD_TO_BUY, REMOVE_ITEM_BUY, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/product-details/${id}`)
    // console.log("data", data);
    // console.log("id", id);
    // console.log("quantity", quantity);
    // console.log("dispatch", dispatch);
    // console.log("getState", getState);
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product.id,
            name: data.product.name,
            original_price: data.product.original_price,
            sale_price: data.product.sale_price,
            discount: data.product.discount,
            image: data.product.image,
            stock: data.product.stock,
            bulk_qty: data.product.bulk_qty,
            quantity,
            tax_amount: data.product.tax_amount,
            tax_rate: data.product.tax_rate
        }
    })

    // console.log(JSON.stringify(getState().cart.cartItems));

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeItemFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    })

    // console.log(JSON.stringify(getState().cart.cartItems));

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}


export const addBuyItem = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/product-details/${id}`)
    dispatch({
        type: ADD_TO_BUY,
        payload: {
            product: data.product.id,
            name: data.product.name,
            original_price: data.product.original_price,
            sale_price: data.product.sale_price,
            discount: data.product.discount,
            image: data.product.image,
            stock: data.product.stock,
            quantity,
            tax_amount: data.product.tax_amount,
            tax_rate: data.product.tax_rate
        }
    })

    // localStorage.setItem('buyItem', JSON.stringify(getState().buy.buyItem))
}

export const removeBuyItem = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_ITEM_BUY,
        payload: id
    })

    // localStorage.setItem('buyItem', JSON.stringify(getState().buy.buyItem))
}

export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))
}

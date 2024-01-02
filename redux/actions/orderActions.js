import axios from "axios";
import fileDownload from 'js-file-download'
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    CLEAR_ERRORS,
    ALL_COUPON_REQUEST,
    ALL_COUPON_SUCCESS,
    ALL_COUPON_FAIL,
    CREATE_COUPON_REQUEST,
    CREATE_COUPON_SUCCESS,
    CREATE_COUPON_FAIL,
    DELETE_COUPON_REQUEST,
    DELETE_COUPON_SUCCESS,
    DELETE_COUPON_FAIL,
    COUPON_DETAILS_REQUEST,
    COUPON_DETAILS_SUCCESS,
    COUPON_DETAILS_FAIL,
    UPDATE_COUPON_REQUEST,
    UPDATE_COUPON_SUCCESS,
    UPDATE_COUPON_FAIL,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_RETURN_ORDER_REQUEST,
    CANCEL_RETURN_ORDER_SUCCESS,
    CANCEL_RETURN_ORDER_FAIL,
    INVOICE_REQUEST,
    INVOICE_SUCCESS,
    INVOICE_FAIL,
    PAYMENT_REQUEST,
    PAYMENT_REQUEST_SUCCESS,
    PAYMENT_REQUEST_FAIL,
    RETURN_ORDER_REQUEST,
    RETURN_ORDER_SUCCESS,
    RETURN_ORDER_FAIL,
    REPORT_REQUEST,
    REPORT_SUCCESS,
    REPORT_FAIL,
    SALES_REQUEST,
    SALES_SUCCESS,
    SALES_FAIL
} from "../constants/orderConstants";

export const createOrder = (order) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_ORDER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/orders', order, config)

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data.orderStockResult
        })
    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.message
        })

    }
}

export const ccavReqHandler = (formData) => async (dispatch,) => {
    try {
        dispatch({
            type: PAYMENT_REQUEST
        })
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const { data } = await axios.post('/api/ccavRequestHandler', formData, config)

        dispatch({
            type: PAYMENT_REQUEST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: PAYMENT_REQUEST_FAIL,
            payload: error.response.data.message
        })
    }
}

export const statusReqHandler = (formData) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        const { data } = await axios.post(`https://logintest.ccavenue.com/apis/servlet/DoWebTrans`, null, formData)
        console.log("data enc rejqj", data);

    } catch (error) {

    }
}

// Get currently logged  in user orders
export const myOrders = () => async (dispatch) => {
    try {
        dispatch({
            type: MY_ORDERS_REQUEST
        })
        const { data } = await axios.get('/api/orders')

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Get order details
export const getOrderDetails = (id) => async (dispatch) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })
        const { data } = await axios.get(`/api/orders/details/${id}`)
        // console.log("data0", data.order);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data.order
        })
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Get all orders - Admin
export const allOrders = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_ORDERS_REQUEST })

        const { data } = await axios.get(`/api/admin/orders`)

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// update order
export const updateOrder = (id, orderData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_ORDER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/admin/orders/${id}`, orderData, config)

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}
// Delete order
export const deleteOrder = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ORDER_REQUEST })

        const { data } = await axios.delete(`/api/admin/order/${id}`)

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}


// Cancel order
export const cancelOrder = (id, formData) => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_ORDER_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/orders/cancel/${id}`, formData, config)

        dispatch({
            type: CANCEL_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}

// return order
export const returnOrder = (id, formData) => async (dispatch) => {
    try {
        dispatch({ type: RETURN_ORDER_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/orders/return/${id}`, formData, config)

        dispatch({
            type: RETURN_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: RETURN_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}


// Cancel return order
export const cancelReturnOrder = (id, formData) => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_RETURN_ORDER_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/orders/cancelReturn/${id}`, formData, config)

        dispatch({
            type: CANCEL_RETURN_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: CANCEL_RETURN_ORDER_FAIL,
            payload: error.response.data.message
        })
    }
}


//coupon
export const createCoupon = (coupon) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_COUPON_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/admin/coupons', coupon, config)
        // console.log("data", data);

        dispatch({
            type: CREATE_COUPON_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CREATE_COUPON_FAIL,
            payload: error.response.data.message
        })

    }
}

// Get coupon details
export const getCouponDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: COUPON_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/admin/coupons/${id}`)
        dispatch({
            type: COUPON_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: COUPON_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Get all coupons - Admin
export const getAllCoupons = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_COUPON_REQUEST })

        const { data } = await axios.get(`/api/admin/coupons`)

        dispatch({
            type: ALL_COUPON_SUCCESS,
            payload: data.coupons
        })

    } catch (error) {
        dispatch({
            type: ALL_COUPON_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get all coupons - Admin
export const getAllUserCoupons = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_COUPON_REQUEST })

        const { data } = await axios.get(`/api/admin/coupons/couponsAll`)

        dispatch({
            type: ALL_COUPON_SUCCESS,
            payload: data.coupons
        })

    } catch (error) {
        dispatch({
            type: ALL_COUPON_FAIL,
            payload: error.response.data.message
        })
    }
}

// update coupon
export const updateCoupon = (id, orderData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_COUPON_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/admin/coupons/${id}`, orderData, config)

        dispatch({
            type: UPDATE_COUPON_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_COUPON_FAIL,
            payload: error.response.data.message
        })
    }
}


// Delete coupons
export const deleteCoupon = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_COUPON_REQUEST })


        const { data } = await axios.delete(`/api/admin/coupons/${id}`)

        dispatch({
            type: DELETE_COUPON_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_COUPON_FAIL,
            payload: error.response.data.message
        })
    }
}

//Invoice
export const invoicePdf = (id, order_date) => async (dispatch) => {
    try {
        const { data } = await axios.get(`/api/invoice/${id}`)
        const invoiceNo = String(new Date(order_date).getTime() + `${id}`)
        window.open(data.path, null)
        // window.open(URL.createObjectURL(data.path))
        // fileDownload(data, `${invoiceNo}.pdf`)
    } catch (error) {
        throw error
    }
}

//get unique id for order
export const getOrderId = () => {
    //create unique order id 
    var date = new Date();
    var components = [
        date.getYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    ];
    var uuid = components.join("");
    return uuid
}


// Get all report - Admin  /api/v1/admin/report/
export const allReports = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REPORT_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/admin/report`, userData, config);

        dispatch({
            type: REPORT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REPORT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get all sales - Admin  /api/v1/admin/sales/
export const allSales = () => async (dispatch) => {
    try {
        dispatch({ type: SALES_REQUEST })

        const { data } = await axios.get('/api/v1/admin/report');

        dispatch({
            type: SALES_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: SALES_FAIL,
            payload: error.response.data.message
        })
    }
}



//Clear Error
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })

}
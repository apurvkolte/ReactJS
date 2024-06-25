import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    CLEAR_ERRORS,
    ALL_COUPON_REQUEST,
    ALL_COUPON_SUCCESS,
    ALL_COUPON_FAIL,
    CREATE_COUPON_REQUEST,
    CREATE_COUPON_SUCCESS,
    CREATE_COUPON_FAIL,
    CREATE_COUPON_RESET,
    DELETE_COUPON_REQUEST,
    DELETE_COUPON_SUCCESS,
    DELETE_COUPON_RESET,
    DELETE_COUPON_FAIL,
    COUPON_DETAILS_REQUEST,
    COUPON_DETAILS_SUCCESS,
    COUPON_DETAILS_FAIL,
    UPDATE_COUPON_REQUEST,
    UPDATE_COUPON_SUCCESS,
    UPDATE_COUPON_RESET,
    UPDATE_COUPON_FAIL,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAIL,
    CANCEL_ORDER_RESET,
    PAYMENT_REQUEST,
    PAYMENT_REQUEST_SUCCESS,
    PAYMENT_REQUEST_FAIL,
    RETURN_ORDER_REQUEST,
    RETURN_ORDER_SUCCESS,
    RETURN_ORDER_FAIL,
    RETURN_ORDER_RESET,
    CANCEL_RETURN_ORDER_REQUEST,
    CANCEL_RETURN_ORDER_SUCCESS,
    CANCEL_RETURN_ORDER_FAIL,
    CANCEL_RETURN_ORDER_RESET,
    REPORT_REQUEST,
    REPORT_SUCCESS,
    REPORT_FAIL,
    SALES_REQUEST,
    SALES_SUCCESS,
    SALES_FAIL

} from "../constants/orderConstants";

export const newOrderReducer = (state = { orderStockResult: {} }, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                orders: action.payload,
                orderStockResult: action.payload
            };
        case CREATE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const myOrdersReducer = (state = { orders: [], cancelOrders: [], returnOrders: [] }, action) => {
    switch (action.type) {
        case MY_ORDERS_REQUEST:
            return {
                loading: true,
            };
        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                cancelOrders: action.payload.cancelOrders,
                returnOrders: action.payload.returnOrders,
            };
        case MY_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export const orderDetailsReducer = (state = { order: [] }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload
            };
        case ORDER_DETAILS_FAIL:
            return {
                ...state,
                error1: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error1: false
            };

        default:
            return state;
    }
};

export const allOrdersReducer = (state = { orders: [], cancelOrders: [], returnOrders: [], failOrders: [] }, action) => {
    switch (action.type) {
        case ALL_ORDERS_REQUEST:
            return {
                loading: true,
            };
        case ALL_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload.orders,
                cancelOrders: action.payload.cancelOrders,
                returnOrders: action.payload.returnOrders,
                failOrders: action.payload.failOrders,
                totalAmount: action.payload.totalAmount,
                returnAmount: action.payload.returnAmount,
                allAmount: action.payload.allAmount,
            };
        case ALL_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export const orderReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_ORDER_FAIL:
        case DELETE_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case UPDATE_ORDER_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_ORDER_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const cancelReducer = (state = {}, action) => {
    switch (action.type) {

        case CANCEL_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CANCEL_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isCancel: action.payload
            }

        case CANCEL_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CANCEL_ORDER_RESET:
            return {
                ...state,
                isCancel: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}


export const returnReducer = (state = {}, action) => {
    switch (action.type) {

        case RETURN_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case RETURN_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isReturn: action.payload
            }

        case RETURN_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case RETURN_ORDER_RESET:
            return {
                ...state,
                isReturn: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const cancelReturnReducer = (state = {}, action) => {
    switch (action.type) {

        case CANCEL_RETURN_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CANCEL_RETURN_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isCancelReturn: action.payload
            }

        case CANCEL_RETURN_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CANCEL_RETURN_ORDER_RESET:
            return {
                ...state,
                isCancelReturn: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const newCouponReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_COUPON_REQUEST:
            return {
                ...state,
                loading: true
            };
        case CREATE_COUPON_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                coupon: action.payload.coupon
            };
        case CREATE_COUPON_FAIL:
            return {
                loading: false,
                error: action.payload
            };

        case CREATE_COUPON_RESET:
            return {
                ...state,
                success: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state
    }
};


export const couponDetailsReducer = (state = { coupon: {} }, action) => {
    switch (action.type) {
        case COUPON_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case COUPON_DETAILS_SUCCESS:
            return {
                loading: false,
                coupon: action.payload.coupon
            };

        case COUPON_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

export const allCouponsReducer = (state = { coupons: [] }, action) => {
    switch (action.type) {
        case ALL_COUPON_REQUEST:
            return {
                loading: true
            };
        case ALL_COUPON_SUCCESS:
            return {
                loading: false,
                coupons: action.payload
            };
        case ALL_COUPON_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state
    }
};


export const getAllUserCoupons = (state = { coupons: [] }, action) => {
    switch (action.type) {
        case ALL_COUPON_REQUEST:
            return {
                loading: true
            };
        case ALL_COUPON_SUCCESS:
            return {
                loading: false,
                coupons: action.payload
            };
        case ALL_COUPON_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state
    }
};

export const couponDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_COUPON_REQUEST:
        case UPDATE_COUPON_REQUEST:
            return {
                ...state,
                loading: true
            }
        case UPDATE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                isUpdated: action.payload
            }
        case DELETE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DELETE_COUPON_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case UPDATE_COUPON_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case DELETE_COUPON_FAIL:
        case UPDATE_COUPON_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const enc_requestReducer = (state = { encRequest: {}, accessCode: {} }, action) => {
    switch (action.type) {
        case PAYMENT_REQUEST:
            return {
                loading: true,
            };

        case PAYMENT_REQUEST_SUCCESS:
            return {
                loading: false,
                encRequest: action.payload.encRequest,
                accessCode: action.payload.accessCode
            };
        case PAYMENT_REQUEST_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};


export const reportsReducer = (state = { orderRecord: [], totalAmount: [] }, action) => {
    switch (action.type) {
        case REPORT_REQUEST:
            return {
                loading: true,
            };
        case REPORT_SUCCESS:
            return {
                loading: false,
                orderRecord: action.payload.orderRecord,
                totalAmount: action.payload.totalAmount
            };
        case REPORT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export const salesReducer = (state = { sales: [], processing: {}, shipped: {}, delivered: {}, cancel: {}, returned: {}, returnApproved: {}, yearSales: {} }, action) => {
    switch (action.type) {
        case SALES_REQUEST:
            return {
                loading: true,
            };
        case SALES_SUCCESS:
            return {
                loading: false,
                sales: action.payload.sales,
                processing: action.payload.processing,
                shipped: action.payload.shipped,
                delivered: action.payload.delivered,
                cancel: action.payload.cancel,
                returned: action.payload.returned,
                returnApproved: action.payload.returnApproved,
                yearSales: action.payload.yearSales
            };
        case SALES_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};


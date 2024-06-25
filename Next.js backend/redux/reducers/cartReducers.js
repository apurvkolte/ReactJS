import { ADD_TO_CART, REMOVE_ITEM_CART, ADD_TO_BUY, REMOVE_ITEM_BUY, SAVE_SHIPPING_INFO } from "../constants/cartConstants";

export const cartReducer = (state = { cartItems: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload;
            const isItemExist = state.cartItems.find(i => i.product === item.product)

            if (isItemExist) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
        case REMOVE_ITEM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(i => i.product !== action.payload)
            }

        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        default:
            return state
    }
}

export const buyReducer = (state = { buyItem: [], shippingInfo: {} }, action) => {
    switch (action.type) {
        case ADD_TO_BUY:
            const item = action.payload;
            const isItemExist = state.buyItem.find(i => i.product === item.product)

            if (isItemExist) {
                return {
                    ...state,
                    buyItem: state.buyItem.map(i => i.product === isItemExist.product ? item : i)
                }
            } else {
                return {
                    ...state,
                    buyItem: [...state.buyItem, item]
                }
            }
        case REMOVE_ITEM_BUY:
            return {
                ...state,
                buyItem: state.buyItem.filter(i => i.product !== action.payload)
            }
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        default:
            return state
    }
}
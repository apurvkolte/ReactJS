import { useDispatch, useSelector } from "react-redux";
import { saveShippingInfo } from "../../actions/cartActions";
const dispatch = useDispatch();

dispatch(saveShippingInfo({ name, mobile, flat, area, landmark, city, state, country, postalCode, gstn }));






// CART ACTION
export const saveShippingInfo = (data) => async (dispatch) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    })

    // localStorage.setItem('shippingInfo', JSON.stringify(data))
}




//REDUCER
export const cartReducer = (state = { shippingInfo: {} }, action) => {
    switch (action.type) {
        case SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        default:
            return state
    }
}



//   const {  shippingInfo } = useSelector(state => state.buy)
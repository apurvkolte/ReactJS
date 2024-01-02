import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_RESET,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_RESET,
    UPDATE_USER_FAIL,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_RESET,
    ALL_ADDRESS_REQUEST,
    ALL_ADDRESS_SUCCESS,
    ALL_ADDRESS_FAIL,
    ADDRESS_DETAILS_REQUEST,
    ADDRESS_DETAILS_SUCCESS,
    ADDRESS_DETAILS_FAIL,
    ADD_ADDRESS_REQUEST,
    ADD_ADDRESS_SUCCESS,
    ADD_ADDRESS_FAIL,
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAIL,
    UPDATE_ADDRESS_RESET,
    DELETE_ADDRESS_REQUEST,
    DELETE_ADDRESS_SUCCESS,
    DELETE_ADDRESS_FAIL,
    DELETE_ADDRESS_RESET,
    ADD_ADDRESS_RESET,
    DEFAULT_ADDRESS_REQUEST,
    DEFAULT_ADDRESS_SUCCESS,
    DEFAULT_ADDRESS_FAIL,
    DEFAULT_ADDRESS_RESET,
    EMAIL_VERIFICATION_REQUEST,
    EMAIL_VERIFICATION_SUCCESS,
    EMAIL_VERIFICATION_FAIL,
    EMAIL_VERIFICATION_RESET,
    SHARE_COUPON_REQUEST,
    SHARE_COUPON_SUCCESS,
    SHARE_COUPON_FAIL,
    CLEAR_ERRORS,
    NEW_ENQUIRY_REQUEST,
    NEW_ENQUIRY_SUCCESS,
    NEW_ENQUIRY_FAIL,
    GET_ABOUTUS_REQUEST,
    GET_ABOUTUS_SUCCESS,
    GET_ABOUTUS_FAIL,
    UPDATE_ABOUTUS_REQUEST,
    UPDATE_ABOUTUS_SUCCESS,
    UPDATE_ABOUTUS_FAIL,
    GET_CONTACTUS_REQUEST,
    GET_CONTACTUS_SUCCESS,
    GET_CONTACTUS_FAIL,
    UPDATE_CONTACTUS_REQUEST,
    UPDATE_CONTACTUS_SUCCESS,
    UPDATE_CONTACTUS_FAIL,
    UPDATE_ABOUTUS_RESET,
    UPDATE_CONTACTUS_RESET
} from '../constants/userConstants'

export const authReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false,
            }
        case LOGIN_SUCCESS:
        case REGISTER_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload
            }

        case LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated: false,
                user: null
            }

        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload

            }
        case LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload

            }

        case LOGIN_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case CLEAR_ERRORS: {
            return {
                ...state,
                error: null
            }
        }
        default:
            return state

    }
}

export const userReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
                success: action.payload.success,
            }

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: true
            }

        case UPDATE_PROFILE_RESET:
        case UPDATE_PASSWORD_RESET:
        case UPDATE_USER_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_PROFILE_FAIL:
        case UPDATE_PASSWORD_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
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
            return state;
    }
}

export const forgotPasswordReducer = (state = {}, action) => {
    switch (action.type) {

        case FORGOT_PASSWORD_REQUEST:
        case NEW_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload
            }
        case NEW_PASSWORD_SUCCESS:
            return {
                ...state,
                success: action.payload
            }


        case FORGOT_PASSWORD_FAIL:
        case NEW_PASSWORD_FAIL:
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
            return state;
    }
}

export const allUsersReducer = (state = { users: [] }, action) => {
    switch (action.type) {

        case ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload
            }

        case ALL_USERS_FAIL:
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
            return state;
    }
}

export const userDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {

        case USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case USER_DETAILS_SUCCESS:
            return {
                loading: false,
                user: action.payload.user
            }

        case USER_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// export const allCategoryReducer = (state = { category: [] }, action) => {
//     switch (action.type) {

//         case ALL_CATEGORY_REQUEST:
//             return {
//                 ...state,
//                 loading: true,
//             }

//         case ALL_CATEGORY_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 category: action.payload.category
//             }

//         case ALL_CATEGORY_FAIL:
//             return {
//                 ...state,
//                 loading: false,
//                 error: action.payload
//             }

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null
//             }

//         default:
//             return state;
//     }
// }

//Multiple Address  - ADMIN
export const allAddressReducer = (state = { address: [] }, action) => {
    switch (action.type) {

        case ALL_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ALL_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                address: action.payload.address
            }

        case ALL_ADDRESS_FAIL:
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
            return state;
    }
}

//get address by id
export const addressDetailsReducer = (state = { address: {} }, action) => {
    switch (action.type) {
        case ADDRESS_DETAILS_REQUEST:
        case ADD_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ADDRESS_DETAILS_SUCCESS:
        case ADD_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                address: action.payload
            }

        case ADD_ADDRESS_RESET:
            return {
                ...state,
                success: false
            }


        case ADDRESS_DETAILS_FAIL:
        case ADD_ADDRESS_FAIL:

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
            return state;
    }
}

//Address Update
export const addressReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_ADDRESS_SUCCESS:

            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
                success: action.payload.success,
            }

        case DELETE_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_ADDRESS_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_ADDRESS_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_ADDRESS_FAIL:
        case DELETE_ADDRESS_FAIL:

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
            return state;
    }
}


//dAFAULT aDDRESS
export const defaultAddressReducer = (state = {}, action) => {
    switch (action.type) {
        case DEFAULT_ADDRESS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DEFAULT_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                isDefault: action.payload,
            }

        case DEFAULT_ADDRESS_RESET:
            return {
                ...state,
                isDfault: false
            }

        case DEFAULT_ADDRESS_FAIL:
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
            return state;
    }
}

//get verfication code
export const verificationReducer = (state = { data: {} }, action) => {
    switch (action.type) {
        case EMAIL_VERIFICATION_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case EMAIL_VERIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                data: action.payload
            }

        case EMAIL_VERIFICATION_RESET:
            return {
                ...state,
                success: false
            }

        case EMAIL_VERIFICATION_FAIL:
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
            return state;
    }
}



export const sharePromocodeReducer = (state = { data: {} }, action) => {
    switch (action.type) {
        case SHARE_COUPON_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case SHARE_COUPON_SUCCESS:
            return {
                ...state,
                loading: false,
                share: action.payload.success,
                data: action.payload
            }

        case SHARE_COUPON_FAIL:
            return {
                ...state,
                loading: false,
                shareNot: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

//enquiryform
export const enquiryReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_ENQUIRY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case NEW_ENQUIRY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
            }

        case NEW_ENQUIRY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                error: null
            }

        default:
            return state;
    }
}

export const allAboutReducer = (state = { about: [] }, action) => {
    switch (action.type) {

        case GET_ABOUTUS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case GET_ABOUTUS_SUCCESS:
            return {
                ...state,
                loading: false,
                about: action.payload.about
            }

        case GET_ABOUTUS_FAIL:
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
            return state;
    }
}

export const updateAboutReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_ABOUTUS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case UPDATE_ABOUTUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success
            }

        case UPDATE_ABOUTUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case UPDATE_ABOUTUS_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}


export const allContactReducer = (state = { contact: [] }, action) => {
    switch (action.type) {

        case GET_CONTACTUS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case GET_CONTACTUS_SUCCESS:
            return {
                ...state,
                loading: false,
                contact: action.payload.contact
            }

        case GET_CONTACTUS_FAIL:
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
            return state;
    }
}

export const updateContactReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_CONTACTUS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case UPDATE_CONTACTUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success
            }

        case UPDATE_CONTACTUS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case UPDATE_CONTACTUS_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}
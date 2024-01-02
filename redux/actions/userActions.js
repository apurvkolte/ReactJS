import axios from 'axios';

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
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
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
    CLEAR_ERRORS,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
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
    DEFAULT_ADDRESS_REQUEST,
    DEFAULT_ADDRESS_SUCCESS,
    DEFAULT_ADDRESS_FAIL,
    EMAIL_VERIFICATION_REQUEST,
    EMAIL_VERIFICATION_SUCCESS,
    EMAIL_VERIFICATION_FAIL,
    SHARE_COUPON_REQUEST,
    SHARE_COUPON_SUCCESS,
    SHARE_COUPON_FAIL,
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
} from '../constants/userConstants'

//Login
// export const login = (email, password) => async (dispatch) => {
//     console.log("tokentokentoken");
//     try {
//         dispatch({ type: LOGIN_REQUEST })

//         const config = {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }

//         const { data } = await axios.post('/api/v1/login/', { email, password }, config)
//         // console.log("data", data);

//         dispatch({
//             type: LOGIN_SUCCESS,
//             payload: data.user
//         })

//     } catch (error) {
//         dispatch({
//             type: LOGIN_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// Register user
export const register1 = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/user', userData, config)
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

//Emial Verification
export const emailVarification = (userData) => async (dispatch) => {
    try {
        dispatch({ type: EMAIL_VERIFICATION_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/user/confirm', userData, config)
        console.log("data123", data);
        dispatch({
            type: EMAIL_VERIFICATION_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMAIL_VERIFICATION_FAIL,
            payload: error.response.data.message
        })
    }
}

// Load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST })
        const { data } = await axios.get('/api/user')
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update profile
export const updateProfile = (userData) => async (dispatch) => {
    try {
        console.log("userData", userData);
        dispatch({ type: UPDATE_PROFILE_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put("/api/user", userData, config)

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}


// Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put('/api/user/updatePassword', passwords, config)

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/user/forgotPassword', email, config)

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

// Reset  password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PASSWORD_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/user/reset/${token}`, passwords, config)

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}
// Logout user
// export const logout = () => async (dispatch) => {
//     try {

//         await axios.get('/api/v1/logout')

//         dispatch({
//             type: LOGOUT_SUCCESS,
//         })

//     } catch (error) {
//         dispatch({
//             type: LOGOUT_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// Get all user
export const allUsers = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/api/user/all')

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Update user - ADMIN
export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/admin/user/${id}`, userData, config)

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get user details - ADMIN
export const getUserDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/user/${id}`)
        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

//Add address
export const insertAddress = (userData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_ADDRESS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/user/address/', userData, config)
        dispatch({
            type: ADD_ADDRESS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ADD_ADDRESS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update ADDRESS - ADMIN
export const updateAddress = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ADDRESS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/user/address/update/${id}`, userData, config)

        dispatch({
            type: UPDATE_ADDRESS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_ADDRESS_FAIL,
            payload: error.response.data.message
        })
    }
}

//Delete address
export const deleteAddress = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ADDRESS_REQUEST })

        const { data } = await axios.delete(`/api/user/address/${id}`)

        dispatch({
            type: DELETE_ADDRESS_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ADDRESS_FAIL,
            payload: error.response.data.message
        })
    }
}

//Get All Address
export const allAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: ALL_ADDRESS_REQUEST })

        const { data } = await axios.get(`/api/user/address/${id}`)

        dispatch({
            type: ALL_ADDRESS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_ADDRESS_FAIL,
            payload: error.response.data.message
        })
    }
}

//Get address details by ID
//Get All Address
export const getAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: ADDRESS_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/user/address/update/${id}`)

        dispatch({
            type: ADDRESS_DETAILS_SUCCESS,
            payload: data.address
        })

    } catch (error) {
        dispatch({
            type: ADDRESS_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}


//Default address
export const defaultAddress = (id) => async (dispatch) => {
    try {
        dispatch({ type: DEFAULT_ADDRESS_REQUEST })

        const { data } = await axios.get(`/api/user/address/default/${id}`);
        dispatch({
            type: DEFAULT_ADDRESS_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DEFAULT_ADDRESS_FAIL,
            payload: error.response.data.message
        })
    }
}

//share promo code
export const shareCoupons = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: SHARE_COUPON_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post(`/api/admin/coupons/share/${id}`, userData, config)

        dispatch({
            type: SHARE_COUPON_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: SHARE_COUPON_FAIL,
            payload: error.response.data.message
        })
    }
}


// Get About us
export const getAbout = () => async (dispatch) => {
    try {
        dispatch({ type: GET_ABOUTUS_REQUEST })
        const { data } = await axios.get('/api/about')
        dispatch({
            type: GET_ABOUTUS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_ABOUTUS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update About us
export const updateAboutUs = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_ABOUTUS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put('/api/about', userData, config)
        dispatch({
            type: UPDATE_ABOUTUS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_ABOUTUS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get About us
export const getContact = () => async (dispatch) => {
    try {
        dispatch({ type: GET_CONTACTUS_REQUEST })
        const { data } = await axios.get('/api/contact')
        dispatch({
            type: GET_CONTACTUS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_CONTACTUS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update About us
export const updateContactUs = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CONTACTUS_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put('/api/contact', userData, config)
        dispatch({
            type: UPDATE_CONTACTUS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_CONTACTUS_FAIL,
            payload: error.response.data.message
        })
    }
}



//indian state
export const indianState = [
    {
        "key": "AN",
        "name": "Andaman Nicobar Islands"
    },
    {
        "key": "AP",
        "name": "Andhra Pradesh"
    },
    {
        "key": "AR",
        "name": "Arunachal Pradesh"
    },
    {
        "key": "AS",
        "name": "Assam"
    },
    {
        "key": "BR",
        "name": "Bihar"
    },
    {
        "key": "CG",
        "name": "Chandigarh"
    },
    {
        "key": "CH",
        "name": "Chhattisgarh"
    },
    {
        "key": "DH",
        "name": "Dadra Nagar Haveli"
    },
    {
        "key": "DD",
        "name": "Daman Diu"
    },
    {
        "key": "DL",
        "name": "Delhi"
    },
    {
        "key": "GA",
        "name": "Goa"
    },
    {
        "key": "GJ",
        "name": "Gujarat"
    },
    {
        "key": "HR",
        "name": "Haryana"
    },
    {
        "key": "HP",
        "name": "Himachal Pradesh"
    },
    {
        "key": "JK",
        "name": "Jammu Kashmir"
    },
    {
        "key": "JH",
        "name": "Jharkhand"
    },
    {
        "key": "KA",
        "name": "Karnataka"
    },
    {
        "key": "KL",
        "name": "Kerala"
    },
    {
        "key": "LD",
        "name": "Lakshadweep"
    },
    {
        "key": "MP",
        "name": "Madhya Pradesh"
    },
    {
        "key": "MH",
        "name": "Maharashtra"
    },
    {
        "key": "MN",
        "name": "Manipur"
    },
    {
        "key": "ML",
        "name": "Meghalaya"
    },
    {
        "key": "MZ",
        "name": "Mizoram"
    },
    {
        "key": "NL",
        "name": "Nagaland"
    },
    {
        "key": "OR",
        "name": "Odisha"
    },
    {
        "key": "PY",
        "name": "Puducherry"
    },
    {
        "key": "PB",
        "name": "Punjab"
    },
    {
        "key": "RJ",
        "name": "Rajasthan"
    },
    {
        "key": "SK",
        "name": "Sikkim"
    },
    {
        "key": "TN",
        "name": "Tamil Nadu"
    },
    {
        "key": "TS",
        "name": "Telangana"
    },
    {
        "key": "TR",
        "name": "Tripura"
    },
    {
        "key": "UK",
        "name": "Uttar Pradesh"
    },
    {
        "key": "UP",
        "name": "Uttarakhand"
    },
    {
        "key": "WB",
        "name": "West Bengal"
    }
]

//send enquiry

export const newEnquiry = (enquiryData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_ENQUIRY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post(`/api/enquiry`, enquiryData, config)
        dispatch({
            type: NEW_ENQUIRY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_ENQUIRY_FAIL,
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
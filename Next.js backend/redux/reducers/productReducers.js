import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_RESET,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
    RELATED_PRODUCTS_REQUEST,
    RELATED_PRODUCTS_SUCCESS,
    RELATED_PRODUCTS_FAIL,
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAIL,
    ALL_CATEGORY_REQUEST,
    ALL_CATEGORY_SUCCESS,
    ALL_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    DELETE_CATEGORY_FAIL,
    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_RESET,
    UPDATE_CATEGORY_RESET,
    DELETE_CATEGORY_RESET,
    UPDATE_BANNER_REQUEST,
    UPDATE_BANNER_SUCCESS,
    UPDATE_BANNER_FAIL,
    UPDATE_SIDEIMAGE_REQUEST,
    UPDATE_SIDEIMAGE_SUCCESS,
    UPDATE_SIDEIMAGE_FAIL,
    GET_SIDEIMAGE_REQUEST,
    GET_SIDEIMAGE_SUCCESS,
    GET_SIDEIMAGE_FAIL,
    GET_BANNER_REQUEST,
    GET_BANNER_SUCCESS,
    GET_BANNER_FAIL,
    DELETE_BANNER_REQUEST,
    DELETE_BANNER_SUCCESS,
    DELETE_BANNER_FAIL,
    DELETE_SIDEIMAGE_REQUEST,
    DELETE_SIDEIMAGE_SUCCESS,
    DELETE_SIDEIMAGE_FAIL,
    TOP_PRODUCT_REQUEST,
    TOP_PRODUCT_SUCCESS,
    TOP_PRODUCT_FAIL,
    TOP_PRODUCT_RESET,
    LOAD_ALL_PRODUCTS_REQUEST,
    LOAD_ALL_PRODUCTS_SUCCESS,
    LOAD_ALL_PRODUCTS_FAIL,
    CLEAR_ERRORS

} from '../constants/productConstants'

export const productsReducer = (state = { products: [], productsTop: [] }, action) => {
    switch (action.type) {
        case ALL_PRODUCTS_REQUEST:
        case ADMIN_PRODUCTS_REQUEST:
            return {
                loading: true,
                products: [],
                productsTop: [],
            }

        case ALL_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
                productsTop: action.payload.productsTop,

            }
        case ADMIN_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload
            }

        case ALL_PRODUCTS_FAIL:
        case ADMIN_PRODUCTS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS: {
            return {
                ...state,
                error: null
            }
        }
        default:
            return state;
    }
}

export const productReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_PRODUCT_REQUEST:
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                isUpdated: action.payload
            }

        case DELETE_PRODUCT_FAIL:
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_PRODUCT_RESET:
            return {
                ...state,
                isUpdated: false
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

export const productDetailsReducer = (state = { product: {}, relatedProduct: [], productProperties: [] }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                product: action.payload.product,
                relatedProduct: action.payload.relatedProduct,
                productProperties: action.payload.productProperties
            }

        case PRODUCT_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS: {
            return {
                ...state,
                error: null
            }
        }
        default:
            return state;
    }
}

export const newReviewReducer = (state = {}, action) => {
    switch (action.type) {

        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload
            }

        case NEW_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case NEW_REVIEW_RESET:
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
            return state
    }
}

export const newProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product
            }

        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case NEW_PRODUCT_RESET:
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
            return state
    }
}

export const productReviewsReducer = (state = { review: [] }, action) => {
    switch (action.type) {

        case GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case GET_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload
            }

        case GET_REVIEWS_FAIL:
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
            return state
    }
}

export const reviewReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_REVIEW_REQUEST:
            return {
                ...state,
                loading: true
            }

        case DELETE_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case DELETE_REVIEW_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case DELETE_REVIEW_RESET:
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

export const productsRelatedReducer = (state = { productsRelated: [] }, action) => {
    switch (action.type) {
        case RELATED_PRODUCTS_REQUEST:
            return {
                loading: true,
                productsRelated: []
            }

        case RELATED_PRODUCTS_SUCCESS:
            return {
                loading: false,
                productsRelated: action.payload.products,
            }

        case RELATED_PRODUCTS_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS: {
            return {
                ...state,
                error: null
            }
        }

        default:
            return state;
    }
}

export const categoryReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_CATEGORY_REQUEST:
        case DELETE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload,
                success: action.payload.success,
            }

        case DELETE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_CATEGORY_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case DELETE_CATEGORY_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_CATEGORY_FAIL:
        case DELETE_CATEGORY_FAIL:
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

export const allCategoryReducer = (state = { category: [] }, action) => {
    switch (action.type) {

        case ALL_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ALL_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                category: action.payload.category
            }

        case ALL_CATEGORY_FAIL:
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


export const newCategoryReducer = (state = { category: {} }, action) => {
    switch (action.type) {
        case CREATE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CREATE_CATEGORY_SUCCESS:
            return {
                loading: false,
                category: action.payload.category,
                success: action.payload.success
            }

        case CREATE_CATEGORY_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CREATE_CATEGORY_RESET:
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
            return state
    }
}

// export const userSideImage = (state = {}, action) => {
//     switch (action.type) {
//         case UPDATE_SIDEIMAGE_REQUEST:
//             return {
//                 ...state,
//                 loading: true
//             }

//         case UPDATE_SIDEIMAGE_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 isUpdated: action.payload,
//                 success: action.payload.success,
//             }

//         case DELETE_USER_SUCCESS:
//             return {
//                 ...state,
//                 loading: false,
//                 isDeleted: true
//             }

//         case UPDATE_PROFILE_RESET:
//         case UPDATE_PASSWORD_RESET:
//         case UPDATE_USER_RESET:
//             return {
//                 ...state,
//                 isUpdated: false
//             }

//         case DELETE_USER_RESET:
//             return {
//                 ...state,
//                 isDeleted: false
//             }

//         case UPDATE_PROFILE_FAIL:
//         case UPDATE_PASSWORD_FAIL:
//         case UPDATE_USER_FAIL:
//         case DELETE_USER_FAIL:
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

export const sideImageReduser = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_SIDEIMAGE_REQUEST:
        case UPDATE_BANNER_REQUEST:
        case DELETE_BANNER_REQUEST:
        case DELETE_SIDEIMAGE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_SIDEIMAGE_SUCCESS:
        case UPDATE_BANNER_SUCCESS:
        case DELETE_BANNER_SUCCESS:
        case DELETE_SIDEIMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success
            }

        case UPDATE_SIDEIMAGE_FAIL:
        case UPDATE_BANNER_FAIL:
        case DELETE_BANNER_FAIL:
        case DELETE_SIDEIMAGE_FAIL:
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

export const allSideImageReducer = (state = { sideImages: [] }, action) => {
    switch (action.type) {

        case GET_SIDEIMAGE_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case GET_SIDEIMAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                sideImages: action.payload.sideImages
            }

        case GET_SIDEIMAGE_FAIL:
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

export const allSiderImageReducer = (state = { siderImages: [] }, action) => {
    switch (action.type) {

        case GET_BANNER_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case GET_BANNER_SUCCESS:
            return {
                ...state,
                loading: false,
                siderImages: action.payload.siderImages
            }

        case GET_BANNER_FAIL:
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


//Top product reducer
export const topProductsReducer = (state = {}, action) => {
    switch (action.type) {
        case TOP_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case TOP_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                isTop: action.payload,
            }

        case TOP_PRODUCT_RESET:
            return {
                ...state,
                isTop: false
            }

        case TOP_PRODUCT_FAIL:
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

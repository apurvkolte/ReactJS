import axios from 'axios';

import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_FAIL,
    RELATED_PRODUCTS_REQUEST,
    RELATED_PRODUCTS_SUCCESS,
    RELATED_PRODUCTS_FAIL,
    CLEAR_ERRORS,
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
    UPDATE_BANNER_REQUEST,
    UPDATE_BANNER_SUCCESS,
    UPDATE_BANNER_FAIL,
    UPDATE_SIDEIMAGE_REQUEST,
    UPDATE_SIDEIMAGE_SUCCESS,
    UPDATE_SIDEIMAGE_FAIL,
    GET_SIDEIMAGE_REQUEST,
    GET_SIDEIMAGE_SUCCESS,
    GET_SIDEIMAGE_FAIL,
    UPDATE_STOCK_REQUEST,
    UPDATE_STOCK_SUCCESS,
    UPDATE_STOCK_FAIL,
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
    LOAD_ALL_PRODUCTS_REQUEST,
    LOAD_ALL_PRODUCTS_SUCCESS,
    LOAD_ALL_PRODUCTS_FAIL
} from '../constants/productConstants'

export const getProducts = (keyword = '', currentPage = 1, discountPrice, category, rating = 0, sort) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST })

        let link = `/api/products`
        // if (category) {
        //     link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&discountPrice[lte]=${discountPrice[1]}&discountPrice[gte]=${discountPrice[0]}&category=${encodeURIComponent(category)}&ratings[gte]=${rating}&sort=${sort}`
        // }
        const { data } = await axios.get(link)
        // console.log("ALL DATA ARE :", data);
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}
export const newProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`/api/admin/products`, productData, config)
        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/product-details/${id}`);
        // console.log("first,", data);
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/review`, reviewData, config)
        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST })
        const { data } = await axios.get(`/api/admin/products`)
        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products
        })
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response.data.message
        })
    }
}

/// Delete product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST })
        const { data } = await axios.delete(`/api/admin/products/${id}`)
        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update Product (ADMIN)
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.put(`/api/admin/products/${id}`, productData, config)
        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Product reviews (ADMIN)
export const getProductReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_REVIEWS_REQUEST })
        const { data } = await axios.get(`/api/review/${id}`)
        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}


// Product reviews (user product)
export const getProductReviews1 = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_REVIEWS_REQUEST })
        const { data } = await axios.get(`/api/review/${id}`)
        dispatch({
            type: GET_REVIEWS_SUCCESS,
            payload: data.reviews
        })
    } catch (error) {
        dispatch({
            type: GET_REVIEWS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete product review
export const deleteReview = (id, productId) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_REVIEW_REQUEST })
        const { data } = await axios.delete(`/api/review?id=${id}&productId=${productId}`)
        dispatch({
            type: DELETE_REVIEW_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        console.log(error.response);
        dispatch({
            type: DELETE_REVIEW_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getDiscount = (price, discount) => {
    const discountPrice = (price - ((discount / 100.0) * price));
    return discountPrice
}

export const getGstAmount = (price, gst) => {
    const gstPrice = (price + ((gst / 100.0) * price));
    return gstPrice
}

export const getDiscountUI = (price, discount) => {
    const discountPrice = (price * 100) / (100 - discount);
    return discountPrice
}

export const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
});

// export const getRelatedProducts = (category) => async (dispatch) => {
//     try {
//         dispatch({ type: RELATED_PRODUCTS_REQUEST })
//         // var link = `/api/v1/products?category=${category}`;
//         // var cat = category.replace(/&/g, "\%26");
//         const link = `/api/products/category/category=${encodeURIComponent(category)}`
//         const { data } = await axios.get(link);
//         // console.log("ALL DATAsddwd ARE :", data);
//         dispatch({
//             type: RELATED_PRODUCTS_SUCCESS,
//             payload: data
//         })
//     } catch (error) {
//         dispatch({
//             type: RELATED_PRODUCTS_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// Get all category
export const allCategory = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_CATEGORY_REQUEST })
        const { data } = await axios.get('/api/category');
        dispatch({
            type: ALL_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

//create category - ADMIN
// Register user
export const addCategory = (userData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_CATEGORY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post('/api/category', userData, config)
        dispatch({
            type: CREATE_CATEGORY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CREATE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update category - ADMIN
export const updateCategory = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CATEGORY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.put(`/api/category/${id}`, userData, config)

        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

// Delete category - ADMIN
export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CATEGORY_REQUEST })
        const { data } = await axios.delete(`/api/category/${id}`)
        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

// Update banner
export const updateBanner = (id, userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_BANNER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.put(`/api/admin/banner/${id}`, userData, config)

        dispatch({
            type: UPDATE_BANNER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_BANNER_FAIL,
            payload: error.response.data.message
        })
    }
}

// export const updateBannerSideImage = (id, userData) => async (dispatch) => {
//     try {
//         dispatch({ type: UPDATE_SIDEIMAGE_REQUEST })

//         const config = {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         }

//         const { data } = await axios.put(`/api/v1/update/side/images/${id}`, userData, config)

//         dispatch({
//             type: UPDATE_SIDEIMAGE_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: UPDATE_SIDEIMAGE_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// // Get Side images
// export const getSideImage = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_SIDEIMAGE_REQUEST })
//         const { data } = await axios.get('/api/v1/update/side/images/get');
//         dispatch({
//             type: GET_SIDEIMAGE_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: GET_SIDEIMAGE_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// // Get Sider images
// export const getSiderImage = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_BANNER_REQUEST })
//         const { data } = await axios.get('/api/v1/update/sider/images/get');
//         dispatch({
//             type: GET_BANNER_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: GET_BANNER_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }


// Update stock after close checkout page
export const updateStock = (userData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_STOCK_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/checkout`, userData, config)

        dispatch({
            type: UPDATE_STOCK_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_STOCK_FAIL,
            payload: error.response.data.message
        })
    }
}

// // Delete deleteSideImage 
// export const deleteBannerImage = (id) => async (dispatch) => {
//     try {
//         dispatch({ type: DELETE_BANNER_REQUEST })
//         const { data } = await axios.delete(`/api/v1/delete/banner/${id}`)
//         dispatch({
//             type: DELETE_BANNER_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: DELETE_BANNER_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

// // Delete deleteSideImage
// export const deleteSideImage = (id) => async (dispatch) => {
//     try {
//         dispatch({ type: DELETE_SIDEIMAGE_REQUEST })
//         const { data } = await axios.delete(`/api/v1/delete/side/images/${id}`)
//         dispatch({
//             type: DELETE_SIDEIMAGE_SUCCESS,
//             payload: data
//         })

//     } catch (error) {
//         dispatch({
//             type: DELETE_SIDEIMAGE_FAIL,
//             payload: error.response.data.message
//         })
//     }
// }

//View Product on Top
export const topProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: TOP_PRODUCT_REQUEST })

        const { data } = await axios.get(`/api/admin/products/top/${id}`);
        dispatch({
            type: TOP_PRODUCT_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: TOP_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get Sider images
export const getSiderImage = () => async (dispatch) => {
    try {
        dispatch({ type: GET_BANNER_REQUEST })
        const { data } = await axios.get('/api/admin/banner');
        dispatch({
            type: GET_BANNER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: GET_BANNER_FAIL,
            payload: error.response.data.message
        })
    }
}


//FILTER
export const filtersAction = (products, productImages, minPrice, maxPrice, dispatch) => {
    dispatch({
        type: 'LOAD_ALL_PRODUCTS',
        payload: { products, productImages, minPrice, maxPrice }
    });
}

//FILTER Updated
export const updateProductFilters = (updatedProducts, dispatch) => {
    dispatch({
        type: 'FILTERED_PRODUCTS',
        payload: { updatedProducts }
    });
}



// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}
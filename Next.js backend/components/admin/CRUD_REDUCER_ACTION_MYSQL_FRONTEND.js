// 1) orderConstant
export const ALL_COUPON_REQUEST = 'ALL_COUPON_REQUEST'
export const ALL_COUPON_SUCCESS = 'ALL_COUPON_SUCCESS'
export const ALL_COUPON_FAIL = 'ALL_COUPON_FAIL'

export const CREATE_COUPON_REQUEST = 'CREATE_COUPON_REQUEST'
export const CREATE_COUPON_SUCCESS = 'CREATE_COUPON_SUCCESS'
export const CREATE_COUPON_RESET = 'CREATE_COUPON_RESET'
export const CREATE_COUPON_FAIL = 'CREATE_COUPON_FAIL'

export const DELETE_COUPON_REQUEST = 'DELETE_COUPON_REQUEST'
export const DELETE_COUPON_SUCCESS = 'DELETE_COUPON_SUCCESS'
export const DELETE_COUPON_FAIL = 'DELETE_ORDER_FAIL'
export const DELETE_COUPON_RESET = 'DELETE_COUPON_RESET'

export const UPDATE_COUPON_REQUEST = 'UPDATE_COUPON_REQUEST'
export const UPDATE_COUPON_SUCCESS = 'UPDATE_COUPON_SUCCESS'
export const UPDATE_COUPON_RESET = 'UPDATE_COUPON_RESET'
export const UPDATE_COUPON_FAIL = 'UPDATE_COUPON_FAIL'

export const COUPON_DETAILS_REQUEST = 'COUPON_DETAILS_REQUEST'
export const COUPON_DETAILS_SUCCESS = 'COUPON_DETAILS_SUCCESS'
export const COUPON_DETAILS_FAIL = 'COUPON_DETAILS_FAIL'

export const CLEAR_ERRORS = 'CLEAR_ERRORS'

// ----------------------------------------------------------------------------

// 2) orderReducer

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

// ---------------------------------------------------------------------------------------------------

// 3) orderAction

//coupon
export const createCoupon = (coupon) => async (dispatch, getState) => {
    try {
        dispatch({ type: CREATE_COUPON_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.post('/api/v1/admin/coupon/new', coupon, config)
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
        const { data } = await axios.get(`/api/v1/admin/coupons/${id}`)
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

        const { data } = await axios.get(`/api/v1/admin/coupons`)

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

        const { data } = await axios.put(`/api/v1/admin/coupon/${id}`, orderData, config)

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

        const { data } = await axios.delete(`/api/v1/admin/coupon/${id}`)

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

//Clear Error
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })

}






// --------------------------------------------------------------------------------------
//backend
// Rounte order.js


const express = require('express');
const fileUpload = require('express-fileupload');
const router = express.Router();


const { allCoupons, createCoupon, deleteCoupon, getCouponDetails, updateCoupon } = require('../controllers/orderController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')



router.route('/admin/coupons').get(isAuthenticatedUser, authorizeRoles('admin'), allCoupons);
router.route('/admin/coupons/:id').get(isAuthenticatedUser, getCouponDetails);
router.route('/admin/coupon/new').post(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), createCoupon);
router.route('/admin/coupon/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteCoupon)
    .put(isAuthenticatedUser, authorizeRoles('admin'), fileUpload(), updateCoupon);

module.exports = router;

// ------------------------------------------------------------------------------------------
//orderController.js


// Create a new coupon   =>  /api/v1/coupon/new
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    var coupon_code = req.body.coupon;
    var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var expired = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var cashback = req.body.cashback;
    var minValue = req.body.minValue;
    var description = req.body.description.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`");

    const sql = `insert into coupon(id, user_id, coupon_code, date, expired, cashback, minValue, description, order_id) 
    values(Null,${req.user.id},'${coupon_code}','${date}','${expired}', ${cashback}, ${minValue}, '${description}', 0);`;

    //  console.log("sql",sql);

    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql);

        } catch (err) {
            console.log(err.message);
            return next(new ErrorHandler(err.message));
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log("New coupon code is not created :-", error.message)
        });
})


// Get all coupon - ADMIN  =>   /api/v1/admin/coupon/new
exports.allCoupons = catchAsyncErrors(async (req, res, next) => {
    var coupons;
    const sql = `select * from coupon;`;
    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql);
            coupons = rows;
            // console.log("rows", rows);
            if (!rows.length) {
                return next(new ErrorHandler('No Coupon code found ', 404))
            }
        } catch (err) {
            console.log(err.message);
            return next(new ErrorHandler('No coupon found', 404))
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                coupons
            })
        }).catch(error => {
            console.log("No coupon found with this ID:-", error.message)
        });
})


// Delete coupon   =>   /api/v1/admin/coupon/:id
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const sql = `delete from coupon where id=${req.params.id};`;
    const sql1 = "ALTER TABLE orders AUTO_INCREMENT=1;";
    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql);
            const rows1 = await query(sql1);
            if (!rows.affectedRows) {
                res.status(404).send({ status: 1, message: "No Coupon found with this ID" });
            }
        } catch (err) {
            console.log(err.message);
            res.status(404).send({ status: 1, message: "No Coupon found with this ID" });
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true
            })
        }).catch(error => {
            console.log("Coupon is not deleted :-", error.message)
        });
})

// Get single coupon   =>   /api/v1/admin/coupons/:id
exports.getCouponDetails = catchAsyncErrors(async (req, res, next) => {
    var coupon;
    const sql = `select * from coupon where id=${req.params.id};`;
    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql);
            if (!rows.length) {
                return next(new ErrorHandler('No coupon found with this ID', 404))
            }
            coupon = rows[0];

        } catch (err) {
            console.log(err.message);
            return next(new ErrorHandler('No coupon found with this ID', 404))
        } finally {
            return coupon;
        }
    }
    result()
        .then(value => {
            res.status(200).json({
                success: true,
                coupon
            })
        }).catch(error => {
            console.log("No Order found with this ID:-", error.message)
        });
})


//update coupon  =>   /api/v1/admin/coupon/:id
exports.updateCoupon = catchAsyncErrors(async (req, res, next) => {
    var coupon;
    req.body.description = req.body.description
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/`/g, "\\`");

    const sql = `update coupon set ?  where id =${req.params.id}`;

    const query = util.promisify(connection.query).bind(connection);
    let result = async function () {
        try {
            const rows = await query(sql, [req.body]);
            coupon = rows;

            if (!rows.affectedRows) {
                return next(new ErrorHandler("Coupons is not updated", 404));
            }
        } catch (err) {
            console.log(err);
            return next(new ErrorHandler(err.message, 404));
        }
    };
    result()
        .then((value) => {
            res.status(200).json({
                success: true,
            });
        })
        .catch((error) => {
            console.log("The Coupons is not updated", error.message);
        });
});









///frontend UpdateCoupon.js
import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { getCouponDetails, updateCoupon, clearErrors } from '../../actions/orderActions'
import { UPDATE_COUPON_RESET } from '../../constants/orderConstants'
import { useForm } from "react-hook-form";

const UpdateCoupon = ({ match, history }) => {
    const [description, setDescription] = useState('');
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { error, isUpdated, success } = useSelector((state) => state.couponDelete);
    const { coupon } = useSelector((state) => state.couponDetails);
    const couponId = match.params.id;

    useEffect(() => {
        if (coupon && coupon.id !== couponId) {
            dispatch(getCouponDetails(couponId));

            setDescription(coupon.description);
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success || isUpdated) {
            alert.success("Coupon updatedd successfully");
            history.push("/admin/couponAll");
            dispatch({ type: UPDATE_COUPON_RESET });
        }
    }, [dispatch, couponId, alert, coupon.id, success, history, isUpdated, error])

    const submitHandler = (data, e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("description", description);

        dispatch(updateCoupon(formData));
        reset();
    }

    return (
        <Fragment>
            <MetaData title={'Update Product'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form
                                className="shadow-lg"
                                onSubmit={handleSubmit(submitHandler)}
                                enctype="multipart/form-data"
                            >

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className="form-control"
                                        name='name'
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        name='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mobile_field">Mobile</label>
                                    <input
                                        type="text"
                                        id="mobile_field"
                                        className="form-control"
                                        name='mobile'
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description_field">Description</label>
                                    <textarea
                                        name="description_field"
                                        className="form-control"
                                        id="description_field"
                                        rows="2"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="cashback_field">
                                        Cashback (RS)
                                    </label>
                                    <input
                                        type="text"
                                        id="cashback_field"
                                        name="cashback_field"
                                        className={`form-control ${errors.cashback_field && "invalid"}`}
                                        {...register("cashback_field", {
                                            required: "Price is Required",
                                            min: {
                                                value: 10,
                                                message: "Minimum Cashback Required Price is 10 ",
                                            },
                                            max: {
                                                value: 3500,
                                                message: "Maximum Cashback allowed Price is 3500",
                                            },
                                            pattern: {
                                                value: /^[0-9]*$/,
                                                message: "Only numbers are allowed",
                                            },
                                        })}
                                        oninvalid={() => {
                                            trigger("cashback_field");
                                        }}
                                        value={cashback}
                                        onChange={(e) => setCashback(e.target.value)}
                                    />
                                    {errors.cashback_field && (
                                        <small className="text-danger">
                                            {errors.cashback_field.message}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category_field">Category</label>
                                    <select className="form-control" id="category_field" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}>
                                        {category.map(cat => (
                                            <option key={cat.category} value={cat.category} required>{cat.category}</option>
                                        ))}

                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="expired_field">Expiry Date</label>
                                    <input
                                        type="date"
                                        id="expired_field"
                                        className="form-control"
                                        value={lastDate}
                                        onChange={(e) => setLastDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                // disabled={"loading" ? true : false}
                                >
                                    CREATE CODE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default UpdateCoupon



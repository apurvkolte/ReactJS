import React, { Fragment, useState, useEffect, useMemo } from 'react'
import MetaData from '../layout/MetaData'
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons, createCoupon, clearErrors } from "../../redux/actions/orderActions";
import { CREATE_COUPON_RESET } from "../../redux/constants/orderConstants";
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
var voucher_codes = require('voucher-code-generator');

const ApplyCoupon = ({ history }) => {
    const router = useRouter()
    const [pre, setPre] = useState('');
    const [post, setPost] = useState('');
    const [coupon_code, setCoupon_code] = useState();  //straing value get
    const [cashback, setCashback] = useState();
    const [minValue, setMinValue] = useState();
    const [lastDate, setLastDate] = useState('');
    const [description, setDescription] = useState('');
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();
    const dispatch = useDispatch();
    const { error, success } = useSelector((state) => state.newCoupon);
    const { coupons } = useSelector(state => state.allCoupons);


    useEffect(() => {
        dispatch(getAllCoupons());
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success) {
            router.push("/admin/coupons");
            toast.success("Coupon created successfully");
            dispatch({ type: CREATE_COUPON_RESET });
            setPre('');
            setPost('');
            setCoupon_code()
            setDescription('');
            setCashback();
            setLastDate();
            setMinValue();

        }
    }, [dispatch, toast, error, success, history]);

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    const submitHandler = (data, e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("coupon_code", coupon_code);
        formData.set("description", description);
        formData.set("cashback", cashback);
        formData.set("minValue", minValue);
        formData.set("lastDate", lastDate);

        // console.log("coupon", coupon);
        // console.log("description", description);
        // console.log("cashback", cashback);
        // console.log("minValue", minValue);
        // console.log("lastDate", lastDate);

        dispatch(createCoupon(formData));
        reset();
    }

    const generateCoupon = () => {
        if (pre === '' && post === '') {
            setPre('SGSRO ');
            setPost(`${new Date().getFullYear()}`);
            const wow = voucher_codes.generate({
                prefix: "SGSRO -".toUpperCase(),
                postfix: `-${new Date().getFullYear()}`.toUpperCase(),
                length: 4,
                // charset: "0123456789"
                charset: voucher_codes.charset("alphabetic")
            });
            coupons && coupons.map((coupon) => {
                if (coupon.coupon_code === wow[0]) {
                    toast.error("Coupon is already created. Please create again");
                } else {
                    setCoupon_code(wow[0]);
                }
            })
            // console.log("Wow", wow[0]);
        }
        if (pre || post) {
            let p1 = pre;
            let p2 = post;
            if (p1) {
                p1 = pre.toUpperCase() + '-';
            }
            if (p2) {
                p2 = '-' + post.toUpperCase()
            }
            const wow = voucher_codes.generate({
                prefix: p1,
                postfix: p2,
                length: 4,
                // charset: "0123456789"
                charset: voucher_codes.charset("alphabetic")
            });
            setCoupon_code(wow[0]);
        }
    }

    return (
        <Fragment>
            <MetaData title={'Apply Coupons'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="row wrapper my-5">
                            <form
                                className="shadow-lg p-5"
                                onSubmit={handleSubmit(submitHandler)}
                                enctype="multipart/form-data"
                            >
                                <h1 className="mt-2 mb-5 heading">New Promo Code</h1>
                                <div className="row">
                                    <div className="col-md-3 ">
                                        <div className="form-group">
                                            <label htmlFor="name_field">Pre-Promo Code</label>
                                            <input
                                                type="text"
                                                id="name_field"
                                                name="name"
                                                className='form-control'
                                                value={pre}
                                                onChange={(e) => setPre(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="discount_field">
                                                Post-Promo Code
                                            </label>
                                            <input
                                                type="text"
                                                id="discount_field"
                                                name="discount_field"
                                                className="form-control"
                                                value={post}
                                                onChange={(e) => setPost(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-3 d-flex justify-content-center">
                                        <div className="form-group d-grid gap-2 d-md-flex justify-content-md-end">
                                            <input className='btn btn-primary my-0 float-right me-md-2   px-4 text-white' type="button" onClick={generateCoupon} value="Generate Promo Code" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="coupon_field">Promo Code</label>
                                    <input
                                        type="text"
                                        id="coupon_field"
                                        name="coupon_field"
                                        className={`form-control ${errors.coupon_field && "invalid"}`}
                                        {...register("coupon_field", {
                                            minLength: {
                                                value: 4,
                                                message: "Coupon length should not be less than 4",
                                            },
                                            maxLength: {
                                                value: 17,
                                                message: "The length of coupon code should not be more than 17 characters",
                                            }
                                        })}
                                        oninvalid={() => {
                                            trigger("coupon_field");
                                        }}
                                        value={coupon_code}
                                        onChange={(e) => setCoupon_code(e.target.value)}
                                        required
                                    />
                                    {errors.coupon_field && (
                                        <small className="text-danger">{errors.coupon_field.message}</small>
                                    )}
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
                                            required: "Cashback Price is Required",
                                            min: {
                                                value: 10,
                                                message: "Minimum Cashback Required Price is 10 ",
                                            },
                                            max: {
                                                value: 4000,
                                                message: "Maximum Cashback allowed Price is 4000",
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
                                    <label htmlFor="minvalue_field">
                                        Minimum Product Value
                                    </label>
                                    <input
                                        type="text"
                                        id="minvalue_field"
                                        name="minvalue_field"
                                        className="form-control"
                                        value={minValue}
                                        onChange={(e) => setMinValue(e.target.value)}
                                    />
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

                                <div className="d-flex justify-content-center">
                                    <button
                                        id="login_button"
                                        type="submit"
                                        className="btn btn-primary btn-block py-3"
                                    // disabled={"loading" ? true : false}
                                    >
                                        CREATE CODE
                                    </button>
                                </div>
                            </form>
                        </div>

                    </Fragment>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}


export default ApplyCoupon

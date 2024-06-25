import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form";
import { newEnquiry, clearErrors } from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Enquiry1 = () => {
    const { register, handleSubmit, formState: { errors }, reset, trigger, } = useForm();
    const dispatch = useDispatch();
    const router = useRouter()
    const toast = usetoast();
    const location = useLocation();
    const [name, setName] = useState();
    const [mobile, setMobile] = useState();
    const [email, setEmail] = useState();
    const [message, setMessage] = useState();
    const { success } = useSelector(state => state.enquiry);
    const productName = location.state ? location.state.productName : ""
    const qty = location.state ? location.state.quantity : ""
    const [pName, setPName] = useState(productName);
    const [quantity, setQuantity] = useState(qty);

    useEffect(() => {
        if (success) {
            router.push('/')
            toast.success('Request has been send successfully');
        }
        dispatch(clearErrors())

    }, [dispatch, success, toast, router.push])


    function restefiled() {
        setName("")
        setMobile()
        setEmail("")
        setMessage("")
        setPName("")
        setQuantity("")
    }
    function submit(data, e) {
        e.preventDefault();
        const formData = new FormData();
        formData.set("name", name);
        formData.set("mobile", mobile);
        formData.set("email", email);
        formData.set("pName", pName);
        formData.set("quantity", quantity);
        formData.set("message", message);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object

        dispatch(newEnquiry(json));
        reset();
    }

    return (
        <Fragment >
            <MetaData title={"Bulk Order Enquriy Form"} />
            <div className="bg-enquiry">
                <div className="row wrapper py-5">
                    <div className="col-10 col-lg-6">
                        <form className="shadow-lg bg-white" onSubmit={handleSubmit(submit)}>
                            <h4 className="mb-4 heading">BULK ORDER ENQUIRY FORM</h4>

                            <div className="row enquiryForm">
                                <div className="col-md-5 form-group">
                                    <label>Customer  Name:-</label>
                                    <input name="Name" type="text" className="form-control in-from" id="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name:" />
                                </div>
                                <div className="col-md-7 form-group">
                                    <label>Contact No:-</label>
                                    <input type="text" name="Mobile" id="mobile"
                                        className={`form-control ${errors.mobile && "invalid"}`}
                                        {...register("mobile", {
                                            required: "Please Enter Mobile Number",
                                            pattern: {
                                                value: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/g,
                                                message: "Invalid Mobile Number",
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Invalid Mobile Number",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("mobile");
                                        }}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        placeholder="Mobile:"
                                    />
                                    {errors.mobile && (
                                        <small className="text-danger">{errors.mobile.message}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row enquiryForm">
                                <div className="col-md-7 form-group">
                                    <label>Email ID:-</label>
                                    <input type="text" name="Email" id="email"
                                        className={`form-control ${errors.email_field && "invalid"}`}
                                        {...register("email", {
                                            required: "Please Enter Your Email ID",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid Email ID",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("email");
                                        }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email:" />
                                    {errors.email && (
                                        <small className="text-danger">{errors.email.message}</small>
                                    )}
                                </div>

                                <div className="col-md-5 form-group">
                                    <label>Product Quantity</label>
                                    <input type="number" name="qty" id="qty"
                                        className="form-control"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Product Quantity:" />
                                </div>
                            </div>

                            <div className="row enquiryForm">
                                <div className="col form-group">
                                    <label>Product Name:-</label>
                                    <input type="text" name="pname" id="pname"
                                        className="form-control"
                                        value={pName}
                                        onChange={(e) => setPName(e.target.value)}
                                        placeholder="Product Name:" />
                                </div>
                            </div>

                            <div className="row enquiryForm">
                                <div className="col form-group" >
                                    <label>Message</label>
                                    <textarea name="Address" id="message" rows="2"
                                        className={`form-control ${errors.message && "invalid"}`}
                                        {...register("message", {
                                            required: "Message is Required",
                                            minLength: {
                                                value: 5,
                                                message: "Minimum Required Length Should Be 5",
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: "Maximum Required Length Should Be 500 ",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("message");
                                        }}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Message : "></textarea>
                                    {errors.message && (
                                        <small className="text-danger">{errors.message.message}</small>
                                    )}
                                </div>
                            </div>
                            <div className="row ">
                                <button type="submit" className="btn btn-danger in-from ml-3" >Submit</button>
                                <button type="reset" onClick={restefiled} className="btn btn-danger in-from ml-3" >Reset&nbsp;</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Fragment >
    )
}

export default Enquiry1
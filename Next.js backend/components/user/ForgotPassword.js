import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../redux/actions/userActions'

const ForgotPassword = () => {
    const [email, setEmail] = useState()

    const dispatch = useDispatch();

    const { error, loading, message } = useSelector(state => state.forgotPassword)
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();

    useEffect(() => {

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (message) {
            toast.success(message)
        }

    }, [dispatch, toast, error, message])

    const submitHandler = (data, e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('email', email);
        dispatch(forgotPassword(formData));
        reset();
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />
            <div className="wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onClick={handleSubmit(submitHandler)} style={{ padding: "20px", borderRadius: "8px" }}>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className={`form-control ${errors.email_field && "invalid"}`}
                                {...register("email_field", {
                                    required: "Please enter your Email ID",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid Email ID",
                                    }
                                })}
                                onKeyUp={() => {
                                    trigger("email_field");
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email_field && (
                                <small className="text-danger">{errors.email_field.message}</small>
                            )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                id="forgot_password_button"
                                type="submit"
                                className="btn btn-primary py-3"
                                disabled={loading ? true : false}>
                                Send Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </Fragment>
    )
}

export default ForgotPassword

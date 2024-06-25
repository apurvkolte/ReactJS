import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../redux/actions/userActions'


const EmailVerification = ({ formData }) => {
    console.log("formData", formData);
    const [email, setEmail] = useState('')
    const dispatch = useDispatch();

    // const { error, loading, message } = useSelector(state => state.forgotPassword)

    useEffect(() => {

        // if (error) {
        //     toast.error(error);
        //     dispatch(clearErrors());
        // }

        // if (message) {
        //     toast.success(message)
        // }

    }, [dispatch])

    const submitHandler = (e) => {
        e.preventDefault();
        // const formData = new FormData();
        // formData.set('email', email);

        // dispatch(forgotPassword(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onClick={submitHandler}>
                        <h1 className="mb-3">Getting a verification code send to your email</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Verification Code</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                        // disabled={loading ? true : false}
                        >
                            Send Email
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default EmailVerification

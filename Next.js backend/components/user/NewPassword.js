import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { signIn, useSession } from "next-auth/react";
import { resetPassword, clearErrors } from '../../redux/actions/userActions'

const NewPassword = () => {
    const { data: session } = useSession();
    const router = useRouter()
    const token = router.query.token;
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useDispatch();
    const { error, success, email } = useSelector(state => state.forgotPassword)

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (success && email && !session) {
            toast.success('Password updated successfully')
            login(email);
        }

    }, [dispatch, router, toast, email, error, success])

    const login = async (email) => {
        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password
        })

        if (result.error) {
            toast.error(result.error);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(token, formData))
    }

    return (
        <Fragment>
            <MetaData title={'New Password Reset'} />
            <div className="wrapper" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg p-3" onSubmit={submitHandler}>
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                                id="new_password_button"
                                type="submit"
                                className="btn btn-primary py-3">
                                Set Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </Fragment>
    )
}

export default NewPassword

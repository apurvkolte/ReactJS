
import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { updatePassword, clearErrors } from '../../redux/actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../redux/constants/userConstants'
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

const UpdatePassword = () => {
    const router = useRouter()
    const [oldPassword, setOldPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    //const { data: session } = useSession();




    const dispatch = useDispatch();

    const { error, isUpdated, loading } = useSelector(state => state.user)
    const { register, handleSubmit, formState: { errors }, reset, trigger, watch } = useForm();

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('User updated successfully')
            router.push('/my-profile', { replace: true });
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }

    }, [dispatch, router.push, toast, error, isUpdated])

    const submitHandler = (data, e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        dispatch(updatePassword(formData));
        reset();
    }

    return (
        <Fragment>
            <MetaData title={'Change Password'} />
            <div className="row wrapper1">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg p-5" onSubmit={handleSubmit(submitHandler)}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label for="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                name='old_password'
                                className={`form-control ${errors.old_password && "invalid"}`}
                                {...register("old_password", {
                                    required: "Old Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must have at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Password cantnot contain more than 50 characters",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("old_password");
                                }}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            {errors.old_password && (
                                <small className="text-danger">{errors.old_password.message}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label for="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                name='password'
                                className={`form-control ${errors.password && "invalid"}`}
                                {...register("password", {
                                    required: "Password is Required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must have at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Password cantnot contain more than 50 characters",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("password");
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {errors.password && (
                                <small className="text-danger">{errors.password.message}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label for="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                name='confirm_password'
                                className={`form-control ${errors.confirm_password && "invalid"}`}
                                {...register("confirm_password", {
                                    required: "Password is Required",
                                    validate: () => {
                                        if (watch('confirm_password') !== password) {
                                            return "Your passwords do not match";
                                        }
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Password must have at least 8 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Password cantnot contain more than 50 characters",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("confirm_password");
                                }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {errors.confirm_password && (
                                <small className="text-danger">{errors.confirm_password.message}</small>
                            )}
                        </div>
                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn update-btn btn-block mt-4 mb-3"
                                disabled={loading ? true : false}>Update Password</button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default UpdatePassword

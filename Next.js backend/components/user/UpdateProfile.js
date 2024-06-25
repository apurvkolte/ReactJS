import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'

import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, getUserDetails, clearErrors } from '../../redux/actions/userActions'
import { UPDATE_PROFILE_RESET } from '../../redux/constants/userConstants'
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const [id, setId] = useState()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();

    const { user } = useSelector(state => state.userDetails);
    const { error, isUpdated, loading } = useSelector(state => state.user)


    useEffect(() => {
        if (session) {
            setId(session.user.id)
            dispatch(getUserDetails())
        }
        if (user?.id) {
            setName(user.name);
            setEmail(user.email);
            setMobile(user.mobile);
        }

        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            toast.success('User updated successfully')
            dispatch(getUserDetails());
            router.push('/my-profile');
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    }, [dispatch, error, isUpdated, session, user?.id])

    const submitHandler = async (data, e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('mobile', mobile);
        formData.set('id', id);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object
        dispatch(updateProfile(json));
        reset();
    }


    return (
        <Fragment>
            <MetaData title={'Update Profile'} />

            <div className="row wrapper1">
                <div className='col-12 col-md-6'>
                    <form className="shadow-lg" onSubmit={handleSubmit(submitHandler)} encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className={`form-control ${errors.email && "invalid"}`}
                                {...register("email", {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid E-mail Address",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("email");
                                }}
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly
                            />
                            {errors.email && (
                                <small className="text-danger">{errors.email.message}</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobile_field">Mobile Number</label>
                            <input
                                type="text"
                                id="mobile_field"
                                className={`form-control ${errors.mobile && "invalid"}`}
                                {...register("mobile", {
                                    pattern: {
                                        value: /^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$/g,
                                        message: "Invalid Mobile Number",
                                    },
                                    maxLength: {
                                        value: 15,
                                        message: "Invalid Mobile Number",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("mobile");
                                }}
                                name='mobile'
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                            {errors.mobile && (
                                <small className="text-danger">{errors.mobile.message}</small>
                            )}
                        </div>


                        <div className='d-flex justify-content-center'>
                            <button type="submit" className="btn update-btn btn-block mt-4 mb-3 "
                                disabled={loading ? true : false} >Update</button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </Fragment>
    )
}

export default UpdateProfile

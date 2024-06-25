import React, { Fragment, useState, useEffect, useMemo } from 'react'
import dynamic from "next/dynamic";
import MetaData from '../layout/MetaData'
const Sidebar = dynamic(() => import('./Sidebar'));
const MemoizedSidebar = React.memo(Sidebar);
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux'
import { updateUser, getUserDetails } from '../../redux/actions/userActions'
import { UPDATE_USER_RESET } from '../../redux/constants/userConstants'
import { Buffer } from 'buffer'

const UpdateUser = () => {
    const router = useRouter()

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [mobile, setMobile] = useState()
    const [role, setRole] = useState()

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();
    const { isUpdated, success } = useSelector(state => state.user);
    const { error, user } = useSelector(state => state.userDetails)
    const userId = router.query.id;

    useEffect(() => {
        if (user && user.id !== userId) {
            dispatch(getUserDetails(userId))
        }
        setName(user.name);
        setEmail(user.email);
        setMobile(user.mobile);
        setRole(user.role)

        if (error) {
            toast.error(error);
        }

        if (success || isUpdated) {
            toast.success('User updated successfully')
            router.push('/admin/users', { replace: true });
            dispatch({
                type: UPDATE_USER_RESET
            })
        }
    }, [dispatch, router.push, userId, user.id, toast, success, isUpdated, error])

    const sidebar = useMemo(() => <MemoizedSidebar />, []);

    const submitHandler = (data, e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('mobile', mobile);
        formData.set('role', role);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object
        // console.log(json)

        dispatch(updateUser(user.id, json));
        reset();

    }

    return (
        <Fragment>
            <MetaData title={`Update User`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    {sidebar}
                </div>

                <div className="col-12 col-md-10">
                    <div className="row wrapper1">
                        <div className="col-10 col-lg-6">
                            <form className="shadow-lg p-5" onSubmit={handleSubmit(submitHandler)}>
                                <h1 className="mt-2 mb-5 heading">Update User</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="name"
                                        id="name_field"
                                        className={"form-control"}
                                        name='name_field'
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
                                        className={`form-control ${errors.email_field && "invalid"}`}
                                        {...register("email_field", {
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("email_field");
                                        }}
                                        name='email_field'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {errors.email_field && (
                                        <small className="text-danger">{errors.email_field.message}</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mobile_field">Mobile</label>
                                    <input
                                        type="text"
                                        id="mobile_field"
                                        className={`form-control ${errors.mobile_field && "invalid"}`}
                                        {...register("mobile_field", {
                                            pattern: {
                                                value: /^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$/g,
                                                message: "Invalid Mobile Number",
                                            },
                                            maxLength: {
                                                value: 15,
                                                message: "Invalid Mobile Number",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("mobile_field");
                                        }}
                                        name='mobile_field'
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required
                                    />
                                    {errors.mobile_field && (
                                        <small className="text-danger">{errors.mobile_field.message}</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="role_field">Role</label>

                                    <select
                                        id="role_field"
                                        className="form-control"
                                        name='role'
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button type="submit" className="btn btn-primary update-btn btn-block mt-4 mb-3" >Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Fragment>
    )
}

export default UpdateUser

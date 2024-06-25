import React, { Fragment, useState, useEffect } from 'react'
import MetaData from '../layout/MetaData'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { register1, emailVarification, clearErrors } from '../../redux/actions/userActions'
import { useForm } from "react-hook-form";
import validator from 'validator'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { redirect } = router.query;
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        mobile: '',
    })

    const { name, email, password, mobile, confirm_password } = user;
    const [avatar, setAvatar] = useState()
    const [file, setFile] = useState()
    const [code, setCode] = useState('')
    const [codeConfirm, setCodeConfirm] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const { data } = useSelector(state => state.verification);
    const { register, handleSubmit, formState: { errors }, reset, trigger, watch } = useForm();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/', { replace: true });
        }
        if (error) {
            if (error === 'Login first to access this resource.') {

            } else {
                toast.error(error);
                dispatch(clearErrors());
            }
        }
        if (data) {
            setCodeConfirm(data);
        }
    }, [dispatch, router, toast, isAuthenticated, error, data])

    const login = async () => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        if (result.error) {
            toast.error(result.error);
        } else {
            window.location.href = '/'
        }
    }

    const submitHandler = async (data, e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set("name", name);
        formData.set("email", email);
        formData.set("password", password);
        // formData.set("confirmPassword", confirmPassword);
        formData.set("mobile", mobile);
        formData.set("file", file);

        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = object

        dispatch(register1(json));

        // const create = await fetch('/api/auth/register', {
        //   method: 'POST',
        //   body: JSON.stringify(formData),
        //   headers: { 'Content-Type': 'application/json' }
        // })


        // e.target.reset()
        // Router.push('/login')

    }


    const onChange = event => {
        if (event.target.name === 'file') {
            const file = event.target.files[0];
            setFile(file);

            if (event.target.files.length === 0) {
                window.toast("Please select a image");
                return false;
            }

            if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
                window.toast("File does not support. You must use .png or .jpg ");
                return false;
            }
            if (file.size > 4000000) {
                window.toast("Please upload a image smaller than 4 MB");
                return false;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(event.target.files[0])

        } else {
            setUser({ ...user, [event.target.name]: event.target.value })
        }

    }
    return (
        <Fragment>
            <MetaData title={'Register User'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" encType='multipart/form-data' onSubmit={handleSubmit(submitHandler)}>
                        <h1 className="mb-3">Register</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="text"
                                id="name_field"
                                className={`form-control ${errors.name && "invalid"}`}
                                {...register("name", { required: "Please Enter Your Name" })}
                                oninvalid={() => {
                                    trigger("name");
                                }}
                                name='name'
                                value={name}
                                onChange={onChange}
                            />
                            {errors.name && (
                                <small className="text-danger">{errors.name.message}</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className={`form-control ${errors.email_field && "invalid"}`}
                                {...register("email", {
                                    required: "Please Enter Your Email ID",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid Email ID",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("email");
                                }}
                                name='email'
                                value={email}
                                onChange={onChange}
                            />
                            {errors.email && (
                                <small className="text-danger">{errors.email.message}</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className={`form-control ${errors.password && "invalid"}`}
                                {...register("password", {
                                    required: "Please Enter the Password",
                                    minLength: {
                                        value: 8,
                                        message: "Password Should Be at Least 8 Characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Password Should Be Not More Than 50 Characters",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("password");
                                }}
                                name='password'
                                value={password}
                                onChange={onChange}
                            />
                            {errors.password && (
                                <small className="text-danger">{errors.password.message}</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className={`form-control ${errors.confirm_password && "invalid"}`}
                                {...register("confirm_password", {
                                    required: "Please Enter the Confirm Password",
                                    validate: () => {
                                        if (watch('confirm_password') !== password) {
                                            return "Your Passwords Does Not Match";
                                        }
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Password Should Be at Least 8 Characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Password Should Be Not More Than 50 Characters",
                                    }
                                })}
                                oninvalid={() => {
                                    trigger("confirm_password");
                                }}
                                name='confirm_password'
                                value={confirm_password}
                                onChange={onChange}
                            />
                            {errors.confirm_password && (
                                <small className="text-danger">{errors.confirm_password.message}</small>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile_field">Mobile Number</label>
                            <input
                                type="text"
                                id="mobile_field"
                                className={`form-control ${errors.mobile && "invalid"}`}
                                {...register("mobile", {
                                    required: "Please Enter Your Mobile Number",
                                    pattern: {
                                        value: /^(?:(?:\+|0{0,2})91(\s*[-]\s*)?|[0]?)?[789]\d{9}$/g,
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
                                onChange={onChange}
                            />
                            {errors.mobile && (
                                <small className="text-danger">{errors.mobile.message}</small>
                            )}
                        </div>
                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='file'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="image/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            id="register_button"
                            className="btn btn-block py-3"
                            type="submit"
                            disabled={loading ? true : false}
                        >
                            REGISTER
                        </button>
                    </form>
                    {/* {mobile.length > 9 && mobile.match(/^(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$/g) && name && validator.equals(confirm_password, password) && confirm_password && password && validator.isEmail(email) && (
                        <div
                            className="modal fade show"
                            id="ratingModal"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="ratingModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">
                                            Sending a verification code send to your email
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            data-close
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group">
                                            <label htmlFor="name_field">Enter Verification Code ...</label>
                                            <input
                                                type='text'
                                                id="code"
                                                className='form-control mt-3'
                                                value={code}
                                                min={5}
                                                onChange={(e => setCode(e.target.value))}
                                                required
                                            ></input>
                                            <button
                                                className="btn my-3 float-right review-btn px-4 text-white"
                                                onClick={codeHandler}
                                                data-dismiss="modal"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )} */}

                </div>
                <div>
                    <ToastContainer />
                </div>
            </div >
        </Fragment >
    )
}

export default Register

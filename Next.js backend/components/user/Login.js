import React, { Fragment, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Router from 'next/router'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
    const router = useRouter()
    const { data: session } = useSession();


    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);
    const redirect = Router.search ? Router.search.split('=')[1] : (Router.state ? '/shipping' : '/')


    useEffect(() => {
        if (session?.user) {
            router.push(redirect || "/");
        }
    }, [router, session, redirect]);

    const submitHandler = async (data, e) => {
        e.preventDefault();
        // setLoading(true);
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        // setLoading(false)

        if (result?.error) {
            toast.error(result.error);
        } else {
            router.push('/')
        }

        reset();

    }

    function click() {
        // toggle the type attribute
        const togglePassword = document.querySelector("#togglePassword");
        const passwordV = document.querySelector("#password_field");
        const type = passwordV.getAttribute("type") === "password" ? "text" : "password";
        togglePassword.className === 'fa fa-eye viewpass mr-4 text-muted' ? document.getElementById("togglePassword").className = 'fa fa-eye-slash viewpass mr-4 text-muted' : document.getElementById("togglePassword").className = 'fa fa-eye viewpass mr-4 text-muted';
        passwordV.setAttribute("type", type);

    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title={'Login'} />
                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={handleSubmit(submitHandler)}>
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="text"
                                        id="email_field"
                                        className={`form-control ${errors.email_field && "invalid"}`}
                                        {...register("email_field", {
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
                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        type="password"
                                        id="password_field"
                                        className={`form-control ${errors.message && "invalid"}`}
                                        {...register("password_field", {
                                            minLength: {
                                                value: 8,
                                                message: "Password should be at least 8 characters",
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "Password should be not more than 50 characters",
                                            }
                                        })}
                                        onKeyUp={() => {
                                            trigger("password_field");
                                        }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="fa fa-eye viewpass mr-4 text-muted" onClick={click} id="togglePassword"></span>
                                    {errors.password_field && (
                                        <small className="text-danger">{errors.password_field.message}</small>
                                    )}
                                </div>
                                <Link href="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    LOGIN
                                </button>
                                <Link href="/register" className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
            <ToastContainer />
        </Fragment>
    )
}

export default Login

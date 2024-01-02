import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../actions/userActions'
import { useForm } from "react-hook-form";
import { loadUser } from "../../actions/userActions";


const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const params = useParams();

    // console.log("navigate", navigate);
    // console.log("location", location);
    // console.log("params", params);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const alert = useAlert();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, reset, trigger } = useForm();
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);
    const redirect = location.search ? location.search.split('=')[1] : (location.state ? '/shipping' : '/')


    useEffect(() => {
        if (isAuthenticated) {
            dispatch(loadUser());
            navigate(redirect);
        }
        if (user) {
            if (user.isAdmin === 'admin') {
                dispatch(loadUser());
                navigate('/dashboard');
            }
        }

        if (error) {
            if (error === 'Login first to access this resource.' || error === 'jwt expired' || error === "jwt must be provided") {
            } else {
                alert.error(error);
                dispatch(clearErrors());
            }
        }

    }, [dispatch, navigate, alert, isAuthenticated, error]);
    const submitHandler = (data, e) => {
        e.preventDefault();
        dispatch(login(email, password));
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
                                    <span className="fa fa-eye viewpass text-muted" onClick={click} id="togglePassword"></span>
                                    {errors.password_field && (
                                        <small className="text-danger">{errors.password_field.message}</small>
                                    )}
                                </div>
                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>
                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    LOGIN
                                </button>
                                <Link to="/register" className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default Login

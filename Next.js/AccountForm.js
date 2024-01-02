import React, { useContext, useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import commonContext from '../../contexts/common/commonContext';
import useForm from '../../hooks/useForm';
import useOutsideClose from '../../hooks/useOutsideClose';
import useScrollDisable from '../../hooks/useScrollDisable';
import { register1, emailVarification, login, clearErrors, loadUser, forgotPassword } from '../../redux/actions/userActions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { REGISTER_USER_RESET } from '../../redux/constants/userConstants'

const AccountForm = () => {
    const dispatch = useDispatch()
    const [user1, setUser] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        mobile: '',
    })

    const router = useRouter();
    const { data: session } = useSession();
    const { redirect } = router.query;
    const formRef = useRef();
    const { name, email, password, mobile, confirm_password } = user1;
    const [avatar, setAvatar] = useState()
    const [file, setFile] = useState()
    const [code, setCode] = useState()
    const [wrongCode, setWrongCode] = useState(0)
    const [forgotPasswordFiled, setForgotPasswordFiled] = useState(0)
    const [verifyInput, setVerifyInput] = useState(0)
    const [codeConfirm, setCodeConfirm] = useState()
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const { isFormOpen, toggleForm } = useContext(commonContext);
    const { inputValues, handleInputValues } = useForm();
    const { data } = useSelector(state => state.verification);
    var mobileTest = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}$/g;
    var emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const { isAuthenticated, user, error, loading } = useSelector(state => state.auth);

    useEffect(() => {
        // if (isAuthenticated) {
        //     toast.success("Registration Successful!");
        //     dispatch({ type: REGISTER_USER_RESET });
        //     login();
        // }

        // if (error) {
        //     toast.success(error);
        //     dispatch(clearErrors());
        // }

        // if (session?.user) {
        //     router.push(redirect || "/");
        // }

        if (verifyInput) {
            toast.error("Invalid entry...! Kindly enter valid input values for sign up")
            setVerifyInput(0)
        }

    }, [dispatch, isAuthenticated, session, error, verifyInput])

    const login = async () => {
        const result = await signIn('credentials', {
            redirect: false,
            email: inputValues.mail,
            password: inputValues.password
        })

        if (result.error) {
            toast.error(result.error);
        } else {
            window.location.href = '/'
        }
    }

    useOutsideClose(formRef, () => {
        toggleForm(false);
    });
    useScrollDisable(isFormOpen);
    const [isSignupVisible, setIsSignupVisible] = useState(false);


    function click() {
        // toggle the type attribute
        const togglePassword = document.querySelector("#togglePassword");
        const passwordV = document.querySelector("#password_field");
        const type = passwordV.getAttribute("type") === "password" ? "text" : "password";
        togglePassword.className === 'fa fa-eye viewpass text-muted' ? document.getElementById("togglePassword").className = 'fa fa-eye-slash viewpass text-muted' : document.getElementById("togglePassword").className = 'fa fa-eye viewpass text-muted';
        passwordV.setAttribute("type", type);

    }

    // Signup-form visibility toggling
    const handleIsSignupVisible = () => {
        setIsSignupVisible(prevState => !prevState);
    };


    const handleFormSubmit = async () => {
        if (!isSignupVisible) {
            toggleForm(false);
            // dispatch(login(inputValues.mail, inputValues.password));
            const result = await signIn('credentials', {
                redirect: false,
                email: inputValues.mail,
                password: inputValues.password
            })


            if (result?.error) {
                toast.error("Invalid " + result.error);
            } else {
                // router.push('/');
                dispatch(loadUser())
                toast.success("Login successfully");
            }

        } else {
            if (! /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}$/g.test(mobile)) {
                toast.error("Invalid Mobile Number")
            }
            if (!emailTest.test(inputValues.mail)) {
                toast.error("Invalid E-mail Address")
            }
            if (inputValues.password !== inputValues.conf_password) {
                toast.error("Confirm password does not match")
            }
            if (/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}$/g.test(mobile) && emailTest.test(inputValues.mail) && inputValues.password === inputValues.conf_password) {
                const formData = new FormData();
                formData.set('email', "apurvkolte10@gmail.com");
                dispatch(emailVarification(formData))
            } else {
                setVerifyInput(1);
            }

        }
    }

    const codeHandler = () => {
        const formData = new FormData();
        formData.set('name', inputValues.username);
        formData.set('email', inputValues.mail);
        formData.set('password', inputValues.password);
        formData.set('confirm_password', inputValues.conf_password);
        formData.set('mobile', mobile.replace(/\s/g, ''));
        formData.append(`file`, file)


        if (code === data.data) {
            dispatch(register1(formData));
            toast.success("Welcome..! registration successful ");
            setWrongCode(0)
            login()
            // router.push('/');
        } else {
            setWrongCode(1)
            toast.error("Invlid Security Code");
            setCode('');
            return false;
        }
    }

    const forgotPasswordHandler = () => {
        const formData = new FormData();
        formData.set('email', inputValues.email);
        dispatch(forgotPassword(formData));
        setForgotPasswordFiled(0);
    }


    const onChange = event => {
        setVerifyInput(0);

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
            setUser({ ...user1, [event.target.name]: event.target.value })
        }
    }

    return (
        <>
            {
                isFormOpen && (
                    <div className="backdrop">
                        <div className="modal_centered">
                            <form id="account_form" ref={formRef} >
                                {/*===== Form-Header =====*/}
                                <div className="form_head loginform">
                                    <h2>{isSignupVisible ? 'Signup' : 'Login'}</h2>
                                    <p>
                                        {isSignupVisible ? 'Already have an account ?' : 'New to Durasign ?'}
                                        &nbsp;&nbsp;
                                        <button className='loginform' type="button" onClick={handleIsSignupVisible}>
                                            {isSignupVisible ? 'Login' : 'Create an account'}
                                        </button>
                                    </p>
                                </div>

                                {/*===== Form-Body =====*/}
                                <div className="form_body loginform">
                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="input_field"
                                                    value={inputValues.username || ''}
                                                    onChange={handleInputValues}
                                                    required
                                                />
                                                <label className="input_label">Username</label>
                                            </div>
                                        )
                                    }

                                    <div className="input_box">
                                        <input
                                            type="email"
                                            name="mail"
                                            className="input_field"
                                            value={inputValues.mail || ''}
                                            onChange={handleInputValues}
                                            onKeyUp={onChange}
                                            required
                                        />
                                        <label className="input_label">Email</label>
                                    </div>

                                    <div className="input_box">
                                        <input
                                            type="password"
                                            name="password"
                                            className="input_field"
                                            id="password_field"
                                            value={inputValues.password || ''}
                                            onChange={handleInputValues}
                                            onKeyUp={onChange}
                                            pattern=".{8,}"
                                            title="Eight or more characters"
                                            required
                                        />
                                        <span className="fa fa-eye viewpass text-muted" onClick={click} id="togglePassword"></span>
                                        <label className="input_label">Password</label>
                                    </div>

                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="password"
                                                    name="conf_password"
                                                    className="input_field"
                                                    value={inputValues.conf_password || ''}
                                                    onChange={handleInputValues}
                                                    onKeyUp={onChange}
                                                    pattern=".{8,}"
                                                    title="Eight or more characters"
                                                    required
                                                />
                                                <label className="input_label">Confirm Password</label>
                                            </div>
                                        )
                                    }
                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    className="input_field"
                                                    value={mobile}
                                                    onChange={onChange}
                                                    required
                                                    pattern="(?:(?:\+|0{0,2})91(\s*[ -]\s*)?|[0]?)?[789]\d{9}$"
                                                />
                                                <label className="input_label">Mobile Number</label>
                                            </div>
                                        )
                                    }

                                    {
                                        isSignupVisible && (
                                            <div className="input_box">
                                                <input
                                                    type='file'
                                                    name='file'
                                                    className='input_field'
                                                    id='customFile'
                                                    accept="image/*"
                                                    onChange={onChange}
                                                />

                                                <label className="input_label">Choose Avatar</label>
                                            </div>
                                        )
                                    }

                                    {
                                        !isSignupVisible && (
                                            <Link href={""} onClick={() => forgotPasswordFiled ? setForgotPasswordFiled(0) : setForgotPasswordFiled(1)}> <small className="text-secondary">Forgot Password</small></Link>
                                        )
                                    }
                                    {
                                        !isSignupVisible && forgotPasswordFiled === 1 && (<>
                                            <div className="input_box">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="input_field"
                                                    value={inputValues.email || ''}
                                                    onChange={handleInputValues}
                                                    required
                                                />
                                                <label className="input_label">Enter Email</label>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn login_btn"
                                                onClick={forgotPasswordHandler}
                                            >
                                                Send
                                            </button>
                                        </>

                                        )
                                    }

                                    {isSignupVisible ? (
                                        <button
                                            type="button"
                                            className="btn login_btn"
                                            onClick={handleFormSubmit}
                                        >
                                            {isSignupVisible ? 'Verifiy Email' : 'Login'}
                                        </button>
                                    ) :
                                        forgotPasswordFiled === 0 ?
                                            <button
                                                type="button"
                                                className="btn login_btn"
                                                onClick={handleFormSubmit}
                                            >
                                                {isSignupVisible ? 'Verifiy Email' : 'Login'}
                                            </button> : ""
                                    }

                                    {mobileTest.test(mobile) && emailTest.test(inputValues.mail) && inputValues.password === inputValues.conf_password && data?.data && isSignupVisible ? (
                                        <>
                                            <div className="input_box">
                                                <input
                                                    type='text'
                                                    name='code'
                                                    className='input_field'
                                                    value={code}
                                                    placeholder="Kindly enter verification code send to your email"
                                                    min={5}
                                                    onChange={(e => setCode(e.target.value))}
                                                />
                                                {wrongCode === 1 ? (
                                                    <small className="text-danger">You have entered a wrong verification code.</small>
                                                ) : ""}

                                                <label className="input_label">Verify Code</label>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn login_btn"
                                                onClick={codeHandler}
                                            >
                                                Submit
                                            </button>
                                        </>
                                    ) : (verifyInput === 1 ? (<small className="text-danger">Invalid entry...! Kindly enter valid input values for sign up. </small>) : "")}


                                </div>

                                {/*===== Form-Footer =====*/}
                                {/* <div className="form_foot">
                                    <p>or login with</p>
                                    <div className="login_options">
                                        <Link to="/">Facebook</Link>
                                        <Link to="/">Google</Link>
                                        <Link to="/">Twitter</Link>
                                    </div>
                                </div> */}

                                {/*===== Form-Close-Btn =====*/}
                                <div
                                    className="close_btn"
                                    title="Close"
                                    onClick={() => toggleForm(false)}
                                >
                                    &times;
                                </div>
                            </form>
                        </div>
                        <ToastContainer />
                    </div>
                )
            }
        </>
    );
};

export default AccountForm;
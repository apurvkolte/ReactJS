import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

const MultiLayersForm = () => {

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [mobile, setMobile] = useState();
    const [error, setError] = useState({});
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [city, setCity] = useState();
    const [pinCode, setPinCode] = useState();

    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        console.log("Current Step:", currentStep);
    }, [currentStep]);

    const validation = () => {
        const errors = {};

        // STEP 1 VALIDATION
        if (currentStep === 1) {
            if (!name) {
                errors.name = "Name is required";
            }
            if (!email) {
                errors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                errors.email = "Email is invalid";
            }
            if (!mobile) {
                errors.mobile = "Mobile number is required";
            } else if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
                errors.mobile = "Mobile number must be 10 digits";
            }
        }

        // STEP 2 VALIDATION
        else if (currentStep === 2) {
            if (!password) {
                errors.password = "Password is required";
            } else if (password.length < 6) {
                errors.password = "Password must be at least 6 characters";
            }
            if (!confirmPassword) {
                errors.confirmPassword = "Confirm Password is required";
            } else if (confirmPassword !== password) {
                errors.confirmPassword = "Passwords do not match";
            }
        }

        // STEP 3 VALIDATION
        else if (currentStep === 3) {
            if (!city) {
                errors.city = "City is required";
            }
            if (!pinCode) {
                errors.pinCode = "Pin code is required";
            } else if (pinCode.length !== 6 || !/^\d+$/.test(pinCode)) {
                errors.pinCode = "Pin code must be 6 digits";
            }
        }

        // Set the errors state
        setError(errors);

        // LOGIC: Only change step if the CURRENT step has 0 errors
        if (Object.keys(errors).length === 0) {
            if (currentStep < 3) {
                setCurrentStep(currentStep + 1);
            } else {
                // Final Submission Logic for 2025
                alert("Form Submitted Successfully!" + "\n" +
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n" +
                    "Mobile: " + mobile + "\n" +
                    "City: " + city + "\n" +
                    "Pin Code: " + pinCode);

                console.log({ name, email, mobile, city, pinCode });
            }
        }
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        validation();
        if (Object.keys(error).length === 0) {
            // Proceed to next step
        }

    }

    const clearError = () => {
        setError({});
    }

    const handleInputChange = (field, value) => {
        clearError();
        if (field === 'name') setName(value);
        if (field === 'email') setEmail(value);
        if (field === 'mobile') setMobile(value);
        if (field === 'password') setPassword(value);
        if (field === 'confirmPassword') setConfirmPassword(value);
        if (field === 'city') setCity(value);
        if (field === 'pinCode') setPinCode(value);

        if (error[field]) {
            setError(prevError => {
                const newError = { ...prevError };
                delete newError[field];
                return newError;
            });

        }
    }

    const changeStep = (step) => {
        setCurrentStep(step);
    }


    return (
        <div className='container'>
            <div className='section'>
                <div className='border'>
                    <h1>Registration Form</h1>
                    <div className='form'>
                        {currentStep === 1 && (
                            <div className="form-layer active">
                                <p className="section-title">Personal Information</p>
                                <label>Name</label>
                                <input className="form-input" type="text" value={name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder='Enter your name' />
                                {error.name && <span className='error'>{error.name}</span>}

                                <label>Email</label>
                                <input className="form-input" type="email" value={email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder='Enter your email' />
                                {error.email && <span className='error'>{error.email}</span>}

                                <label>Mobile</label>
                                <input className="form-input" type="text" value={mobile} onChange={(e) => handleInputChange('mobile', e.target.value)} placeholder='Enter your mobile number' />
                                {error.mobile && <span className='error'>{error.mobile}</span>}

                                <div className='row'>
                                    <button className='submit-btn right' onClick={validation}>Next <FaArrowRight style={{ marginLeft: '8px' }} /></button>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="form-layer active">
                                <p className="section-title">Credentials</p>
                                <label>Password</label>
                                <input className="form-input" type="password" value={password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder='Enter your password' />
                                {error.password && <span className='error'>{error.password}</span>}

                                <label>Confirm Password</label>
                                <input className="form-input" type="password" value={confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} placeholder='Confirm your password' />
                                {error.confirmPassword && <span className='error'>{error.confirmPassword}</span>}


                                <div className='row'>
                                    <button className='submit-btn hide' onClick={() => changeStep(1)}>Back </button>

                                    <button className='submit-btn right' onClick={validation}>Next <FaArrowRight style={{ marginLeft: '8px' }} /></button>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="form-layer active">
                                <p className="section-title">Address</p>
                                <label>City</label>
                                <input className="form-input" type="text" value={city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder='Enter your city' />
                                {error.city && <span className='error'>{error.city}</span>}

                                <label>Pin code</label>
                                <input className="form-input" type="text" value={pinCode} onChange={(e) => handleInputChange('pinCode', e.target.value)} placeholder='Enter your pin code' />
                                {error.pinCode && <span className='error'>{error.pinCode}</span>}


                                <div className='row'>
                                    <button className='submit-btn hide' onClick={() => changeStep(2)}>Back </button>

                                    <button className='submit-btn right' onClick={validation}>Submit </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div >
    )
}

export default MultiLayersForm
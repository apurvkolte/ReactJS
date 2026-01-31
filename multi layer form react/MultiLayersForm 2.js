import React, { useEffect, useState, useCallback } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheck } from "react-icons/fa";
import './MultiLayersForm.css'; // Separate CSS file

const MultiLayersForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        city: '',
        pinCode: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/,
            message: "Name should contain only letters and spaces"
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
        },
        mobile: {
            required: true,
            pattern: /^[0-9]{10}$/,
            message: "Please enter a valid 10-digit mobile number"
        },
        password: {
            required: true,
            minLength: 6,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: "Password must be at least 6 characters with uppercase, lowercase and number"
        },
        confirmPassword: {
            required: true,
            validate: (value) => value === formData.password,
            message: "Passwords do not match"
        },
        city: {
            required: true,
            minLength: 2,
            message: "Please enter a valid city name"
        },
        pinCode: {
            required: true,
            pattern: /^[0-9]{6}$/,
            message: "Please enter a valid 6-digit pin code"
        }
    };

    // Step definitions
    const steps = [
        {
            id: 1,
            title: "Personal Information",
            fields: ['name', 'email', 'mobile']
        },
        {
            id: 2,
            title: "Credentials",
            fields: ['password', 'confirmPassword']
        },
        {
            id: 3,
            title: "Address",
            fields: ['city', 'pinCode']
        }
    ];

    // Validate a single field
    const validateField = useCallback((name, value) => {
        const rules = validationRules[name];
        if (!rules) return '';

        if (rules.required && !value.trim()) {
            return "This field is required";
        }

        if (rules.minLength && value.length < rules.minLength) {
            return `Minimum ${rules.minLength} characters required`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            return `Maximum ${rules.maxLength} characters allowed`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            return rules.message;
        }

        if (rules.validate && !rules.validate(value)) {
            return rules.message;
        }

        return '';
    }, [validationRules]);

    // Validate current step
    const validateStep = useCallback((step) => {
        const stepErrors = {};
        const currentStepFields = steps.find(s => s.id === step)?.fields || [];

        currentStepFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                stepErrors[field] = error;
            }
        });

        setErrors(prev => ({ ...prev, ...stepErrors }));
        return Object.keys(stepErrors).length === 0;
    }, [formData, steps, validateField]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    // Handle blur
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, formData[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Handle next step
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all steps
        let isValid = true;
        for (let i = 1; i <= 3; i++) {
            if (!validateStep(i)) {
                isValid = false;
                if (i < currentStep) setCurrentStep(i);
                break;
            }
        }

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert(`Form Submitted Successfully!\n\n` +
                `Name: ${formData.name}\n` +
                `Email: ${formData.email}\n` +
                `Mobile: ${formData.mobile}\n` +
                `City: ${formData.city}\n` +
                `Pin Code: ${formData.pinCode}`);

            console.log('Form Data:', formData);

            // Reset form
            setFormData({
                name: '',
                email: '',
                mobile: '',
                password: '',
                confirmPassword: '',
                city: '',
                pinCode: ''
            });
            setErrors({});
            setTouched({});
            setCurrentStep(1);

        } catch (error) {
            alert('Submission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Progress bar
    const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="multi-step-form-container">
            <div className="form-card">
                <header className="form-header">
                    <h1>Registration Form</h1>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <div className="step-indicators">
                        {steps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`step-indicator ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                            >
                                <span className="step-number">
                                    {currentStep > step.id ? <FaCheck /> : index + 1}
                                </span>
                                <span className="step-title">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="multi-step-form">
                    {/* Step 1 */}
                    {currentStep === 1 && (
                        <div className="form-step active">
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your full name"
                                    className={`form-input ${errors.name ? 'error' : ''}`}
                                />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your email"
                                    className={`form-input ${errors.email ? 'error' : ''}`}
                                />
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobile">Mobile Number *</label>
                                <input
                                    id="mobile"
                                    name="mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter 10-digit mobile number"
                                    className={`form-input ${errors.mobile ? 'error' : ''}`}
                                />
                                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
                            </div>
                        </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                        <div className="form-step active">
                            <div className="form-group">
                                <label htmlFor="password">Password *</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter password"
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                />
                                {errors.password && <span className="error-message">{errors.password}</span>}
                                <div className="input-hint">
                                    Must be at least 6 characters with uppercase, lowercase and number
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password *</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Confirm password"
                                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                />
                                {errors.confirmPassword && (
                                    <span className="error-message">{errors.confirmPassword}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                        <div className="form-step active">
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your city"
                                    className={`form-input ${errors.city ? 'error' : ''}`}
                                />
                                {errors.city && <span className="error-message">{errors.city}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="pinCode">Pin Code *</label>
                                <input
                                    id="pinCode"
                                    name="pinCode"
                                    type="text"
                                    value={formData.pinCode}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter 6-digit pin code"
                                    className={`form-input ${errors.pinCode ? 'error' : ''}`}
                                />
                                {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}
                            </div>
                        </div>
                    )}

                    <div className="form-navigation">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="btn btn-secondary"
                                disabled={isSubmitting}
                            >
                                <FaArrowLeft /> Back
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                Next <FaArrowRight />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </form>

                <div className="form-footer">
                    <div className="required-note">* Required fields</div>
                    <div className="step-counter">
                        Step {currentStep} of {steps.length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiLayersForm;
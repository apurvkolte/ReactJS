import { FormData } from "../types/types";

export const validationRules = {
    productName: { required: true, minLength: 2, maxLength: 100 },
    price: { required: true, pattern: /^\d+(\.\d{1,2})?$/ },
    quantity: { required: true, pattern: /^\d+$/ },
    date: { required: true },
    category: { required: true },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    pincode: { required: true, pattern: /^\d{6}$/ },
    country: { required: true },
    password: { required: true, minLength: 8 },
    phoneNumber: { required: true, pattern: /^[6-9]\d{9}$/ },
    website: {
        pattern:
            /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b/,
    },
};

export const validateForm = (form: FormData) => {
    const errors: Record<string, string> = {};

    Object.entries(validationRules).forEach(([field, rules]: any) => {
        const value = (form as any)[field]?.trim?.() ?? "";

        if (rules.required && !value) {
            errors[field] = `${field} is required`;
            return;
        }

        if (rules.minLength && value.length < rules.minLength) {
            errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = `${field} must be less than ${rules.maxLength} characters`;
        }

        if (rules.pattern && value && !rules.pattern.test(value)) {
            errors[field] = `Invalid ${field}`;
        }
    });

    if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
};

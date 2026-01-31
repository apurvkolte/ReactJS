import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet,
    Modal,
    FlatList,
    ActivityIndicator,
    Animated,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';


interface FormData {
    productName: string;
    description: string;
    price: string;
    quantity: string;
    date: string;
    category: string;
    condition: string;
    email: string;
    pincode: string;
    gstNumber: string;
    country: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    website: string;
}


const validationRules = {
    productName: { required: true, minLength: 2, maxLength: 100 },
    price: { required: true, pattern: /^\d+(\.\d{1,2})?$/ },
    quantity: { required: true, pattern: /^\d+$/ },
    date: { required: true },
    category: { required: true },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    pincode: { required: true, pattern: /^\d{6}$/ },
    gstNumber: {
        // required: true,
        // pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
    },
    country: { required: true },
    password: { required: true, minLength: 8 },
    confirmPassword: { required: true },
    phoneNumber: { required: true, pattern: /^[6-9]\d{9}$/ },
    website: { pattern: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/ }
};

const validateForm = (form: FormData) => {
    const errors: Record<string, string> = {};

    // Product Name
    if (!form.productName.trim()) {
        errors.productName = 'Product name is required';
    } else if (form.productName.length < validationRules.productName.minLength!) {
        errors.productName = `Product name must be at least ${validationRules.productName.minLength} characters`;
    } else if (form.productName.length > validationRules.productName.maxLength!) {
        errors.productName = `Product name must be less than ${validationRules.productName.maxLength} characters`;
    }

    // Price
    if (!form.price.trim()) {
        errors.price = 'Price is required';
    } else if (!validationRules.price.pattern.test(form.price)) {
        errors.price = 'Please enter a valid price (e.g., 99.99)';
    }

    // Quantity
    if (!form.quantity.trim()) {
        errors.quantity = 'Quantity is required';
    } else if (!validationRules.quantity.pattern.test(form.quantity)) {
        errors.quantity = 'Please enter a valid quantity (whole numbers only)';
    }

    // Date
    if (!form.date.trim()) {
        errors.date = 'Date is required';
    }

    // Category
    if (!form.category.trim()) {
        errors.category = 'Category is required';
    }

    // Condition
    if (!form.condition.trim()) {
        errors.condition = 'Product condition is required';
    }

    // Email
    if (!form.email.trim()) {
        errors.email = 'Email is required';
    } else if (!validationRules.email.pattern.test(form.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone Number
    if (!form.phoneNumber.trim()) {
        errors.phoneNumber = 'Phone number is required';
    } else if (!validationRules.phoneNumber.pattern.test(form.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Pincode
    if (!form.pincode.trim()) {
        errors.pincode = 'Pincode is required';
    } else if (!validationRules.pincode.pattern.test(form.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    // GST Number
    // if (!form.gstNumber.trim()) {
    //     errors.gstNumber = 'GST Number is required';
    // } else if (!validationRules.gstNumber.pattern.test(form.gstNumber.toUpperCase())) {
    //     errors.gstNumber = 'Please enter a valid GST Number (e.g., 22AAAAA0000A1Z5)';
    // }

    // Country
    if (!form.country.trim()) {
        errors.country = 'Country is required';
    }

    // Password
    if (!form.password.trim()) {
        errors.password = 'Password is required';
    } else if (form.password.length < validationRules.password.minLength!) {
        errors.password = `Password must be at least ${validationRules.password.minLength} characters`;
    }

    // Confirm Password
    if (!form.confirmPassword.trim()) {
        errors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    // Website (optional)
    if (form.website.trim() && !validationRules.website.pattern!.test(form.website)) {
        errors.website = 'Please enter a valid website URL';
    }

    return errors;
};

const CATEGORIES = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
    { label: 'Home & Kitchen', value: 'home_kitchen' },
    { label: 'Sports', value: 'sports' },
    { label: 'Beauty', value: 'beauty' },
    { label: 'Automotive', value: 'automotive' },
];

const COUNTRIES = [
    { label: 'India', value: 'IN' },
    { label: 'United States', value: 'US' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Canada', value: 'CA' },
    { label: 'Australia', value: 'AU' },
    { label: 'Germany', value: 'DE' },
    { label: 'Japan', value: 'JP' },
];

const CONDITIONS = [
    { label: 'New', value: 'new' },
    { label: 'Like New', value: 'used_like_new' },
    { label: 'Good', value: 'used_good' },
    { label: 'Fair', value: 'used_fair' },
];



// Animated Input Field
const InputField = ({
    label,
    value,
    onChange,
    error,
    icon,
    rightIcon,
    onBlur,
    multiline = false,
    ...props
}: any) => {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const handleFocus = useCallback(() => {
        setFocused(true);
        Animated.spring(borderAnim, {
            toValue: 1,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
        Animated.spring(borderAnim, {
            toValue: 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    }, []);

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? '#EF4444' : '#E5E7EB', error ? '#EF4444' : '#3B82F6']
    });

    const bgColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [error ? '#FEF2F2' : '#F9FAFB', '#FFFFFF']
    });

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <Animated.View
                style={[
                    styles.inputBox,
                    multiline && styles.inputBoxMulti,
                    { borderColor, backgroundColor: bgColor }
                ]}
            >
                {icon && <View style={multiline ? styles.iconTop : styles.icon}>{icon}</View>}
                <TextInput
                    style={[styles.input, multiline && styles.inputMulti]}
                    value={value}
                    onChangeText={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor={focused ? '#93C5FD' : '#9CA3AF'}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...props}
                />
                {rightIcon}
            </Animated.View>
            {error && (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={14} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

// Dropdown Selector
const Dropdown = ({ label, value, options, onSelect, error, show, setShow }: any) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: show ? 1 : 0,
            useNativeDriver: true,
        }).start();
    }, [show]);

    return (
        <View style={styles.field}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.dropdown, error && styles.dropdownError]}
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                <Text style={value ? styles.dropdownValue : styles.dropdownPlaceholder}>
                    {value ? options.find((o: any) => o.value === value)?.label : `Select ${label}`}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {error && (
                <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={14} color="#EF4444" />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <Modal visible={show} transparent animationType="fade">
                <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={() => setShow(false)}>
                    <Animated.View style={[styles.modalBox, { transform: [{ scale: scaleAnim }], opacity: scaleAnim }]}>
                        <Text style={styles.modalTitle}>Select {label}</Text>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => { onSelect(item.value); setShow(false); }}
                                >
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                    {value === item.value && (
                                        <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// Success Modal
const SuccessModal = ({ visible, onClose, productName, email }: any) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0);
            rotateAnim.setValue(0);
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
                Animated.timing(rotateAnim, { toValue: 1, duration: 500, useNativeDriver: true })
            ]).start();
        }
    }, [visible]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.successBg}>
                <Animated.View style={[styles.successBox, { transform: [{ scale: scaleAnim }] }]}>
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <View style={styles.successIcon}>
                            <Ionicons name="checkmark-circle" size={100} color="#10B981" />
                        </View>
                    </Animated.View>

                    <Text style={styles.successTitle}>Success! 🎉</Text>
                    <Text style={styles.successSubtitle}>Form Submitted</Text>
                    <Text style={styles.successMsg}>
                        Your product registration is complete. We'll process it and contact you soon.
                    </Text>

                    <View style={styles.successInfo}>
                        <View style={styles.successRow}>
                            <Ionicons name="cube-outline" size={20} color="#3B82F6" />
                            <Text style={styles.successText}>{productName}</Text>
                        </View>
                        <View style={styles.successRow}>
                            <Ionicons name="mail-outline" size={20} color="#3B82F6" />
                            <Text style={styles.successText}>{email}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.successBtn} onPress={onClose}>
                        <Text style={styles.successBtnText}>Register Another Product</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function UpdateForm() {
    // Form State
    const [form, setForm] = useState<FormData>({
        productName: '', description: '', price: '', quantity: '', date: '',
        category: '', condition: '', email: '', pincode: '', gstNumber: '',
        country: '', password: '', confirmPassword: '', phoneNumber: '', website: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [images, setImages] = useState<string[]>([]);
    const [pdf, setPdf] = useState<any>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showDate, setShowDate] = useState(false);
    const [date, setDate] = useState(new Date());
    const [showCategory, setShowCategory] = useState(false);
    const [showCountry, setShowCountry] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Handle field change
    const handleChange = useCallback((field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear error on change
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    // Handle blur validation for individual fields
    const handleBlur = useCallback((field: keyof FormData) => {
        // Create a simple validation function for individual fields
        const validateField = (field: keyof FormData, value: string): string => {
            const rules = validationRules as any;

            if (rules[field]?.required && !value.trim()) {
                return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }

            if (field === 'productName') {
                if (value.length < rules.productName.minLength!) {
                    return `Product name must be at least ${rules.productName.minLength} characters`;
                }
                if (value.length > rules.productName.maxLength!) {
                    return `Product name must be less than ${rules.productName.maxLength} characters`;
                }
            }

            if (field === 'price' && rules.price.pattern && !rules.price.pattern.test(value)) {
                return 'Please enter a valid price (e.g., 99.99)';
            }

            if (field === 'quantity' && rules.quantity.pattern && !rules.quantity.pattern.test(value)) {
                return 'Please enter a valid quantity (whole numbers only)';
            }

            if (field === 'email' && rules.email.pattern && !rules.email.pattern.test(value)) {
                return 'Please enter a valid email address';
            }

            if (field === 'pincode' && rules.pincode.pattern && !rules.pincode.pattern.test(value)) {
                return 'Please enter a valid 6-digit pincode';
            }

            if (field === 'gstNumber' && rules.gstNumber.pattern && !rules.gstNumber.pattern.test(value.toUpperCase())) {
                return 'Please enter a valid GST Number (e.g., 22AAAAA0000A1Z5)';
            }

            if (field === 'phoneNumber' && rules.phoneNumber.pattern && !rules.phoneNumber.pattern.test(value)) {
                return 'Please enter a valid 10-digit mobile number';
            }

            if (field === 'password' && value.length < rules.password.minLength!) {
                return `Password must be at least ${rules.password.minLength} characters`;
            }

            if (field === 'confirmPassword' && value !== form.password) {
                return 'Passwords do not match';
            }

            if (field === 'website' && value.trim() && rules.website.pattern && !rules.website.pattern.test(value)) {
                return 'Please enter a valid website URL';
            }

            return '';
        };

        const error = validateField(field, form[field]);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    }, [form]);

    // Image picker
    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera roll permission required'); // Changed
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
        }
    };

    // PDF picker
    const pickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
            if (!result.canceled) {
                setPdf({
                    name: result.assets[0].name || 'document.pdf',
                    size: result.assets[0].size || 0,
                });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to select PDF document'); // Changed
        }
    };

    // Date change
    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDate(false);
        if (selectedDate) {
            setDate(selectedDate);
            handleChange('date', selectedDate.toISOString().split('T')[0]);
        }
    };

    // Submit
    const handleSubmit = async () => {
        if (!termsAccepted) {
            Alert.alert('Terms Required', 'Please accept terms and conditions');
            return;
        }

        const validationErrors = validateForm(form);
        setErrors(validationErrors);


        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);

            try {
                // const response = await fetch('https://your-backend-api.com/submit', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Accept': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         ...form,
                //         images,
                //         pdf,
                //         termsAccepted,
                //         submittedAt: new Date().toISOString(),
                //     }),
                // });

                // const data = await response.json();

                // if (response.ok) {
                if (1) {
                    setShowSuccess(true);
                } else {
                    Alert.alert("data.message ||" + 'Submission failed');
                }
            } catch (error) {
                Alert.alert('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };


    // Reset
    const reset = () => {
        setForm({
            productName: '', description: '', price: '', quantity: '', date: '',
            category: '', condition: '', email: '', pincode: '', gstNumber: '',
            country: '', password: '', confirmPassword: '', phoneNumber: '', website: ''
        });
        setImages([]);
        setPdf(null);
        setTermsAccepted(false);
        setErrors({});
        setShowSuccess(false);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Ionicons name="bag-check" size={40} color="white" />
                </View>
                <Text style={styles.title}>Product Registration</Text>
                <Text style={styles.subtitle}>Fill in the details below</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
                {/* Product Name */}
                <InputField
                    label="Product Name *"
                    value={form.productName}
                    onChange={(v: string) => handleChange('productName', v)}
                    onBlur={() => handleBlur('productName')}
                    error={errors.productName}
                    placeholder="Enter product name"
                    icon={<Ionicons name="cube-outline" size={20} color="#9CA3AF" />}
                />

                {/* Description */}
                <InputField
                    label="Description"
                    value={form.description}
                    onChange={(v: string) => handleChange('description', v)}
                    error={errors.description}
                    placeholder="Enter product description"
                    multiline
                    numberOfLines={4}
                    icon={<Ionicons name="document-text-outline" size={20} color="#9CA3AF" />}
                />

                {/* Price & Quantity Row */}
                <View style={styles.row}>
                    <View style={styles.half}>
                        <InputField
                            label="Price (₹) *"
                            value={form.price}
                            onChange={(v: string) => handleChange('price', v.replace(/[^0-9.]/g, ''))}
                            onBlur={() => handleBlur('price')}
                            error={errors.price}
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            icon={<Ionicons name="pricetag-outline" size={20} color="#9CA3AF" />}
                        />
                    </View>
                    <View style={styles.half}>
                        <InputField
                            label="Quantity *"
                            value={form.quantity}
                            onChange={(v: string) => handleChange('quantity', v.replace(/[^0-9]/g, ''))}
                            onBlur={() => handleBlur('quantity')}
                            error={errors.quantity}
                            placeholder="0"
                            keyboardType="numeric"
                            icon={<Ionicons name="archive-outline" size={20} color="#9CA3AF" />}
                        />
                    </View>
                </View>

                {/* Date */}
                <View style={styles.field}>
                    <Text style={styles.label}>Date *</Text>
                    <TouchableOpacity
                        style={[styles.dropdown, errors.date && styles.dropdownError]}
                        onPress={() => setShowDate(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <Text style={form.date ? styles.dropdownValue : styles.dropdownPlaceholder}>
                            {form.date || 'Select date'}
                        </Text>
                    </TouchableOpacity>
                    {errors.date && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={14} color="#EF4444" />
                            <Text style={styles.errorText}>{errors.date}</Text>
                        </View>
                    )}
                    {showDate && (
                        <DateTimePicker value={date} mode="date" onChange={onDateChange} maximumDate={new Date()} />
                    )}
                </View>

                {/* Category */}
                <Dropdown
                    label="Category *"
                    value={form.category}
                    options={CATEGORIES}
                    onSelect={(v: string) => handleChange('category', v)}
                    error={errors.category}
                    show={showCategory}
                    setShow={setShowCategory}
                />

                {/* Condition */}
                <View style={styles.field}>
                    <Text style={styles.label}>Product Condition *</Text>
                    <View style={styles.conditionRow}>
                        {CONDITIONS.map(c => (
                            <TouchableOpacity
                                key={c.value}
                                style={[styles.conditionBtn, form.condition === c.value && styles.conditionBtnActive]}
                                onPress={() => handleChange('condition', c.value)}
                            >
                                <Text style={[styles.conditionText, form.condition === c.value && styles.conditionTextActive]}>
                                    {c.label}
                                </Text>
                                {form.condition === c.value && (
                                    <Ionicons name="checkmark-circle" size={18} color="white" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                    {errors.condition && (
                        <View style={styles.errorBox}>
                            <Ionicons name="alert-circle" size={14} color="#EF4444" />
                            <Text style={styles.errorText}>{errors.condition}</Text>
                        </View>
                    )}
                </View>

                {/* Images */}
                <View style={styles.field}>
                    <Text style={styles.label}>Product Images</Text>
                    <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
                        <Ionicons name="images-outline" size={22} color="#3B82F6" />
                        <Text style={styles.uploadText}>Select Images</Text>
                    </TouchableOpacity>
                    {images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                            {images.map((uri, i) => (
                                <View key={i} style={styles.imgBox}>
                                    <Image source={{ uri }} style={styles.img} />
                                    <TouchableOpacity
                                        style={styles.imgRemove}
                                        onPress={() => setImages(images.filter((_, idx) => idx !== i))}
                                    >
                                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* PDF */}
                <View style={styles.field}>
                    <Text style={styles.label}>Product Manual (PDF)</Text>
                    <TouchableOpacity style={styles.uploadBtn} onPress={pickPDF}>
                        <Ionicons name="document-outline" size={22} color="#3B82F6" />
                        <Text style={styles.uploadText}>Select PDF</Text>
                    </TouchableOpacity>
                    {pdf && (
                        <View style={styles.pdfBox}>
                            <Ionicons name="document-text" size={36} color="#3B82F6" />
                            <View style={styles.pdfInfo}>
                                <Text style={styles.pdfName}>{pdf.name}</Text>
                                <Text style={styles.pdfSize}>{(pdf.size / 1024).toFixed(2)} KB</Text>
                            </View>
                            <TouchableOpacity onPress={() => setPdf(null)}>
                                <Ionicons name="trash-outline" size={22} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* Email */}
                <InputField
                    label="Email *"
                    value={form.email}
                    onChange={(v: string) => handleChange('email', v)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    placeholder="example@domain.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                />

                {/* Phone */}
                <InputField
                    label="Phone Number *"
                    value={form.phoneNumber}
                    onChange={(v: string) => handleChange('phoneNumber', v.replace(/[^0-9]/g, ''))}
                    onBlur={() => handleBlur('phoneNumber')}
                    error={errors.phoneNumber}
                    placeholder="10-digit mobile number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    icon={<Ionicons name="call-outline" size={20} color="#9CA3AF" />}
                />

                {/* Pincode */}
                <InputField
                    label="Pincode *"
                    value={form.pincode}
                    onChange={(v: string) => handleChange('pincode', v.replace(/[^0-9]/g, ''))}
                    onBlur={() => handleBlur('pincode')}
                    error={errors.pincode}
                    placeholder="6-digit pincode"
                    keyboardType="numeric"
                    maxLength={6}
                    icon={<Ionicons name="location-outline" size={20} color="#9CA3AF" />}
                />

                {/* GST */}
                <InputField
                    label="GST Number *"
                    value={form.gstNumber}
                    onChange={(v: string) => handleChange('gstNumber', v.toUpperCase())}
                    // onBlur={() => handleBlur('gstNumber')}
                    error={errors.gstNumber}
                    placeholder="22AAAAA0000A1Z5"
                    autoCapitalize="characters"
                    maxLength={15}
                    icon={<Ionicons name="business-outline" size={20} color="#9CA3AF" />}
                />

                {/* Website */}
                <InputField
                    label="Website"
                    value={form.website}
                    onChange={(v: string) => handleChange('website', v)}
                    onBlur={() => handleBlur('website')}
                    error={errors.website}
                    placeholder="https://example.com"
                    keyboardType="url"
                    autoCapitalize="none"
                    icon={<Ionicons name="globe-outline" size={20} color="#9CA3AF" />}
                />

                {/* Country */}
                <Dropdown
                    label="Country *"
                    value={form.country}
                    options={COUNTRIES}
                    onSelect={(v: string) => handleChange('country', v)}
                    error={errors.country}
                    show={showCountry}
                    setShow={setShowCountry}
                />

                {/* Password */}
                <InputField
                    label="Password *"
                    value={form.password}
                    onChange={(v: string) => handleChange('password', v)}
                    onBlur={() => handleBlur('password')}
                    error={errors.password}
                    placeholder="Minimum 8 characters"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    icon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    }
                />

                {/* Confirm Password */}
                <InputField
                    label="Confirm Password *"
                    value={form.confirmPassword}
                    onChange={(v: string) => handleChange('confirmPassword', v)}
                    onBlur={() => handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    placeholder="Re-enter password"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    icon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    }
                />

                {/* Terms */}
                <View style={styles.terms}>
                    <Checkbox
                        value={termsAccepted}
                        onValueChange={setTermsAccepted}
                        color="#3B82F6"
                    />
                    <Text style={styles.termsText}>
                        I agree to Terms and Privacy Policy
                    </Text>
                </View>


                {/* Submit */}
                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.submitText}>Submit Form</Text>
                            <Ionicons name="checkmark-circle" size={22} color="white" />
                        </>
                    )}
                </TouchableOpacity>

                {/* Reset */}
                <TouchableOpacity style={styles.resetBtn} onPress={reset} disabled={loading}>
                    <Ionicons name="refresh-outline" size={20} color="#EF4444" />
                    <Text style={styles.resetText}>Reset Form</Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccess}
                onClose={reset}
                productName={form.productName}
                email={form.email}
            />
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    /* =========================
       Layout
    ========================= */
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },

    /* =========================
       Header
    ========================= */
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 20,
    },
    headerIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,

        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },

    /* =========================
       Card
    ========================= */
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },

    /* =========================
       Form Fields
    ========================= */
    field: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 14,
        minHeight: 52,
    },
    inputBoxMulti: {
        minHeight: 120,
        alignItems: 'flex-start',
        paddingTop: 14,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 12,
    },
    inputMulti: {
        textAlignVertical: 'top',
        paddingTop: 0,
    },
    icon: {
        marginRight: 10,
    },
    iconTop: {
        marginRight: 10,
        paddingTop: 2,
    },
    eyeBtn: {
        padding: 8,
    },

    /* =========================
       Errors
    ========================= */
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        flex: 1,
    },

    /* =========================
       Row Layout
    ========================= */
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    half: {
        flex: 1,
    },

    /* =========================
       Dropdown
    ========================= */
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 52,
    },
    dropdownError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    dropdownValue: {
        fontSize: 16,
        color: '#1F2937',
        flex: 1,
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: '#9CA3AF',
        flex: 1,
    },

    /* =========================
       Modal
    ========================= */
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20,
    },
    modalBox: {
        backgroundColor: 'white',
        borderRadius: 20,
        maxHeight: '70%',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    modalItemText: {
        fontSize: 16,
        color: '#374151',
    },


    conditionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    conditionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 6,
        flex: 1,
        minWidth: '48%',
    },
    conditionBtnActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    conditionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    conditionTextActive: {
        color: 'white',
    },

    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: '#3B82F6',
        borderStyle: 'dashed',
        borderRadius: 12,
        paddingVertical: 16,
        gap: 10,
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B82F6',
    },


    imgBox: {
        position: 'relative',
        marginRight: 12,
    },
    img: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    imgRemove: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'white',
        borderRadius: 12,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },


    pdfBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        gap: 12,
    },
    pdfInfo: {
        flex: 1,
    },
    pdfName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
    pdfSize: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
    },


    terms: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    termsText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },

    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        gap: 10,

        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    submitBtnDisabled: {
        backgroundColor: '#93C5FD',
        opacity: 0.7,
    },
    submitText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    resetBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 12,
        borderWidth: 2,
        borderColor: '#EF4444',
        gap: 8,
    },
    resetText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EF4444',
    },


    successBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    successBox: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 15,
    },
    successIcon: {
        marginBottom: 24,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#10B981',
        marginBottom: 8,
    },
    successSubtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    successMsg: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    successInfo: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
    },
    successRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    successText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        flex: 1,
    },
    successBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        gap: 10,

        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    successBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
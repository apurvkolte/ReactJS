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
import { Ionicons } from '@expo/vector-icons';

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

export default InputField

const styles = StyleSheet.create({
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
});

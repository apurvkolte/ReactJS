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

export default SuccessModal

const styles = StyleSheet.create({
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

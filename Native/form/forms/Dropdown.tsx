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

export default Dropdown

const styles = StyleSheet.create({
    /* =========================
       Form Field
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
});

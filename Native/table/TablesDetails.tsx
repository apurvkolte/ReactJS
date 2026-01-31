import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Share,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Types
interface DataItem {
    id: number;
    name: string;
    email: string;
    age: number;
    city: string;
    country: string;
    job: string;
    salary: number;
    department: string;
    status: 'Active' | 'Inactive' | 'On Leave';
    phone: string;
    start_date: string;
    experience: number;
    skills: string;
    projects: number;
    manager: string;
    rating: number;
    [key: string]: string | number;
}

type RootStackParamList = {
    ShowTablesDetails: { item: DataItem };
};

type TablesDetailsRouteProp =
    RouteProp<RootStackParamList, 'ShowTablesDetails'>;

type TablesDetailsNavigationProp =
    StackNavigationProp<RootStackParamList, 'ShowTablesDetails'>;

const TablesDetails = () => {
    const navigation = useNavigation<TablesDetailsNavigationProp>();
    const route = useRoute<TablesDetailsRouteProp>();

    const item = route.params?.item;

    // Status badge colors
    const statusColors = {
        'Active': '#10B981',
        'Inactive': '#EF4444',
        'On Leave': '#F59E0B',
    };

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        return () => {
            StatusBar.setBarStyle('dark-content');
        };
    }, []);

    const handleShare = async () => {
        try {
            const message = `
📋 Employee Profile Summary:

👤 ${item.name}
📧 ${item.email}
📱 ${item.phone}

💼 ${item.job}
🏢 ${item.department}
📍 ${item.city}, ${item.country}

💰 Salary: $${item.salary.toLocaleString()}
⭐ Rating: ${item.rating}/5
📅 Started: ${formatDate(item.start_date)}
🎯 Experience: ${item.experience} years
🔧 Skills: ${item.skills}

Status: ${item.status}
            `;

            await Share.share({
                message,
                title: `${item.name}'s Profile`,
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share profile');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleCall = () => {
        Alert.alert('Call', `Calling ${item.phone}...`);
    };

    const handleEmail = () => {
        Alert.alert('Email', `Opening email client for ${item.email}...`);
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            {/* <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Tables Details</Text>
                        <Text style={styles.headerSubtitle}>Complete profile information</Text>
                    </View>

                    <TouchableOpacity style={styles.headerActionBtn} onPress={handleShare}>
                        <Ionicons name="share-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View> */}

            {/* Main Content - ALL IN ONE SINGLE BOX */}
            <View style={styles.mainContainer}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarGradient}>
                            <Text style={styles.avatarText}>
                                {item.name.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                        {item.status === 'Active' && (
                            <View style={styles.onlineIndicator} />
                        )}
                    </View>

                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{item.name}</Text>
                        <Text style={styles.profileJob}>{item.job} • {item.department}</Text>
                        <View style={styles.statusContainer}>
                            <View style={[
                                styles.statusBadge,
                                { backgroundColor: statusColors[item.status] + '20' }
                            ]}>
                                <View style={[styles.statusDot, { backgroundColor: statusColors[item.status] }]} />
                                <Text style={[
                                    styles.statusText,
                                    { color: statusColors[item.status] }
                                ]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>

                    <View style={styles.contactGrid}>
                        <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                            <View style={styles.contactIcon}>
                                <Ionicons name="mail-outline" size={20} color="#007AFF" />
                            </View>
                            <View style={styles.contactContent}>
                                <Text style={styles.contactLabel}>Email</Text>
                                <Text style={styles.contactValue}>{item.email}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
                            <View style={styles.contactIcon}>
                                <Ionicons name="call-outline" size={20} color="#007AFF" />
                            </View>
                            <View style={styles.contactContent}>
                                <Text style={styles.contactLabel}>Phone</Text>
                                <Text style={styles.contactValue}>{item.phone}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.contactItem}>
                            <View style={styles.contactIcon}>
                                <Ionicons name="location-outline" size={20} color="#007AFF" />
                            </View>
                            <View style={styles.contactContent}>
                                <Text style={styles.contactLabel}>Location</Text>
                                <Text style={styles.contactValue}>{item.city}, {item.country}</Text>
                            </View>
                        </View>

                        <View style={styles.contactItem}>
                            <View style={styles.contactIcon}>
                                <Ionicons name="person-outline" size={20} color="#007AFF" />
                            </View>
                            <View style={styles.contactContent}>
                                <Text style={styles.contactLabel}>Manager</Text>
                                <Text style={styles.contactValue}>{item.manager}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Personal & Professional Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal & Professional Details</Text>

                    <View style={styles.detailsGrid}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="calendar-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Age</Text>
                                <Text style={styles.detailValue}>{item.age} years</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="briefcase-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Experience</Text>
                                <Text style={styles.detailValue}>{item.experience} years</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="time-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Start Date</Text>
                                <Text style={styles.detailValue}>{formatDate(item.start_date)}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="id-card-outline" size={18} color="#101011ff" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Employee ID</Text>
                                <Text style={styles.detailValue}>EMP{item.id.toString().padStart(6, '0')}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="cash-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Salary</Text>
                                <Text style={styles.detailValue}>${item.salary.toLocaleString()}</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="star-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Rating</Text>
                                <Text style={styles.detailValue}>{item.rating}/5</Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="grid-outline" size={18} color="#64748b" />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Projects</Text>
                                <Text style={styles.detailValue}>{item.projects} completed</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Skills */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills & Expertise</Text>

                    <View style={styles.skillsContainer}>
                        {item.skills.split(',').map((skill, index) => (
                            <View key={index} style={styles.skillTag}>
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                <Text style={styles.skillText}>{skill.trim()}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        backgroundColor: '#007AFF',
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 4,
    },
    headerActionBtn: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
    },
    mainContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        // marginTop: -25,
        borderRadius: 25,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 30,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 20,
    },
    avatarGradient: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 4,
    },
    profileJob: {
        fontSize: 15,
        color: '#64748b',
        marginBottom: 12,
        fontWeight: '500',
    },
    statusContainer: {
        flexDirection: 'row',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
    },
    section: {
        marginBottom: 25,
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 20,
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 100) / 2,
    },
    contactIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f0f9ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contactContent: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 100) / 2,
        paddingVertical: 8,
    },
    detailIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    skillTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0f2fe',
        gap: 8,
    },
    skillText: {
        fontSize: 14,
        color: '#0369a1',
        fontWeight: '600',
    },
});

export default TablesDetails;
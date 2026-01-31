import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    RefreshControl,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

type SortField = 'name' | 'salary' | 'department' | 'rating' | 'experience' | 'start_date' | 'age' | 'projects' | null;
type SortDirection = 'asc' | 'desc';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const TablesScreen = () => {
    // State Management
    const [originalData, setOriginalData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [displayData, setDisplayData] = useState<DataItem[]>([]);

    // Search and Filter States
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [selectedCity, setSelectedCity] = useState<string>('All');
    const [selectedJob, setSelectedJob] = useState<string>('All');
    const [minSalary, setMinSalary] = useState<string>('');
    const [maxSalary, setMaxSalary] = useState<string>('');
    const [minRating, setMinRating] = useState<string>('');
    const [maxRating, setMaxRating] = useState<string>('');

    // Sort State
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState<DataItem | null>(null);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

    const listRef = useRef<FlatList>(null);
    type RootStackParamList = {
        Tables: undefined;
        showTablesDetailsScreen: { item: DataItem };
    };

    type TablesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tables'>;
    const navigation = useNavigation<TablesScreenNavigationProp>();


    // Status badges configuration
    const statusColors = {
        'Active': '#10B981',
        'Inactive': '#EF4444',
        'On Leave': '#F59E0B',
    };

    // Available departments (will be populated from data)
    const [departments, setDepartments] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [jobs, setJobs] = useState<string[]>([]);

    // Generate dummy data
    const generateDummyData = (count: number) => {
        const data: DataItem[] = [];
        const names = ['John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson', 'Lisa Miller'];
        const citiesList = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Berlin'];
        const countries = ['USA', 'UK', 'Japan', 'France', 'Australia', 'Germany'];
        const jobsList = ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Analyst', 'DevOps Engineer'];
        const departmentsList = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR'];
        const managers = ['Alex Turner', 'Maria Garcia', 'David Kim', 'Sarah Chen'];
        const skillsList = ['React,Node.js', 'Python,SQL', 'Java,Spring', 'AWS,Docker'];

        for (let i = 1; i <= count; i++) {
            data.push({
                id: i,
                name: names[Math.floor(Math.random() * names.length)],
                email: `user${i}@company.com`,
                age: Math.floor(Math.random() * 30) + 25,
                city: citiesList[Math.floor(Math.random() * citiesList.length)],
                country: countries[Math.floor(Math.random() * countries.length)],
                job: jobsList[Math.floor(Math.random() * jobsList.length)],
                salary: Math.floor(Math.random() * 80000) + 50000,
                department: departmentsList[Math.floor(Math.random() * departmentsList.length)],
                status: ['Active', 'Inactive', 'On Leave'][Math.floor(Math.random() * 3)] as 'Active' | 'Inactive' | 'On Leave',
                phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000)}`,
                start_date: `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                experience: Math.floor(Math.random() * 15) + 1,
                skills: skillsList[Math.floor(Math.random() * skillsList.length)],
                projects: Math.floor(Math.random() * 15) + 1,
                manager: managers[Math.floor(Math.random() * managers.length)],
                rating: parseFloat((Math.random() * 4 + 1).toFixed(1))
            });
        }
        return data;
    };

    // Initialize data
    useEffect(() => {
        loadData();
    }, []);

    // Load data function
    const loadData = () => {
        setIsLoading(true);
        setTimeout(() => {
            const generatedData = generateDummyData(150);
            setOriginalData(generatedData);

            // Extract unique values for filters
            const uniqueDepts = Array.from(new Set(generatedData.map(item => item.department)));
            const uniqueCities = Array.from(new Set(generatedData.map(item => item.city)));
            const uniqueJobs = Array.from(new Set(generatedData.map(item => item.job)));

            setDepartments(uniqueDepts);
            setCities(uniqueCities);
            setJobs(uniqueJobs);

            setIsLoading(false);
        }, 1000);
    };

    // Apply filters, sorting, and pagination
    useEffect(() => {
        let result = [...originalData];

        // Apply search filter
        if (searchText.trim()) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Apply status filter
        if (selectedStatus !== 'All') {
            result = result.filter(item => item.status === selectedStatus);
        }

        // Apply department filter
        if (selectedDepartment !== 'All') {
            result = result.filter(item => item.department === selectedDepartment);
        }

        // Apply city filter
        if (selectedCity !== 'All') {
            result = result.filter(item => item.city === selectedCity);
        }

        // Apply job filter
        if (selectedJob !== 'All') {
            result = result.filter(item => item.job === selectedJob);
        }

        // Apply salary range filter
        if (minSalary) {
            const min = parseInt(minSalary) || 0;
            result = result.filter(item => item.salary >= min);
        }

        if (maxSalary) {
            const max = parseInt(maxSalary) || Infinity;
            result = result.filter(item => item.salary <= max);
        }

        // Apply rating range filter
        if (minRating) {
            const min = parseFloat(minRating) || 0;
            result = result.filter(item => item.rating >= min);
        }

        if (maxRating) {
            const max = parseFloat(maxRating) || 5;
            result = result.filter(item => item.rating <= max);
        }

        // Apply sorting - FIXED: Apply sorting BEFORE pagination
        if (sortField) {
            result.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }

                const aStr = String(aVal || '');
                const bStr = String(bVal || '');
                return sortDirection === 'asc'
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            });
        }

        // Update filtered data
        setFilteredData(result);

        // Reset to page 1 when filters or sort change
        setCurrentPage(1);

        // Calculate active filters count
        let count = 0;
        if (selectedStatus !== 'All') count++;
        if (selectedDepartment !== 'All') count++;
        if (selectedCity !== 'All') count++;
        if (selectedJob !== 'All') count++;
        if (minSalary) count++;
        if (maxSalary) count++;
        if (minRating) count++;
        if (maxRating) count++;
        setActiveFiltersCount(count);

    }, [originalData, searchText, selectedStatus, selectedDepartment, selectedCity, selectedJob,
        minSalary, maxSalary, minRating, maxRating, sortField, sortDirection]);

    // Update display data when filtered data or pagination changes
    useEffect(() => {
        // Calculate total pages
        const total = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
        setTotalPages(total);

        // Ensure current page is valid
        const validCurrentPage = Math.min(Math.max(1, currentPage), total);
        if (currentPage !== validCurrentPage) {
            setCurrentPage(validCurrentPage);
            return;
        }

        // Get current page data
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setDisplayData(filteredData.slice(startIndex, endIndex));
    }, [filteredData, currentPage, itemsPerPage]);

    // Handle sort - FIXED
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Set new field with default ascending
            setSortField(field);
            setSortDirection('asc');
        }
        setShowSortModal(false);
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);

            requestAnimationFrame(() => {
                listRef.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                });
            });
        }
    };


    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Reset all filters
    const resetAllFilters = () => {
        setSearchText('');
        setSelectedStatus('All');
        setSelectedDepartment('All');
        setSelectedCity('All');
        setSelectedJob('All');
        setMinSalary('');
        setMaxSalary('');
        setMinRating('');
        setMaxRating('');
        setSortField(null);
        setSortDirection('asc');
        setCurrentPage(1);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (size: number) => {
        setItemsPerPage(size);
        setCurrentPage(1);
        setShowPageSizeDropdown(false);
    };

    // Handlers for actions
    const handleEdit = (item: DataItem) => {
        Alert.alert('Edit', `Edit ${item.name}'s record`);
    };

    const handleDelete = (item: DataItem) => {
        setSelectedRow(item);
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (selectedRow) {
            setOriginalData(prev => prev.filter(item => item.id !== selectedRow.id));
            Alert.alert('Success', 'Record deleted successfully');
        }
        setDeleteModalVisible(false);
    };

    // const viewDetails = (item: DataItem) => {
    //     Alert.alert(
    //         'Details',
    //         `Name: ${item.name}\nEmail: ${item.email}\nDepartment: ${item.department}\nStatus: ${item.status}\nSalary: $${item.salary.toLocaleString()}\nExperience: ${item.experience}y\nRating: ${item.rating}/5`,
    //         [{ text: 'OK' }]
    //     );
    // };

    const viewDetails = (item: DataItem) => {
        navigation.navigate('showTablesDetailsScreen', {
            item,
        });
    };

    // Render card
    const renderCard = ({ item, index }: { item: DataItem; index: number }) => (
        <TouchableOpacity
            style={[styles.card, index % 2 === 0 ? styles.cardEven : styles.cardOdd]}
            onPress={() => viewDetails(item)}
            activeOpacity={0.9}
        >
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={styles.nameSection}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.job}>{item.job}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
                    <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            {/* Card Info */}
            <View style={styles.cardInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="business-outline" size={16} color="#64748b" />
                    <Text style={styles.infoText}>{item.department}</Text>
                    <Ionicons name="location-outline" size={16} color="#64748b" style={styles.iconSpacing} />
                    <Text style={styles.infoText}>{item.city}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={16} color="#64748b" />
                    <Text style={styles.infoText}>${item.salary.toLocaleString()}</Text>
                    <Ionicons name="star-outline" size={16} color="#64748b" style={styles.iconSpacing} />
                    <Text style={styles.infoText}>{item.rating}/5</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                    <Text style={styles.infoText}>{item.start_date}</Text>
                    <Ionicons name="briefcase-outline" size={16} color="#64748b" style={styles.iconSpacing} />
                    <Text style={styles.infoText}>{item.experience}y exp</Text>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.age}</Text>
                    <Text style={styles.statLabel}>Age</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.projects}</Text>
                    <Text style={styles.statLabel}>Projects</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>{item.skills.split(',').length}</Text>
                    <Text style={styles.statLabel}>Skills</Text>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionBtn, styles.viewBtn]}
                    onPress={(e) => {
                        e.stopPropagation();
                        viewDetails(item); // This will navigate to TablesDetails
                    }}
                >
                    <Ionicons name="eye-outline" size={18} color="#007AFF" />
                    <Text style={[styles.actionText, { color: '#007AFF' }]}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.editBtn]}
                    onPress={(e) => { e.stopPropagation(); handleEdit(item); }}
                >
                    <Ionicons name="create-outline" size={18} color="#4CAF50" />
                    <Text style={[styles.actionText, { color: '#4CAF50' }]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, styles.deleteBtn]}
                    onPress={(e) => { e.stopPropagation(); handleDelete(item); }}
                >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // Render filter modal
    const renderFilterModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showFilterModal}
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.filterModal}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                            <Ionicons name="close" size={24} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.filterContent}>
                        {/* Status Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Status</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.filterChips}>
                                    {['All', 'Active', 'Inactive', 'On Leave'].map(status => (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.filterChip,
                                                selectedStatus === status && styles.filterChipActive
                                            ]}
                                            onPress={() => setSelectedStatus(status)}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                selectedStatus === status && styles.filterChipTextActive
                                            ]}>
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Department Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Department</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.filterChips}>
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            selectedDepartment === 'All' && styles.filterChipActive
                                        ]}
                                        onPress={() => setSelectedDepartment('All')}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            selectedDepartment === 'All' && styles.filterChipTextActive
                                        ]}>
                                            All
                                        </Text>
                                    </TouchableOpacity>
                                    {departments.map(dept => (
                                        <TouchableOpacity
                                            key={dept}
                                            style={[
                                                styles.filterChip,
                                                selectedDepartment === dept && styles.filterChipActive
                                            ]}
                                            onPress={() => setSelectedDepartment(dept)}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                selectedDepartment === dept && styles.filterChipTextActive
                                            ]}>
                                                {dept}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* City Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>City</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.filterChips}>
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            selectedCity === 'All' && styles.filterChipActive
                                        ]}
                                        onPress={() => setSelectedCity('All')}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            selectedCity === 'All' && styles.filterChipTextActive
                                        ]}>
                                            All
                                        </Text>
                                    </TouchableOpacity>
                                    {cities.map(city => (
                                        <TouchableOpacity
                                            key={city}
                                            style={[
                                                styles.filterChip,
                                                selectedCity === city && styles.filterChipActive
                                            ]}
                                            onPress={() => setSelectedCity(city)}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                selectedCity === city && styles.filterChipTextActive
                                            ]}>
                                                {city}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Job Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Job Title</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.filterChips}>
                                    <TouchableOpacity
                                        style={[
                                            styles.filterChip,
                                            selectedJob === 'All' && styles.filterChipActive
                                        ]}
                                        onPress={() => setSelectedJob('All')}
                                    >
                                        <Text style={[
                                            styles.filterChipText,
                                            selectedJob === 'All' && styles.filterChipTextActive
                                        ]}>
                                            All
                                        </Text>
                                    </TouchableOpacity>
                                    {jobs.map(job => (
                                        <TouchableOpacity
                                            key={job}
                                            style={[
                                                styles.filterChip,
                                                selectedJob === job && styles.filterChipActive
                                            ]}
                                            onPress={() => setSelectedJob(job)}
                                        >
                                            <Text style={[
                                                styles.filterChipText,
                                                selectedJob === job && styles.filterChipTextActive
                                            ]}>
                                                {job}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Salary Range */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Salary Range ($)</Text>
                            <View style={styles.rangeContainer}>
                                <View style={styles.rangeInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Min"
                                        value={minSalary}
                                        onChangeText={setMinSalary}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text style={styles.rangeSeparator}>to</Text>
                                <View style={styles.rangeInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Max"
                                        value={maxSalary}
                                        onChangeText={setMaxSalary}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Rating Range */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Rating Range (1-5)</Text>
                            <View style={styles.rangeContainer}>
                                <View style={styles.rangeInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Min"
                                        value={minRating}
                                        onChangeText={setMinRating}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <Text style={styles.rangeSeparator}>to</Text>
                                <View style={styles.rangeInput}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Max"
                                        value={maxRating}
                                        onChangeText={setMaxRating}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.filterFooter}>
                        <TouchableOpacity
                            style={styles.resetBtn}
                            onPress={resetAllFilters}
                        >
                            <Text style={styles.resetBtnText}>Reset All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.applyBtn}
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Text style={styles.applyBtnText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    // Render sort modal
    const renderSortModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showSortModal}
            onRequestClose={() => setShowSortModal(false)}
        >
            <TouchableWithoutFeedback onPress={() => setShowSortModal(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.sortModal}>
                            <Text style={styles.sortModalTitle}>Sort By</Text>

                            {[
                                { field: 'name', label: 'Name' },
                                { field: 'salary', label: 'Salary' },
                                { field: 'department', label: 'Department' },
                                { field: 'rating', label: 'Rating' },
                                { field: 'experience', label: 'Experience' },
                                { field: 'start_date', label: 'Start Date' },
                                { field: 'age', label: 'Age' },
                                { field: 'projects', label: 'Projects' },
                            ].map(({ field, label }) => (
                                <TouchableOpacity
                                    key={field}
                                    style={styles.sortOption}
                                    onPress={() => handleSort(field as SortField)}
                                >
                                    <Text style={styles.sortOptionText}>{label}</Text>
                                    {sortField === field && (
                                        <Ionicons
                                            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                            size={20}
                                            color="#007AFF"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}

                            {sortField && (
                                <TouchableOpacity
                                    style={styles.clearSortBtn}
                                    onPress={() => {
                                        setSortField(null);
                                        setSortDirection('asc');
                                    }}
                                >
                                    <Text style={styles.clearSortBtnText}>Clear Sort</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

    // Render pagination with dropdown on right side
    const renderPagination = () => {
        const pageNumbers = getPageNumbers();

        return (
            <View style={styles.pagination}>
                <TouchableOpacity
                    style={[styles.pageBtn, currentPage === 1 && styles.disabledBtn]}
                    onPress={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#ccc' : '#007AFF'} />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.pageNumbers}
                    contentContainerStyle={styles.pageNumbersContent}
                >
                    {pageNumbers.map((page, index) => (
                        page === '...' ? (
                            <Text key={`dots-${index}`} style={styles.pageDots}>...</Text>
                        ) : (
                            <TouchableOpacity
                                key={page}
                                style={[
                                    styles.pageNumberBtn,
                                    currentPage === page && styles.activePageBtn
                                ]}
                                onPress={() => handlePageChange(page as number)}
                            >
                                <Text style={[
                                    styles.pageNumberText,
                                    currentPage === page && styles.activePageText
                                ]}>
                                    {page}
                                </Text>
                            </TouchableOpacity>
                        )
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={[styles.pageBtn, currentPage === totalPages && styles.disabledBtn]}
                    onPress={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#ccc' : '#007AFF'} />
                </TouchableOpacity>

                {/* Items per page dropdown on the right */}
                <View style={styles.pageSizeContainer}>
                    <Text style={styles.pageSizeLabel}>Show:</Text>
                    <View style={styles.pageSizeDropdownWrapper}>
                        <TouchableOpacity
                            style={styles.pageSizeDropdown}
                            onPress={() => setShowPageSizeDropdown(!showPageSizeDropdown)}
                        >
                            <Text style={styles.pageSizeDropdownText}>{itemsPerPage}</Text>
                            <Ionicons
                                name={showPageSizeDropdown ? "chevron-up" : "chevron-down"}
                                size={16}
                                color="#64748b"
                            />
                        </TouchableOpacity>

                        {showPageSizeDropdown && (
                            <View style={styles.pageSizeOptions}>
                                {[10, 20, 30, 50, 100].map(size => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.pageSizeOption,
                                            itemsPerPage === size && styles.pageSizeOptionActive
                                        ]}
                                        onPress={() => handleItemsPerPageChange(size)}
                                    >
                                        <Text style={[
                                            styles.pageSizeOptionText,
                                            itemsPerPage === size && styles.pageSizeOptionTextActive
                                        ]}>
                                            {size}
                                        </Text>
                                        {itemsPerPage === size && (
                                            <Ionicons name="checkmark" size={16} color="#007AFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Data Records</Text>
            </View>

            {/* Search and Controls */}
            <View style={styles.controls}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#64748b" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search all fields..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText ? (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#64748b" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View style={styles.controlButtons}>
                    <TouchableOpacity
                        style={styles.controlBtn}
                        onPress={() => setShowFilterModal(true)}
                    >
                        <Ionicons name="filter" size={22} color="#007AFF" />
                        {activeFiltersCount > 0 && (
                            <View style={styles.filterCountBadge}>
                                <Text style={styles.filterCountText}>{activeFiltersCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlBtn}
                        onPress={() => setShowSortModal(true)}
                    >
                        <Ionicons name="swap-vertical" size={22} color="#007AFF" />
                        {sortField && (
                            <View style={styles.sortIndicator} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.controlBtn}
                        onPress={resetAllFilters}
                    >
                        <Ionicons name="refresh" size={22} color="#64748b" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <View style={styles.activeFilters}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.activeFiltersContent}>
                            <Text style={styles.activeFiltersLabel}>Filters:</Text>
                            {selectedStatus !== 'All' && (
                                <View style={styles.activeFilterTag}>
                                    <Text style={styles.activeFilterTagText}>Status: {selectedStatus}</Text>
                                    <TouchableOpacity onPress={() => setSelectedStatus('All')}>
                                        <Ionicons name="close" size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {selectedDepartment !== 'All' && (
                                <View style={styles.activeFilterTag}>
                                    <Text style={styles.activeFilterTagText}>Dept: {selectedDepartment}</Text>
                                    <TouchableOpacity onPress={() => setSelectedDepartment('All')}>
                                        <Ionicons name="close" size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {selectedCity !== 'All' && (
                                <View style={styles.activeFilterTag}>
                                    <Text style={styles.activeFilterTagText}>City: {selectedCity}</Text>
                                    <TouchableOpacity onPress={() => setSelectedCity('All')}>
                                        <Ionicons name="close" size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {minSalary && (
                                <View style={styles.activeFilterTag}>
                                    <Text style={styles.activeFilterTagText}>Min Salary: ${minSalary}</Text>
                                    <TouchableOpacity onPress={() => setMinSalary('')}>
                                        <Ionicons name="close" size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            )}
                            {maxSalary && (
                                <View style={styles.activeFilterTag}>
                                    <Text style={styles.activeFilterTagText}>Max Salary: ${maxSalary}</Text>
                                    <TouchableOpacity onPress={() => setMaxSalary('')}>
                                        <Ionicons name="close" size={14} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Current Sort */}
            {sortField && (
                <View style={styles.sortInfo}>
                    <Text style={styles.sortInfoText}>
                        Sorted by: {sortField} ({sortDirection === 'asc' ? 'A-Z' : 'Z-A'})
                    </Text>
                </View>
            )}

            {/* Cards List */}
            <FlatList
                ref={listRef}
                data={displayData}
                renderItem={renderCard}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={60} color="#cbd5e1" />
                        <Text style={styles.emptyText}>No records found</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText || activeFiltersCount > 0
                                ? 'Try adjusting your search or filters'
                                : 'No data available'}
                        </Text>
                        {(searchText || activeFiltersCount > 0) && (
                            <TouchableOpacity
                                style={styles.resetBtn}
                                onPress={resetAllFilters}
                            >
                                <Text style={styles.resetBtnText}>Reset All</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />

            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
                <View style={styles.paginationContainer}>
                    {renderPagination()}

                </View>
            )}

            {/* Modals */}
            {renderFilterModal()}
            {renderSortModal()}

            {/* Delete Modal */}
            <Modal
                transparent={true}
                visible={deleteModalVisible}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.deleteModal}>
                        <Ionicons name="warning-outline" size={50} color="#EF4444" />
                        <Text style={styles.deleteModalTitle}>Delete Record</Text>
                        <Text style={styles.deleteModalText}>
                            Are you sure you want to delete {selectedRow?.name}'s record?
                        </Text>
                        <View style={styles.deleteModalActions}>
                            <TouchableOpacity
                                style={styles.cancelDeleteBtn}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.cancelDeleteText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmDeleteBtn}
                                onPress={confirmDelete}
                            >
                                <Text style={styles.confirmDeleteText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        paddingTop: 30,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    controls: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        padding: 8,
        fontSize: 16,
        color: '#334155',
    },
    controlButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlBtn: {
        padding: 8,
        marginLeft: 8,
        position: 'relative',
    },
    filterCountBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: '#EF4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterCountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sortIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#007AFF',
    },
    activeFilters: {
        backgroundColor: '#f0f9ff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0f2fe',
    },
    activeFiltersContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeFiltersLabel: {
        fontSize: 14,
        color: '#0369a1',
        fontWeight: '600',
        marginRight: 8,
    },
    activeFilterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
    },
    activeFilterTagText: {
        fontSize: 12,
        color: '#0369a1',
        marginRight: 4,
    },
    sortInfo: {
        backgroundColor: '#fef3c7',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#fde68a',
    },
    sortInfoText: {
        fontSize: 14,
        color: '#92400e',
        fontWeight: '500',
    },
    listContent: {
        padding: 12,
        paddingBottom: 120,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardEven: {
        backgroundColor: '#fff',
    },
    cardOdd: {
        backgroundColor: '#fafafa',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    nameSection: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 2,
    },
    job: {
        fontSize: 14,
        color: '#64748b',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    cardInfo: {
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        fontSize: 14,
        color: '#475569',
        marginLeft: 8,
        marginRight: 16,
    },
    iconSpacing: {
        marginLeft: 16,
    },
    quickStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    viewBtn: {
        backgroundColor: '#eff6ff',
    },
    editBtn: {
        backgroundColor: '#f0fdf4',
    },
    deleteBtn: {
        backgroundColor: '#fef2f2',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 6,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
    },
    filterModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    filterContent: {
        paddingHorizontal: 20,
        maxHeight: '70%',
    },
    filterSection: {
        marginTop: 16,
        marginBottom: 8,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    filterChips: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#007AFF',
    },
    filterChipText: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    rangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rangeInput: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    input: {
        padding: 10,
        fontSize: 16,
        color: '#334155',
    },
    rangeSeparator: {
        marginHorizontal: 12,
        color: '#64748b',
    },
    filterFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    resetBtn: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 12,
    },
    resetBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
    applyBtn: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    applyBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    sortModal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        maxWidth: 300,
        alignSelf: 'center',
    },
    sortModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
        textAlign: 'center',
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    sortOptionText: {
        fontSize: 16,
        color: '#334155',
    },
    clearSortBtn: {
        marginTop: 20,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
    },
    clearSortBtnText: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
    },
    paginationContainer: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        marginBottom: 8,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    pageBtn: {
        padding: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    pageNumbers: {
        flex: 1,
        marginHorizontal: 12,
        maxWidth: SCREEN_WIDTH * 0.5,
    },
    pageNumbersContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageNumberBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginHorizontal: 4,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
    },
    activePageBtn: {
        backgroundColor: '#007AFF',
    },
    pageNumberText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    activePageText: {
        color: '#fff',
    },
    pageDots: {
        fontSize: 14,
        color: '#94a3b8',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    pageSizeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    pageSizeLabel: {
        fontSize: 14,
        color: '#64748b',
        marginRight: 8,
    },
    pageSizeDropdownWrapper: {
        position: 'relative',
    },
    pageSizeDropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 60,
        justifyContent: 'space-between',
    },
    pageSizeDropdownText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    pageSizeOptions: {
        position: 'absolute',
        bottom: '100%',   // ⬆️ open upward
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 8,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 6,
        minWidth: 100,
        zIndex: 9999,
    },

    pageSizeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    pageSizeOptionActive: {
        backgroundColor: '#f0f9ff',
    },
    pageSizeOptionText: {
        fontSize: 14,
        color: '#475569',
    },
    pageSizeOptionTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    deleteModal: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        margin: 20,
        alignItems: 'center',
    },
    deleteModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#dc2626',
        marginTop: 12,
        marginBottom: 8,
    },
    deleteModalText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    deleteModalActions: {
        flexDirection: 'row',
        width: '100%',
    },
    cancelDeleteBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        alignItems: 'center',
        marginRight: 12,
    },
    cancelDeleteText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#475569',
    },
    confirmDeleteBtn: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#dc2626',
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmDeleteText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default TablesScreen;
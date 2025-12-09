import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BorderRadius, Colors, Gradients, Spacing } from '@/constants/theme';
import { ImageValidationService } from '@/utils/imageValidation';
import { formatPhoneNumber, validatePhoneNumber } from '@/utils/validation';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export interface ListingFormData {
    title: string;
    bhkType: string;
    price: string;
    street: string;
    ownerName: string;
    ownerContact: string;
    roomType: 'private' | 'shared';
    images: string[];
    amenities: string[];
    houseRules: string;
}

interface ListingFormProps {
    initialValues?: Partial<ListingFormData>;
    onSubmit: (data: ListingFormData) => Promise<void>;
    submitLabel: string;
    loading?: boolean;
}

export function ListingForm({ initialValues, onSubmit, submitLabel, loading = false }: ListingFormProps) {
    const [images, setImages] = useState<string[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        bhkType: '',
        price: '',
        street: '',
        ownerName: '',
        ownerContact: '',
        houseRules: '',
        roomType: 'private' as 'private' | 'shared',
    });

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    useEffect(() => {
        if (initialValues) {
            setFormData({
                title: initialValues.title || '',
                bhkType: initialValues.bhkType || '',
                price: initialValues.price || '',
                street: initialValues.street || '',
                ownerName: initialValues.ownerName || '',
                ownerContact: initialValues.ownerContact || '',
                houseRules: initialValues.houseRules || '',
                roomType: initialValues.roomType || 'private',
            });
            setImages(initialValues.images || []);
            setSelectedAmenities(initialValues.amenities || []);
        }
    }, [initialValues]);

    const availableAmenities = [
        { id: 'cctv', label: 'CCTV', icon: 'video.fill' },
        { id: 'garage', label: 'Garage', icon: 'car.fill' },
        { id: 'wifi', label: 'WiFi', icon: 'wifi' },
        { id: 'ac', label: 'AC', icon: 'snowflake' },
        { id: 'furniture', label: 'Furnished', icon: 'bed.double.fill' },
        { id: 'kitchen', label: 'Kitchen', icon: 'refrigerator.fill' },
    ];

    const updateFormData = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const pickImages = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [16, 9],
            });

            if (!result.canceled) {
                const validImages: string[] = [];
                const errors: string[] = [];

                for (const asset of result.assets) {
                    const validation = await ImageValidationService.validateImageSize(asset.uri, 5); // 5MB limit
                    if (validation.valid) {
                        validImages.push(asset.uri);
                    } else {
                        errors.push(validation.error || 'Invalid image');
                    }
                }

                if (errors.length > 0) {
                    Alert.alert('Image Validation', `${errors.length} image(s) were skipped:\n${errors[0]}`);
                }

                setImages(prev => [...prev, ...validImages].slice(0, 10));
            }
        } catch (error) {
            console.error('❌ Error picking images:', error);
            Alert.alert('Error', 'Failed to pick images');
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                quality: 0.8,
                aspect: [16, 9],
            });

            if (!result.canceled) {
                const photoUri = result.assets[0].uri;
                const validation = await ImageValidationService.validateImageSize(photoUri, 5); // 5MB limit

                if (validation.valid) {
                    setImages(prev => [...prev, photoUri].slice(0, 10));
                } else {
                    Alert.alert('Image Too Large', validation.error);
                }
            }
        } catch (error) {
            console.error('❌ Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const getLocation = async () => {
        try {
            setLocationLoading(true);

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant location permissions to auto-fill address.');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const [addressResult] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (addressResult) {
                updateFormData('street', addressResult.street || '');
            }
        } catch (error: any) {
            console.error('Failed to get location:', error);
            Alert.alert('Error', 'Failed to get current location');
        } finally {
            setLocationLoading(false);
        }
    };

    const toggleAmenity = (amenityId: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenityId)
                ? prev.filter(id => id !== amenityId)
                : [...prev, amenityId]
        );
    };

    const validateForm = (): boolean => {
        if (!formData.bhkType) {
            Alert.alert('Missing Information', 'Please select a room configuration (1BHK, 2BHK, etc.)');
            return false;
        }

        const requiredFields = [
            'title', 'price', 'street',
            'ownerName', 'ownerContact'
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData].trim()) {
                const fieldName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
                Alert.alert('Missing Information', `Please fill in ${fieldName}`);
                return false;
            }
        }

        if (!formData.ownerContact.trim()) {
            Alert.alert('Validation Error', 'Please enter a contact number');
            return false;
        }

        // Validate phone number format
        const phoneValidation = validatePhoneNumber(formData.ownerContact);
        if (!phoneValidation.valid) {
            Alert.alert('Invalid Phone Number', phoneValidation.error || 'Please enter a valid phone number');
            return false;
        }

        if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            Alert.alert('Invalid Price', 'Please enter a valid price');
            return false;
        }

        if (images.length === 0) {
            Alert.alert('Validation Error', 'Please add at least one image');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        // Format phone number before submitting
        const formattedPhone = formatPhoneNumber(formData.ownerContact);

        onSubmit({
            ...formData,
            ownerContact: formattedPhone, // Use formatted phone
            images,
            amenities: selectedAmenities,
        });
    };

    const inputStyle = [
        styles.input,
        {
            backgroundColor: Colors.backgroundSecondary,
            color: Colors.text,
            borderColor: Colors.border,
        }
    ];

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Photos Section */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Photos ({images.length}/10)
                    </ThemedText>

                    <ThemedView style={styles.imageSection}>
                        {images.length > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageList}>
                                {images.map((uri, index) => (
                                    <ThemedView key={index} style={styles.imageContainer}>
                                        <Image
                                            source={{ uri }}
                                            style={styles.selectedImage}
                                            contentFit="cover"
                                        />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => removeImage(index)}
                                        >
                                            <IconSymbol name="xmark.circle.fill" size={32} color="#ff4444" />
                                        </TouchableOpacity>
                                    </ThemedView>
                                ))}
                            </ScrollView>
                        )}

                        <View style={styles.imageButtons}>
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={pickImages}
                                activeOpacity={0.8}
                            >
                                <IconSymbol name="photo.fill" size={20} color="#000" />
                                <ThemedText style={styles.uploadButtonText}>Choose Photos</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={takePhoto}
                                activeOpacity={0.8}
                            >
                                <IconSymbol name="camera.fill" size={20} color="#000" />
                                <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </ThemedView>
                </ThemedView>

                {/* Basic Information */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Basic Information
                    </ThemedText>

                    {/* BHK Type Selector */}
                    <ThemedText style={styles.fieldLabel}>Room Configuration</ThemedText>
                    <ThemedView style={styles.bhkContainer}>
                        {['1BHK', '2BHK', '3BHK', '4BHK', 'Shop'].map((bhk) => (
                            <TouchableOpacity
                                key={bhk}
                                style={[
                                    styles.bhkButton,
                                    formData.bhkType === bhk && styles.bhkButtonActive,
                                    { borderColor: Colors.border }
                                ]}
                                onPress={() => updateFormData('bhkType', bhk)}
                            >
                                {formData.bhkType === bhk && (
                                    <LinearGradient
                                        colors={Gradients.primary}
                                        style={StyleSheet.absoluteFill}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    />
                                )}
                                <ThemedText style={[
                                    styles.bhkText,
                                    formData.bhkType === bhk && styles.bhkTextActive
                                ]}>
                                    {bhk}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ThemedView>

                    <TextInput
                        style={inputStyle}
                        placeholder="Property Name (e.g., Sunrise Apartments, Green Villa)"
                        placeholderTextColor="#999"
                        value={formData.title}
                        onChangeText={(value) => updateFormData('title', value)}
                    />

                    <ThemedText style={[styles.fieldLabel, { fontWeight: 'bold' }]}>House Rules</ThemedText>
                    <TextInput
                        style={[inputStyle, styles.textArea]}
                        placeholder={"1. No entry after 10 pm\n2. Pay rent on time\n3. One month rent in advance\n4. No loud music\netc..."}
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={6}
                        value={formData.houseRules}
                        onChangeText={(value) => updateFormData('houseRules', value)}
                    />

                    <TextInput
                        style={inputStyle}
                        placeholder="Monthly Rent (₹)"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={formData.price}
                        onChangeText={(value) => updateFormData('price', value)}
                    />
                </ThemedView>

                {/* Room Type */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Room Type
                    </ThemedText>

                    <ThemedView style={styles.roomTypeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roomTypeButton,
                                formData.roomType === 'private' && styles.roomTypeButtonActive,
                                { borderColor: Colors.border }
                            ]}
                            onPress={() => updateFormData('roomType', 'private')}
                        >
                            {formData.roomType === 'private' && (
                                <LinearGradient
                                    colors={Gradients.primary}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            <IconSymbol
                                name="person.fill"
                                size={20}
                                color={formData.roomType === 'private' ? '#fff' : '#666'}
                            />
                            <ThemedText style={[
                                styles.roomTypeText,
                                formData.roomType === 'private' && styles.roomTypeTextActive
                            ]}>
                                Private Room
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roomTypeButton,
                                formData.roomType === 'shared' && styles.roomTypeButtonActive,
                                { borderColor: Colors.border }
                            ]}
                            onPress={() => updateFormData('roomType', 'shared')}
                        >
                            {formData.roomType === 'shared' && (
                                <LinearGradient
                                    colors={Gradients.primary}
                                    style={StyleSheet.absoluteFill}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                />
                            )}
                            <IconSymbol
                                name="person.2.fill"
                                size={20}
                                color={formData.roomType === 'shared' ? '#fff' : '#666'}
                            />
                            <ThemedText style={[
                                styles.roomTypeText,
                                formData.roomType === 'shared' && styles.roomTypeTextActive
                            ]}>
                                Shared Room
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>

                {/* Address */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Address
                    </ThemedText>

                    <TextInput
                        style={inputStyle}
                        placeholder="Street Address"
                        placeholderTextColor="#999"
                        value={formData.street}
                        onChangeText={(value) => updateFormData('street', value)}
                    />

                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={getLocation}
                        disabled={locationLoading}
                    >
                        <IconSymbol name="location.fill" size={16} color={Colors.text} />
                        <ThemedText style={[styles.locationButtonText, { color: Colors.text }]}>
                            {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                        </ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                {/* Amenities */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Amenities
                    </ThemedText>

                    <ThemedView style={styles.amenitiesGrid}>
                        {availableAmenities.map((amenity) => (
                            <TouchableOpacity
                                key={amenity.id}
                                style={[
                                    styles.amenityButton,
                                    selectedAmenities.includes(amenity.id) && styles.amenityButtonActive,
                                    { borderColor: Colors.border }
                                ]}
                                onPress={() => toggleAmenity(amenity.id)}
                            >
                                {selectedAmenities.includes(amenity.id) && (
                                    <LinearGradient
                                        colors={Gradients.primary}
                                        style={StyleSheet.absoluteFill}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    />
                                )}
                                <IconSymbol
                                    name={amenity.icon as any}
                                    size={20}
                                    color={selectedAmenities.includes(amenity.id) ? '#fff' : '#666'}
                                />
                                <ThemedText style={[
                                    styles.amenityText,
                                    selectedAmenities.includes(amenity.id) && styles.amenityTextActive
                                ]}>
                                    {amenity.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </ThemedView>
                </ThemedView>

                {/* Contact Information */}
                <ThemedView style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Contact Information
                    </ThemedText>

                    <TextInput
                        style={inputStyle}
                        placeholder="Your Name"
                        placeholderTextColor="#999"
                        value={formData.ownerName}
                        onChangeText={(value) => updateFormData('ownerName', value)}
                    />

                    <TextInput
                        style={inputStyle}
                        placeholder="Phone Number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        value={formData.ownerContact}
                        onChangeText={(value) => updateFormData('ownerContact', value)}
                    />
                </ThemedView>

                {/* Submit Button */}
                <View style={styles.submitContainer}>
                    <Button
                        title={loading ? 'Saving...' : submitLabel}
                        onPress={handleSubmit}
                        loading={loading}
                        size="large"
                        fullWidth
                    />
                </View>

                <ThemedView style={styles.bottomPadding} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        padding: Spacing.xl,
        paddingTop: 0,
        marginBottom: Spacing.md, // Reduced from lg
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        marginBottom: Spacing.md,
        fontSize: 18,
        fontWeight: '600',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    locationButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderRadius: BorderRadius.input,
        padding: Spacing.lg,
        fontSize: 16,
        marginBottom: Spacing.lg,
    },
    textArea: {
        minHeight: 150,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    roomTypeContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    roomTypeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: Spacing.lg,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        overflow: 'hidden',
    },
    roomTypeButtonActive: {
        borderWidth: 0,
    },
    roomTypeText: {
        fontSize: 16,
        color: '#666',
        zIndex: 1,
    },
    roomTypeTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    imageSection: {
        marginBottom: 10,
    },
    imageList: {
        marginBottom: 15,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 10,
    },
    selectedImage: {
        width: 160, // Increased from 120
        height: 160, // Increased from 120
        borderRadius: 12,
    },
    removeImageButton: {
        position: 'absolute',
        top: -12,
        right: -12,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    imageButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    submitContainer: {
        padding: Spacing.xl,
    },
    bottomPadding: {
        height: 50,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    amenityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        overflow: 'hidden',
        minWidth: '30%',
    },
    amenityButtonActive: {
        borderWidth: 0,
    },
    amenityText: {
        fontSize: 14,
        color: '#666',
        zIndex: 1,
    },
    amenityTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.sm,
        opacity: 0.8,
    },
    bhkContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    bhkButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.card,
        borderWidth: 1,
        overflow: 'hidden',
        minWidth: 70,
        alignItems: 'center',
    },
    bhkButtonActive: {
        borderWidth: 0,
    },
    bhkText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        zIndex: 1,
    },
    bhkTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    addRuleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: Spacing.md,
    },
    ruleInput: {
        flex: 1,
        marginBottom: 0,
    },
    addRuleButton: {
        padding: 4,
    },
    rulesList: {
        marginBottom: Spacing.lg,
        gap: 8,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: 10,
        borderRadius: 8,
    },
    ruleBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.primary,
    },
    ruleText: {
        flex: 1,
        fontSize: 14,
        color: Colors.text,
    },
    uploadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        backgroundColor: '#fff',
    },
    uploadButtonText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '600',
    },
});

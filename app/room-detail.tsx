import { useAuth } from '@/components/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { BorderRadius, Gradients, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RoomListing } from '@/types/room';
import { logger } from '@/utils/logger';
import { maskPhoneNumber, sanitizePhoneNumber } from '@/utils/phoneUtils';
import { StorageService } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function RoomDetailScreen() {
    const params = useLocalSearchParams();
    const [listing, setListing] = useState<RoomListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [imageContentFit, setImageContentFit] = useState<'cover' | 'contain'>('cover');
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportDetails, setReportDetails] = useState('');
    const [reporting, setReporting] = useState(false);

    const primaryColor = useThemeColor({}, 'primary');

    const loadListing = useCallback(async () => {
        if (!params.id) return;
        try {
            const found = await StorageService.getRoomListing(params.id as string);
            setListing(found);
        } catch (error: any) {
            logger.error('Error loading listing:', error);
            Alert.alert('Error', error.message || 'Failed to load listing details');
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    const checkIfSaved = useCallback(async () => {
        if (params.id) {
            const saved = await StorageService.isListingSaved(params.id as string);
            setIsSaved(saved);
        }
    }, [params.id]);

    useEffect(() => {
        loadListing();
        checkIfSaved();
    }, [loadListing, checkIfSaved]);

    const { user } = useAuth();

    const handleCall = () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please log in to contact the owner',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/(auth)/login') }
                ]
            );
            return;
        }
        if (listing?.ownerContact) {
            const sanitized = sanitizePhoneNumber(listing.ownerContact);
            Linking.openURL(`tel:${sanitized}`).catch(err => {
                console.error('Error making call:', err);
                Alert.alert('Error', 'Could not make phone call');
            });
        }
    };

    const handleWhatsApp = () => {
        if (!user) {
            Alert.alert(
                'Login Required',
                'Please log in to contact the owner',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Log In', onPress: () => router.push('/(auth)/login') }
                ]
            );
            return;
        }
        if (listing?.ownerContact) {
            const sanitized = sanitizePhoneNumber(listing.ownerContact);
            const message = `Hi, I'm interested in your property: ${listing.title}`;
            const url = `whatsapp://send?phone=${sanitized}&text=${encodeURIComponent(message)}`;

            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    Alert.alert(
                        'WhatsApp Not Found',
                        'Please install WhatsApp to use this feature',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Install', onPress: () => Linking.openURL('https://wa.me/') }
                        ]
                    );
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => {
                console.error('Error opening WhatsApp:', err);
                Alert.alert('Error', 'Could not open WhatsApp');
            });
        }
    };

    const handleToggleSave = async () => {
        if (!listing) return;

        try {
            if (isSaved) {
                await StorageService.removeFavoriteListing(listing.id);
                setIsSaved(false);
            } else {
                await StorageService.saveFavoriteListing(listing.id);
                setIsSaved(true);
            }
        } catch (error: any) {
            logger.error('Error toggling save:', error);
            Alert.alert('Error', error.message || 'Failed to update saved status');
        }
    };

    const handleReport = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please log in to report a listing');
            return;
        }
        if (!reportReason) {
            Alert.alert('Required', 'Please select a reason for reporting');
            return;
        }

        try {
            setReporting(true);
            await StorageService.reportListing(listing!.id, reportReason, reportDetails);
            setReportModalVisible(false);
            Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
            setReportReason('');
            setReportDetails('');
        } catch (error: any) {
            logger.error('Error reporting listing:', error);
            Alert.alert('Error', error.message || 'Failed to submit report');
        } finally {
            setReporting(false);
        }
    };

    const reportReasons = [
        'Inappropriate Content',
        'Spam or Scam',
        'Incorrect Information',
        'Other'
    ];

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        );
    }

    if (!listing) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Listing not found</ThemedText>
                <Button title="Go Back" onPress={() => router.back()} />
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <View style={styles.backButtonCircle}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </View>
                </TouchableOpacity>

                {/* Save Button */}
                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.reportButton} onPress={() => setReportModalVisible(true)}>
                        <ThemedText style={styles.reportButtonText}>Report</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} onPress={handleToggleSave}>
                        <View style={styles.iconButtonCircle}>
                            <IconSymbol
                                name={isSaved ? 'heart.fill' : 'heart'}
                                size={24}
                                color={isSaved ? '#FF0000' : '#000'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Image Carousel */}
                <ImageCarousel
                    images={listing.images}
                    height={350}
                    style={styles.imageCarousel}
                    contentFit="cover"
                    onPress={() => setImageContentFit('contain')}
                />
                <ThemedText style={styles.imageHelperText}>
                    Tap the image to see full view
                </ThemedText>

                {/* Content */}
                <ThemedView style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <ThemedText type="h2" style={styles.title}>
                                {listing.title}
                            </ThemedText>
                            {/* Rating removed until implemented */}
                            {/* <View style={styles.ratingContainer}>
                                <IconSymbol name="star.fill" size={16} color="#FFD700" />
                                <ThemedText type="bodyLarge" style={styles.rating}>4.8</ThemedText>
                            </View> */}
                        </View>

                        <View style={styles.priceContainer}>
                            <LinearGradient
                                colors={Gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.priceGradient}
                            >
                                <ThemedText type="h3" style={styles.price}>₹{listing.price}</ThemedText>
                                <ThemedText style={styles.pricePeriod}>/month</ThemedText>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="location.fill" size={20} color={primaryColor} />
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Location</ThemedText>
                        </View>
                        <ThemedText style={styles.address}>{listing.address.street}</ThemedText>
                    </View>

                    {/* Room Type */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol
                                name={listing.roomType === 'private' ? 'person.fill' : 'person.2.fill'}
                                size={20}
                                color={primaryColor}
                            />
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Room Type</ThemedText>
                        </View>
                        <ThemedText style={styles.roomType}>
                            {listing.roomType === 'private' ? 'Private Room' : 'Shared Room'}
                        </ThemedText>
                    </View>

                    {/* House Rules */}
                    {listing.houseRules && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <IconSymbol name="list.bullet.rectangle.fill" size={20} color={primaryColor} />
                                <ThemedText type="subtitle" style={styles.sectionTitle}>House Rules</ThemedText>
                            </View>
                            <ThemedText style={styles.description}>{listing.houseRules}</ThemedText>
                        </View>
                    )}

                    {/* Amenities */}
                    {listing.amenities && listing.amenities.length > 0 && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <IconSymbol name="star.fill" size={20} color={primaryColor} />
                                <ThemedText type="subtitle" style={styles.sectionTitle}>Amenities</ThemedText>
                            </View>
                            <View style={styles.amenitiesGrid}>
                                {listing.amenities.map((amenity, index) => (
                                    <View key={index} style={styles.amenityBadge}>
                                        <IconSymbol name="checkmark.circle.fill" size={16} color={primaryColor} />
                                        <ThemedText style={styles.amenityText}>{amenity}</ThemedText>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Owner Info */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <IconSymbol name="person.circle.fill" size={20} color={primaryColor} />
                            <ThemedText type="subtitle" style={styles.sectionTitle}>Posted By</ThemedText>
                        </View>
                        <ThemedText style={styles.ownerName}>{listing.ownerName}</ThemedText>
                        <ThemedText style={styles.ownerContact}>{maskPhoneNumber(listing.ownerContact, !!user)}</ThemedText>
                    </View>

                    {/* Listed Date */}
                    <View style={styles.section}>
                        <ThemedText style={styles.listedDate}>
                            Listed on {new Date(listing.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </ThemedText>
                    </View>
                </ThemedView>
            </ScrollView >

            {/* Bottom Action Buttons */}
            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={handleCall}
                    activeOpacity={0.8}
                >
                    <IconSymbol name="phone.fill" size={20} color="#000" />
                    <ThemedText style={styles.callButtonText}>Call Owner</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={handleWhatsApp}
                    activeOpacity={0.8}
                >
                    <IconSymbol name="message.fill" size={20} color="#fff" />
                    <ThemedText style={styles.whatsappButtonText}>WhatsApp</ThemedText>
                </TouchableOpacity>
            </View>

            {/* Full Screen Image Modal */}
            <Modal
                visible={imageContentFit === 'contain'}
                transparent={true}
                onRequestClose={() => setImageContentFit('cover')}
                animationType="fade"
            >
                <View style={styles.fullScreenModal}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setImageContentFit('cover')}
                    >
                        <IconSymbol name="xmark.circle.fill" size={32} color="#fff" />
                    </TouchableOpacity>
                    <ImageCarousel
                        images={listing.images}
                        height={Dimensions.get('window').height}
                        style={styles.fullScreenCarousel}
                        contentFit="contain"
                    />
                </View>
            </Modal>

            {/* Report Modal */}
            <Modal
                visible={reportModalVisible}
                transparent={true}
                onRequestClose={() => setReportModalVisible(false)}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.reportModalContent}>
                        <ThemedText type="h3" style={styles.reportTitle}>Report Listing</ThemedText>

                        <ThemedText style={styles.reportLabel}>Reason</ThemedText>
                        <View style={styles.reasonsContainer}>
                            {reportReasons.map((reason) => (
                                <TouchableOpacity
                                    key={reason}
                                    style={[
                                        styles.reasonButton,
                                        reportReason === reason && styles.reasonButtonActive
                                    ]}
                                    onPress={() => setReportReason(reason)}
                                >
                                    <ThemedText style={[
                                        styles.reasonText,
                                        reportReason === reason && styles.reasonTextActive
                                    ]}>{reason}</ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <ThemedText style={styles.reportLabel}>Details (Optional)</ThemedText>
                        <TextInput
                            style={styles.textAreaInput}
                            placeholder="Please provide more details..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={4}
                            value={reportDetails}
                            onChangeText={setReportDetails}
                            textAlignVertical="top"
                        />

                        <View style={styles.reportActions}>
                            <TouchableOpacity
                                style={styles.cancelReportButton}
                                onPress={() => setReportModalVisible(false)}
                            >
                                <ThemedText style={styles.cancelReportButtonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitReportButton, reporting && styles.submitReportButtonDisabled]}
                                onPress={handleReport}
                                disabled={reporting}
                            >
                                <ThemedText style={styles.submitReportButtonText}>
                                    {reporting ? 'Submitting...' : 'Submit Report'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    headerButtons: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        // Hit slop handled by size
    },
    iconButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    reportButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    reportButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '600',
    },
    imageCarousel: {
        width: '100%',
    },
    content: {
        padding: Spacing.xl,
    },
    header: {
        marginBottom: Spacing.xl,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    title: {
        flex: 1,
        marginRight: Spacing.md,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    rating: {
        fontWeight: '600',
    },
    priceContainer: {
        alignSelf: 'flex-start',
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    priceGradient: {
        flexDirection: 'row',
        alignItems: 'baseline',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        gap: 4,
    },
    price: {
        color: '#fff',
        fontWeight: '700',
    },
    pricePeriod: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: Spacing.sm,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    address: {
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.8,
    },
    roomType: {
        fontSize: 16,
        opacity: 0.8,
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        opacity: 0.8,
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    amenityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: BorderRadius.sm,
    },
    amenityText: {
        fontSize: 14,
        fontWeight: '500',
    },
    ownerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    ownerContact: {
        fontSize: 15,
        opacity: 0.8,
    },
    listedDate: {
        fontSize: 13,
        opacity: 0.6,
        fontStyle: 'italic',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: Spacing.md,
        padding: Spacing.xl,
        paddingBottom: Spacing.xxl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
    },
    actionButton: {
        flex: 1,
    },
    rulesList: {
        gap: 8,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    ruleBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#000',
        marginTop: 8,
    },
    ruleText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        opacity: 0.8,
    },
    fullScreenModal: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 20,
        padding: 10,
    },
    fullScreenCarousel: {
        width: '100%',
        height: '100%',
    },
    imageHelperText: {
        fontSize: 12,
        textAlign: 'center',
        opacity: 0.6,
        marginTop: 8,
        fontStyle: 'italic',
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
        borderWidth: 2,
        borderColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    callButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    whatsappButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    whatsappButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    reportModalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
    },
    reportTitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    reportLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 8,
    },
    reasonsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    reasonButton: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
    },
    reasonButtonActive: {
        borderColor: '#000',
        backgroundColor: '#f0f0f0',
    },
    reasonText: {
        fontSize: 15,
        color: '#333',
    },
    reasonTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    textAreaInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        height: 100,
        marginBottom: 24,
        backgroundColor: '#f9f9f9',
        fontSize: 15,
        color: '#000',
    },
    reportActions: {
        flexDirection: 'row',
        gap: 16,
    },
    cancelReportButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelReportButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    submitReportButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitReportButtonDisabled: {
        opacity: 0.6,
    },
    submitReportButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

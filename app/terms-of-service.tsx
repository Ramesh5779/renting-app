import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TermsOfServiceScreen() {
    return (
        <ThemedView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText type="h3" style={styles.headerTitle}>Terms of Service</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <ThemedText type="caption" variant="secondary" style={styles.lastUpdated}>
                    Last Updated: November 2025
                </ThemedText>

                <ThemedText type="body" style={styles.intro}>
                    By using RentHive, you agree to the following Terms of Service. Please read carefully before using the app.
                </ThemedText>

                {/* Section 1 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>1. Introduction</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        Welcome to <ThemedText type="body" style={styles.bold}>RentHive</ThemedText> — a platform that connects room owners with people searching for rental rooms. These Terms of Service apply to all users of the app, including renters and property owners.
                    </ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        If you do not agree to these terms, please do not use the app.
                    </ThemedText>
                </View>

                {/* Section 2 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>2. Eligibility</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        To use RentHive, you must provide accurate and truthful information. By using the platform, you confirm you have the legal right to communicate, rent, list, or search for a rental property.
                    </ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        We may suspend or remove accounts that provide false information or misuse the service.
                    </ThemedText>
                </View>

                {/* Section 3 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>3. User Responsibilities</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        By using RentHive, you agree:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Not to upload misleading, illegal, or offensive content.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Not to scam, spam, or abuse other users.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Not to damage, hack, or misuse the app in any way.
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        Violations may result in account suspension or legal action.
                    </ThemedText>
                </View>

                {/* Section 4 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>4. Property Listings (Owners)</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        If you are listing a room on RentHive, you agree that:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                All information you provide (pricing, location, rules, availability) must be accurate.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Photos uploaded must represent the actual property.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                You are responsible for complying with local property, rental, and safety regulations.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Any rental agreement or transaction is solely between you and the renter.
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        RentHive is <ThemedText type="body" style={styles.bold}>not responsible</ThemedText> for disputes between renters and property owners.
                    </ThemedText>
                </View>

                {/* Section 5 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>5. Booking and Payments</ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Renters must review listing details before booking.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                RentHive does not guarantee refunds, cancellations, or payment reversals unless stated otherwise.
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        Any payment dispute is between the renter and the property owner.
                    </ThemedText>
                </View>

                {/* Section 6 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>6. Prohibited Activities</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        Users agree not to:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Create fake, misleading, or duplicate listings.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Use RentHive to contact users for unrelated services.
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Share private information of others without consent.
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Section 7 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>7. Content Ownership and License</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        You retain ownership of photos, descriptions, and listing content you upload.
                    </ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        By uploading content, you grant RentHive permission to:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Display the content inside the platform
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Use the content for app functionality, marketing, and discovery
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        You may remove content anytime by editing or deleting your listing.
                    </ThemedText>
                </View>

                {/* Section 8 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>8. License to Use the App</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        RentHive grants you a limited, non-exclusive, non-transferable license to use the app.
                    </ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        You may <ThemedText type="body" style={styles.bold}>not</ThemedText>:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Copy, modify, resell, or distribute the app
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Reverse-engineer or interfere with app systems
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Section 9 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>9. Disclaimer</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        RentHive is provided <ThemedText type="body" style={styles.bold}>&quot;as is&quot;</ThemedText> without guarantees or warranties of any kind.
                    </ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        RentHive does <ThemedText type="body" style={styles.bold}>not guarantee</ThemedText>:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Accuracy of listings
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Availability of rooms
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Safety or legal compliance of properties
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Identity verification of users
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        Use the app at your own discretion and risk.
                    </ThemedText>
                </View>

                {/* Section 10 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>10. Limitation of Liability</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        RentHive is <ThemedText type="body" style={styles.bold}>not liable</ThemedText> for:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Financial loss
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Fraud or misleading listings
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Property damage or theft
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Legal disputes
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Personal injury or unsafe environments
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        All communication and agreements are strictly between users.
                    </ThemedText>
                </View>

                {/* Section 11 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>11. Account Suspension or Termination</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        We may suspend or terminate accounts if:
                    </ThemedText>
                    <View style={styles.bulletList}>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Terms are violated
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Fraud or suspicious activity is detected
                            </ThemedText>
                        </View>
                        <View style={styles.bulletItem}>
                            <ThemedText type="body" style={styles.bullet}>•</ThemedText>
                            <ThemedText type="body" style={styles.bulletText}>
                                Harassment or harmful behavior occurs
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedText type="body" style={styles.paragraph}>
                        Users may delete their account at any time through the app settings.
                    </ThemedText>
                </View>

                {/* Section 12 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>12. Changes to Terms</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        We may update these terms periodically. Continuing to use RentHive after changes means you accept the updated terms.
                    </ThemedText>
                </View>

                {/* Section 13 */}
                <View style={styles.section}>
                    <ThemedText type="h4" style={styles.sectionTitle}>13. Contact Information</ThemedText>
                    <ThemedText type="body" style={styles.paragraph}>
                        For support or questions, contact us at:
                    </ThemedText>
                    <ThemedText type="body" style={styles.contactEmail}>
                        📩 renthive357@gmail.com
                    </ThemedText>
                </View>

                <View style={styles.footer} />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.xl,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: Spacing.xl,
    },
    lastUpdated: {
        marginBottom: Spacing.lg,
        fontStyle: 'italic',
    },
    intro: {
        marginBottom: Spacing.xxl,
        lineHeight: 24,
    },
    section: {
        marginBottom: Spacing.xxl,
    },
    sectionTitle: {
        marginBottom: Spacing.md,
    },
    paragraph: {
        marginBottom: Spacing.md,
        lineHeight: 24,
    },
    bold: {
        fontWeight: '700',
    },
    bulletList: {
        marginBottom: Spacing.md,
        marginLeft: Spacing.md,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: Spacing.sm,
    },
    bullet: {
        marginRight: Spacing.sm,
        lineHeight: 24,
    },
    bulletText: {
        flex: 1,
        lineHeight: 24,
    },
    contactEmail: {
        fontWeight: '600',
        color: '#007AFF',
        marginTop: Spacing.sm,
    },
    footer: {
        height: Spacing.massive,
    },
});

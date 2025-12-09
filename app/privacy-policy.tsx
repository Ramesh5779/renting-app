import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
    return (
        <ThemedView style={styles.container}>
            <Stack.Screen options={{ title: 'Privacy Policy' }} />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <ThemedView style={styles.content}>
                    <ThemedText type="h1" style={styles.title}>🔒 Privacy Policy</ThemedText>
                    <ThemedText style={styles.subtitle}>RentHive</ThemedText>
                    <ThemedText style={styles.lastUpdated}>Last Updated: November 2025</ThemedText>

                    <ThemedText style={styles.paragraph}>
                        RentHive (&quot;we&quot;, &quot;our&quot;, or &quot;the app&quot;) is committed to protecting your privacy.
                        This Privacy Policy explains how we collect, use, store, and protect your information
                        when you use the RentHive mobile application.
                    </ThemedText>

                    <ThemedText style={styles.paragraph}>
                        By using RentHive, you agree to the terms described in this Privacy Policy.
                    </ThemedText>

                    {/* Section 1 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 1. Information We Collect</ThemedText>
                    <ThemedText style={styles.paragraph}>We may collect the following information:</ThemedText>

                    <ThemedText type="subtitle" style={styles.subsectionTitle}>A. Personal Information</ThemedText>
                    <ThemedText style={styles.paragraph}>Provided by you during sign-up or profile creation:</ThemedText>
                    <ThemedText style={styles.listItem}>• Name</ThemedText>
                    <ThemedText style={styles.listItem}>• Email address</ThemedText>
                    <ThemedText style={styles.listItem}>• Phone number (optional)</ThemedText>
                    <ThemedText style={styles.listItem}>• Profile details</ThemedText>
                    <ThemedText style={styles.listItem}>• Address (if listing a room)</ThemedText>

                    <ThemedText type="subtitle" style={styles.subsectionTitle}>B. Listing Information (Owners Only)</ThemedText>
                    <ThemedText style={styles.listItem}>• Room photos</ThemedText>
                    <ThemedText style={styles.listItem}>• Location/address of the rental property</ThemedText>
                    <ThemedText style={styles.listItem}>• Rental price</ThemedText>
                    <ThemedText style={styles.listItem}>• Description and rules</ThemedText>

                    <ThemedText type="subtitle" style={styles.subsectionTitle}>C. Usage & App Data</ThemedText>
                    <ThemedText style={styles.listItem}>• App activity (favorites, messages, searches)</ThemedText>
                    <ThemedText style={styles.listItem}>• Device information (model, OS, IP address)</ThemedText>
                    <ThemedText style={styles.listItem}>• Log data (crashes, bugs, errors)</ThemedText>

                    <ThemedText type="subtitle" style={styles.subsectionTitle}>D. Storage Data (Images)</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        If you upload pictures, they may be stored securely using cloud storage (e.g., Supabase Storage).
                    </ThemedText>

                    {/* Section 2 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 2. How We Use Your Information</ThemedText>
                    <ThemedText style={styles.paragraph}>We use collected information to:</ThemedText>
                    <ThemedText style={styles.listItem}>• Create and manage user accounts</ThemedText>
                    <ThemedText style={styles.listItem}>• Display rental listings in the app</ThemedText>
                    <ThemedText style={styles.listItem}>• Allow communication between renters and owners</ThemedText>
                    <ThemedText style={styles.listItem}>• Improve app experience and features</ThemedText>
                    <ThemedText style={styles.listItem}>• Prevent fraud, spam, or misuse</ThemedText>
                    <ThemedText style={styles.listItem}>• Provide customer support</ThemedText>
                    <ThemedText style={styles.paragraph}>We do not sell or rent your personal data.</ThemedText>

                    {/* Section 3 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 3. Sharing of Information</ThemedText>
                    <ThemedText style={styles.paragraph}>We may share your information only in the following cases:</ThemedText>
                    <ThemedText style={styles.listItem}>• With other users (e.g., renters contacting owners)</ThemedText>
                    <ThemedText style={styles.listItem}>• With service providers (hosting, analytics, authentication)</ThemedText>
                    <ThemedText style={styles.listItem}>• When required by law, government request, or legal order</ThemedText>
                    <ThemedText style={styles.listItem}>• To prevent fraud or protect app security</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We do not share your information for advertising or commercial sale.
                    </ThemedText>

                    {/* Section 4 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 4. Data Storage & Security</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We take steps to protect your data using modern security measures such as:
                    </ThemedText>
                    <ThemedText style={styles.listItem}>• Encrypted storage</ThemedText>
                    <ThemedText style={styles.listItem}>• Secure authentication</ThemedText>
                    <ThemedText style={styles.listItem}>• Access control policies</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        However, no system is 100% secure. You use the app at your own risk.
                    </ThemedText>

                    {/* Section 5 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 5. Cookies & Tracking</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We may use analytics and tracking tools to improve app performance and user experience. These may collect:
                    </ThemedText>
                    <ThemedText style={styles.listItem}>• Device identifiers</ThemedText>
                    <ThemedText style={styles.listItem}>• App usage behavior</ThemedText>
                    <ThemedText style={styles.paragraph}>You may disable tracking through device settings.</ThemedText>

                    {/* Section 6 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 6. User Rights</ThemedText>
                    <ThemedText style={styles.paragraph}>You have the right to:</ThemedText>
                    <ThemedText style={styles.listItem}>• Access your personal data</ThemedText>
                    <ThemedText style={styles.listItem}>• Update or correct your data</ThemedText>
                    <ThemedText style={styles.listItem}>• Request deletion of your account</ThemedText>
                    <ThemedText style={styles.listItem}>• Control visibility of your listing</ThemedText>
                    <ThemedText style={styles.paragraph}>To request deletion or access, contact:</ThemedText>
                    <ThemedText style={styles.contact}>📧 renthive357@gmail.com</ThemedText>

                    {/* Section 7 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 7. Account Deletion</ThemedText>
                    <ThemedText style={styles.paragraph}>You can delete your account anytime from app settings.</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        Once deleted, your profile and listings will no longer be visible. Some non-identifiable
                        data (e.g., analytics) may remain for security, legal, or operational purposes.
                    </ThemedText>

                    {/* Section 8 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 8. Children&apos;s Privacy</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        RentHive is available to users who are capable of entering housing-related agreements.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We do not knowingly collect data from individuals unable to do so responsibly.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        If you believe someone is using the platform improperly, please contact us.
                    </ThemedText>

                    {/* Section 9 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 9. Third-Party Services</ThemedText>
                    <ThemedText style={styles.paragraph}>RentHive may use third-party platforms such as:</ThemedText>
                    <ThemedText style={styles.listItem}>• Supabase (database, authentication, storage)</ThemedText>
                    <ThemedText style={styles.listItem}>• Email or messaging service providers</ThemedText>
                    <ThemedText style={styles.listItem}>• Crash reporting and analytics</ThemedText>
                    <ThemedText style={styles.paragraph}>These services have their own privacy policies.</ThemedText>

                    {/* Section 10 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 10. Changes to This Policy</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        We may update this Privacy Policy occasionally. Continued use of RentHive means you
                        accept any updated version.
                    </ThemedText>
                    <ThemedText style={styles.paragraph}>
                        The update date will always be shown at the top of this document.
                    </ThemedText>

                    {/* Section 11 */}
                    <ThemedText type="h3" style={styles.sectionTitle}>📌 11. Contact Information</ThemedText>
                    <ThemedText style={styles.paragraph}>
                        If you have questions or privacy concerns, you can reach us at:
                    </ThemedText>
                    <ThemedText style={styles.contact}>📩 renthive357@gmail.com</ThemedText>

                    <ThemedView style={styles.footer}>
                        <ThemedText style={styles.footerText}>
                            Thank you for using RentHive! 🏠
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 60,
    },
    title: {
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
        opacity: 0.8,
    },
    lastUpdated: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 24,
    },
    sectionTitle: {
        marginTop: 24,
        marginBottom: 12,
    },
    subsectionTitle: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: '600',
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 12,
        opacity: 0.8,
    },
    listItem: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 6,
        marginLeft: 8,
        opacity: 0.8,
    },
    contact: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 16,
        color: '#007AFF',
    },
    footer: {
        marginTop: 32,
        marginBottom: 40,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.7,
    },
});

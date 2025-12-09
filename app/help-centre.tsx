import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Linking, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';

interface FAQItem {
    question: string;
    answer: string;
}

interface Section {
    title: string;
    icon: string;
    faqs: FAQItem[];
}

export default function HelpCentreScreen() {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (sectionTitle: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionTitle]: !prev[sectionTitle]
        }));
    };

    const sections: Section[] = [
        {
            title: 'Getting Started',
            icon: 'star.fill',
            faqs: [
                {
                    question: 'What is RentHive?',
                    answer: 'RentHive is a platform that connects room owners with people searching for affordable rooms for rent.'
                },
                {
                    question: 'How do I create an account?',
                    answer: '1. Download and open the RentHive app\n2. Tap Sign Up\n3. Enter your details and verify your email or phone\n4. Start browsing or listing rooms'
                }
            ]
        },
        {
            title: 'For Renters',
            icon: 'person.fill',
            faqs: [
                {
                    question: 'How do I search for rooms?',
                    answer: '• Use the Search tab\n• Apply filters like location, price, and room type\n• View detailed listing pages with images and descriptions'
                },
                {
                    question: 'How do I contact a room owner?',
                    answer: '• Open a listing\n• Tap the Contact Owner or Message button\n• Start a conversation through in-app chat'
                },
                {
                    question: 'How do I book a room?',
                    answer: 'Booking happens directly between you and the room owner after communication.'
                }
            ]
        },
        {
            title: 'For Room Owners',
            icon: 'house.fill',
            faqs: [
                {
                    question: 'How do I list my room for rent?',
                    answer: '1. Go to My Listings\n2. Tap Add Room\n3. Upload photos and fill in details\n4. Submit your listing\n5. Once approved, it will be visible to users'
                },
                {
                    question: 'How long does the listing approval take?',
                    answer: 'Approval usually takes 1–24 hours, depending on review workload.'
                },
                {
                    question: 'Can I edit or delete my listing?',
                    answer: 'Yes — go to My Listings, choose the listing, and edit or remove it anytime.'
                }
            ]
        },
        {
            title: 'Images & Quality',
            icon: 'photo.fill',
            faqs: [
                {
                    question: 'Why are my images not uploading or loading?',
                    answer: 'Make sure:\n• Image size is not extremely large\n• You have a stable internet connection\n• File type is JPG, PNG, or HEIC\n\nIf issues continue, email us.'
                },
                {
                    question: 'Are edited or AI-generated images allowed?',
                    answer: 'No — all images must represent the actual room to avoid misleading users.'
                }
            ]
        },
        {
            title: 'Account & Privacy',
            icon: 'lock.fill',
            faqs: [
                {
                    question: 'How do I update my profile?',
                    answer: 'Go to Profile → Edit Profile.'
                },
                {
                    question: 'How do I delete my account?',
                    answer: '• Go to Settings\n• Tap Delete Account\n• Confirm the action\n\nOnce deleted, your messages and listings will be permanently removed.'
                }
            ]
        },
        {
            title: 'Safety & Reporting',
            icon: 'exclamationmark.shield.fill',
            faqs: [
                {
                    question: 'How do I report a listing or user?',
                    answer: '• Open the listing or profile\n• Tap Report\n• Select a reason and submit\n\nWe review reports and take action when necessary.'
                },
                {
                    question: 'What should I do if someone scams or harasses me?',
                    answer: 'Immediately stop communication and report the user. You may also email us directly at renthive357@gmail.com.'
                }
            ]
        }
    ];

    const quickFAQs = [
        { question: 'Is RentHive free to use?', answer: 'Yes, browsing and listing rooms is free (until further updates).' },
        { question: 'Can I list multiple rooms?', answer: 'Yes, owners may post multiple listings.' },
        { question: 'Does RentHive handle payments?', answer: 'Not at the moment. Payments happen directly between renter and owner.' },
        { question: 'How long does my listing stay active?', answer: 'Until you delete or mark it as unavailable.' }
    ];

    const handleEmailSupport = () => {
        Linking.openURL('mailto:renthive357@gmail.com');
    };

    return (
        <ThemedView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText type="h3" style={styles.headerTitle}>Help Centre</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                    <ThemedText type="h4" style={styles.welcomeTitle}>
                        Welcome to the RentHive Help Center!
                    </ThemedText>
                    <ThemedText type="body" style={styles.welcomeText}>
                        Here you can find answers to common questions, guides, and support resources for using the app.
                    </ThemedText>
                    <ThemedText type="body" style={styles.welcomeText}>
                        If you still need help, feel free to contact us anytime at:
                    </ThemedText>
                    <TouchableOpacity onPress={handleEmailSupport}>
                        <ThemedText type="body" style={styles.emailLink}>
                            📩 renthive357@gmail.com
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* FAQ Sections */}
                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <TouchableOpacity
                            onPress={() => toggleSection(section.title)}
                            style={styles.sectionHeader}
                        >
                            <View style={styles.sectionHeaderLeft}>
                                <View style={styles.iconContainer}>
                                    <IconSymbol name={section.icon as any} size={20} color="#000" />
                                </View>
                                <ThemedText type="h5" style={styles.sectionTitle}>
                                    {section.title}
                                </ThemedText>
                            </View>
                            <IconSymbol
                                name={expandedSections[section.title] ? 'chevron.up' : 'chevron.down'}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>

                        {expandedSections[section.title] && (
                            <View style={styles.faqList}>
                                {section.faqs.map((faq, faqIndex) => (
                                    <View key={faqIndex} style={styles.faqItem}>
                                        <ThemedText type="bodyMedium" style={styles.question}>
                                            {faq.question}
                                        </ThemedText>
                                        <ThemedText type="body" variant="secondary" style={styles.answer}>
                                            {faq.answer}
                                        </ThemedText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                {/* Quick FAQ */}
                <View style={styles.quickFAQSection}>
                    <ThemedText type="h4" style={styles.quickFAQTitle}>
                        ❓ Quick FAQ
                    </ThemedText>
                    {quickFAQs.map((faq, index) => (
                        <Card key={index} variant="outlined" padding="medium" style={styles.quickFAQCard}>
                            <ThemedText type="bodyMedium" style={styles.quickQuestion}>
                                {faq.question}
                            </ThemedText>
                            <ThemedText type="body" variant="secondary" style={styles.quickAnswer}>
                                {faq.answer}
                            </ThemedText>
                        </Card>
                    ))}
                </View>

                {/* Policies Section */}
                <View style={styles.policiesSection}>
                    <ThemedText type="h4" style={styles.policiesTitle}>
                        🧾 Policies & Legal
                    </ThemedText>
                    <Card
                        variant="outlined"
                        padding="medium"
                        pressable
                        onPress={() => router.push('/terms-of-service')}
                        style={styles.policyCard}
                    >
                        <View style={styles.policyCardContent}>
                            <View style={styles.policyIconContainer}>
                                <IconSymbol name="doc.text.fill" size={20} color="#000" />
                            </View>
                            <ThemedText type="bodyMedium" style={styles.policyLabel}>
                                Terms of Service
                            </ThemedText>
                            <IconSymbol name="chevron.right" size={16} color="#666" />
                        </View>
                    </Card>
                </View>

                {/* Contact Support */}
                <View style={styles.supportSection}>
                    <ThemedText type="h4" style={styles.supportTitle}>
                        💬 Need More Help?
                    </ThemedText>
                    <ThemedText type="body" variant="secondary" style={styles.supportText}>
                        If you didn&apos;t find what you&apos;re looking for, we&apos;re here to help.
                    </ThemedText>
                    <TouchableOpacity onPress={handleEmailSupport} style={styles.supportButton}>
                        <View style={styles.supportButtonContent}>
                            <IconSymbol name="envelope.fill" size={20} color="#fff" />
                            <ThemedText type="button" style={styles.supportButtonText}>
                                Email Support
                            </ThemedText>
                        </View>
                    </TouchableOpacity>
                    <ThemedText type="caption" variant="tertiary" style={styles.responseTime}>
                        We usually respond within 24–48 hours
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
    welcomeSection: {
        marginBottom: Spacing.xxl,
        padding: Spacing.lg,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 12,
    },
    welcomeTitle: {
        marginBottom: Spacing.md,
    },
    welcomeText: {
        marginBottom: Spacing.sm,
        lineHeight: 24,
    },
    emailLink: {
        color: '#007AFF',
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    section: {
        marginBottom: Spacing.lg,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.lg,
    },
    sectionHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    sectionTitle: {
        flex: 1,
    },
    faqList: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    faqItem: {
        marginTop: Spacing.lg,
    },
    question: {
        marginBottom: Spacing.sm,
        fontWeight: '600',
    },
    answer: {
        lineHeight: 22,
    },
    quickFAQSection: {
        marginTop: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    quickFAQTitle: {
        marginBottom: Spacing.lg,
    },
    quickFAQCard: {
        marginBottom: Spacing.md,
    },
    quickQuestion: {
        marginBottom: Spacing.sm,
        fontWeight: '600',
    },
    quickAnswer: {
        lineHeight: 22,
    },
    policiesSection: {
        marginBottom: Spacing.xxl,
    },
    policiesTitle: {
        marginBottom: Spacing.lg,
    },
    policyCard: {
        marginBottom: Spacing.md,
    },
    policyCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    policyIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    policyLabel: {
        flex: 1,
    },
    supportSection: {
        alignItems: 'center',
        padding: Spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 12,
    },
    supportTitle: {
        marginBottom: Spacing.md,
    },
    supportText: {
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    supportButton: {
        backgroundColor: '#000',
        paddingHorizontal: Spacing.xxl,
        paddingVertical: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.md,
    },
    supportButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    supportButtonText: {
        color: '#fff',
    },
    responseTime: {
        textAlign: 'center',
    },
    footer: {
        height: Spacing.massive,
    },
});

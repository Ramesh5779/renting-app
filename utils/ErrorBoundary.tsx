import { logger } from "@/utils/logger";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ErrorBoundaryState {
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null, errorInfo: null };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ error, errorInfo });
        logger.error("🔥 GLOBAL CRASH DETECTED", {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack
        });
    }

    handleRetry = () => {
        this.setState({ error: null, errorInfo: null });
    };

    render() {
        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.emoji}>💥</Text>
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.subtitle}>The app encountered an unexpected error</Text>

                        <View style={styles.errorBox}>
                            <Text style={styles.errorLabel}>Error:</Text>
                            <Text style={styles.errorText}>{this.state.error.message}</Text>
                        </View>

                        {__DEV__ && this.state.error.stack && (
                            <View style={styles.stackBox}>
                                <Text style={styles.errorLabel}>Stack Trace:</Text>
                                <Text style={styles.stackText}>{this.state.error.stack}</Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                            <Text style={styles.retryText}>Try Again</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
    },
    content: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        color: '#ff6b6b',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: '#a0a0a0',
        fontSize: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    errorLabel: {
        color: '#ff6b6b',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    errorText: {
        color: '#ffffff',
        fontSize: 14,
        fontFamily: 'monospace',
    },
    stackBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
        padding: 16,
        width: '100%',
        marginBottom: 24,
        maxHeight: 200,
    },
    stackText: {
        color: '#a0a0a0',
        fontSize: 10,
        fontFamily: 'monospace',
    },
    retryButton: {
        backgroundColor: '#4ecdc4',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
    },
    retryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

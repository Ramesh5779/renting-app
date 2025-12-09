import { ThemedView } from '@/components/themed-view';
import { checkEnv } from '@/utils/checkEnv';
import { getDeviceDiagnostics } from '@/utils/deviceInfo';
import { getLagStats } from '@/utils/lagDetector';
import { logger } from '@/utils/logger';
import { getOfflineQueue, inspectQueue } from '@/utils/offlineSync';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type LogEntry = { level: string; message: string; timestamp: string; data?: any };

export default function DebugConsoleScreen() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [filter, setFilter] = useState<string>('all');
    const [deviceInfo, setDeviceInfo] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'logs' | 'device' | 'queue'>('logs');

    const refreshLogs = () => {
        setLogs([...logger.logs].reverse());
    };

    const loadDeviceInfo = async () => {
        try {
            const info = await getDeviceDiagnostics();
            setDeviceInfo(info);
        } catch (e) {
            console.error('Failed to load device info:', e);
        }
    };

    useEffect(() => {
        refreshLogs();
        loadDeviceInfo();
        checkEnv();

        const interval = setInterval(refreshLogs, 2000);
        return () => clearInterval(interval);
    }, []);

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(l => l.level === filter);

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'error': return '#ff6b6b';
            case 'warn': return '#ffd93d';
            case 'info': return '#6bcbff';
            case 'debug': return '#a0a0a0';
            default: return '#ffffff';
        }
    };

    const renderLogItem = ({ item }: { item: LogEntry }) => (
        <View style={styles.logItem}>
            <View style={styles.logHeader}>
                <Text style={[styles.logLevel, { color: getLevelColor(item.level) }]}>
                    {item.level.toUpperCase()}
                </Text>
                <Text style={styles.logTime}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
            </View>
            <Text style={styles.logMessage}>{item.message}</Text>
            {item.data && (
                <Text style={styles.logData}>
                    {typeof item.data === 'object' ? JSON.stringify(item.data, null, 2) : String(item.data)}
                </Text>
            )}
        </View>
    );

    const renderDeviceTab = () => (
        <ScrollView style={styles.tabContent}>
            {deviceInfo ? (
                <>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>📱 Device</Text>
                        <Text style={styles.infoText}>Model: {deviceInfo.model}</Text>
                        <Text style={styles.infoText}>Brand: {deviceInfo.brand}</Text>
                        <Text style={styles.infoText}>OS: {deviceInfo.os} {deviceInfo.osVersion}</Text>
                        <Text style={styles.infoText}>Emulator: {deviceInfo.isEmulator ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>📦 App</Text>
                        <Text style={styles.infoText}>Version: {deviceInfo.appVersion}</Text>
                        <Text style={styles.infoText}>Build: {deviceInfo.buildNumber}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>🔋 Battery</Text>
                        <Text style={styles.infoText}>Level: {deviceInfo.batteryLevel}%</Text>
                        <Text style={styles.infoText}>State: {deviceInfo.batteryState}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>📶 Network</Text>
                        <Text style={styles.infoText}>Type: {deviceInfo.networkType}</Text>
                        <Text style={styles.infoText}>Connected: {deviceInfo.isConnected ? 'Yes' : 'No'}</Text>
                        <Text style={styles.infoText}>Internet: {deviceInfo.isInternetReachable ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>⚡ Performance</Text>
                        <Text style={styles.infoText}>Total Lags: {getLagStats().totalLags}</Text>
                        <Text style={styles.infoText}>Max Lag: {getLagStats().maxLag}ms</Text>
                    </View>
                </>
            ) : (
                <Text style={styles.loadingText}>Loading device info...</Text>
            )}
        </ScrollView>
    );

    const renderQueueTab = () => {
        const queue = getOfflineQueue();
        return (
            <ScrollView style={styles.tabContent}>
                <Text style={styles.sectionTitle}>📦 Offline Queue ({queue.length} jobs)</Text>
                {queue.length === 0 ? (
                    <Text style={styles.emptyText}>No pending offline jobs</Text>
                ) : (
                    queue.map((job, i) => (
                        <View key={job.id} style={styles.queueItem}>
                            <Text style={styles.queueType}>{job.type.toUpperCase()}</Text>
                            <Text style={styles.queueTable}>{job.table}</Text>
                            <Text style={styles.queueMeta}>
                                Age: {Math.round((Date.now() - job.timestamp) / 1000)}s | Retries: {job.retryCount}
                            </Text>
                        </View>
                    ))
                )}
                <TouchableOpacity style={styles.inspectButton} onPress={inspectQueue}>
                    <Text style={styles.inspectButtonText}>Inspect Queue</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.tabs}>
                {(['logs', 'device', 'queue'] as const).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {activeTab === 'logs' && (
                <>
                    <View style={styles.filterRow}>
                        {['all', 'log', 'warn', 'error'].map(f => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.filterButton, filter === f && styles.activeFilter]}
                                onPress={() => setFilter(f)}
                            >
                                <Text style={styles.filterText}>{f}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.clearButton} onPress={() => {
                            logger.clearLogs();
                            refreshLogs();
                        }}>
                            <Text style={styles.clearText}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={filteredLogs}
                        renderItem={renderLogItem}
                        keyExtractor={(_, i) => i.toString()}
                        style={styles.logList}
                        refreshControl={
                            <RefreshControl refreshing={false} onRefresh={refreshLogs} />
                        }
                    />
                </>
            )}

            {activeTab === 'device' && renderDeviceTab()}
            {activeTab === 'queue' && renderQueueTab()}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1a2e' },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#333' },
    tab: { flex: 1, padding: 12, alignItems: 'center' },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#4ecdc4' },
    tabText: { color: '#888', fontSize: 14 },
    activeTabText: { color: '#4ecdc4', fontWeight: '600' },
    filterRow: { flexDirection: 'row', padding: 8, gap: 8 },
    filterButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#333' },
    activeFilter: { backgroundColor: '#4ecdc4' },
    filterText: { color: '#fff', fontSize: 12 },
    clearButton: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6 },
    clearText: { color: '#ff6b6b', fontSize: 12 },
    logList: { flex: 1 },
    logItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
    logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    logLevel: { fontSize: 10, fontWeight: 'bold' },
    logTime: { fontSize: 10, color: '#666' },
    logMessage: { color: '#fff', fontSize: 12, fontFamily: 'monospace' },
    logData: { color: '#888', fontSize: 10, fontFamily: 'monospace', marginTop: 4 },
    tabContent: { flex: 1, padding: 16 },
    sectionTitle: { color: '#4ecdc4', fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    infoSection: { marginBottom: 8 },
    infoText: { color: '#ccc', fontSize: 14, marginBottom: 4 },
    loadingText: { color: '#888', textAlign: 'center', marginTop: 20 },
    emptyText: { color: '#666', textAlign: 'center', marginTop: 20 },
    queueItem: { backgroundColor: '#2a2a4e', padding: 12, borderRadius: 8, marginBottom: 8 },
    queueType: { color: '#ffd93d', fontSize: 12, fontWeight: 'bold' },
    queueTable: { color: '#fff', fontSize: 14, marginTop: 4 },
    queueMeta: { color: '#888', fontSize: 10, marginTop: 4 },
    inspectButton: { backgroundColor: '#4ecdc4', padding: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
    inspectButtonText: { color: '#1a1a2e', fontWeight: '600' },
});

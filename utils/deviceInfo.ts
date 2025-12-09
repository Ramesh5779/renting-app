import { logger } from "@/utils/logger";
import NetInfo from "@react-native-community/netinfo";
import * as Application from "expo-application";
import * as Battery from "expo-battery";
import * as Device from "expo-device";

export interface DeviceDiagnostics {
    // Device Info
    model: string | null;
    brand: string | null;
    os: string | null;
    osVersion: string | null;
    isEmulator: boolean;

    // App Info
    appVersion: string | null;
    buildNumber: string | null;

    // Battery
    batteryLevel: number;
    batteryState: string;

    // Network
    networkType: string;
    isConnected: boolean | null;
    isInternetReachable: boolean | null;

    // Timestamp
    timestamp: string;
}

export async function getDeviceDiagnostics(): Promise<DeviceDiagnostics> {
    try {
        const [batteryLevel, batteryState, network] = await Promise.all([
            Battery.getBatteryLevelAsync(),
            Battery.getBatteryStateAsync(),
            NetInfo.fetch(),
        ]);

        const batteryStateMap: Record<number, string> = {
            [Battery.BatteryState.UNKNOWN]: 'unknown',
            [Battery.BatteryState.UNPLUGGED]: 'unplugged',
            [Battery.BatteryState.CHARGING]: 'charging',
            [Battery.BatteryState.FULL]: 'full',
        };

        const diagnostics: DeviceDiagnostics = {
            // Device
            model: Device.modelName,
            brand: Device.brand,
            os: Device.osName,
            osVersion: Device.osVersion,
            isEmulator: !Device.isDevice,

            // App
            appVersion: Application.nativeApplicationVersion,
            buildNumber: Application.nativeBuildVersion,

            // Battery
            batteryLevel: Math.round(batteryLevel * 100),
            batteryState: batteryStateMap[batteryState] || 'unknown',

            // Network
            networkType: network.type,
            isConnected: network.isConnected,
            isInternetReachable: network.isInternetReachable,

            // Timestamp
            timestamp: new Date().toISOString(),
        };

        return diagnostics;
    } catch (error) {
        logger.error("Failed to get device diagnostics", error);
        throw error;
    }
}

export async function logDeviceDiagnostics(): Promise<void> {
    const diagnostics = await getDeviceDiagnostics();

    logger.log("📱 DEVICE DIAGNOSTICS", {
        device: `${diagnostics.brand} ${diagnostics.model}`,
        os: `${diagnostics.os} ${diagnostics.osVersion}`,
        isEmulator: diagnostics.isEmulator,
        app: `v${diagnostics.appVersion} (${diagnostics.buildNumber})`,
        battery: `${diagnostics.batteryLevel}% (${diagnostics.batteryState})`,
        network: `${diagnostics.networkType} (connected: ${diagnostics.isConnected})`,
    });
}

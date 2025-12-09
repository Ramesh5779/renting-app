import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Custom hook to detect network connectivity
 * Returns true if connected to internet, false otherwise
 */
export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean>(true);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? true);
            setIsInternetReachable(state.isInternetReachable ?? true);
        });

        // Get initial state
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected ?? true);
            setIsInternetReachable(state.isInternetReachable ?? true);
        });

        return () => unsubscribe();
    }, []);

    return {
        isConnected,
        isInternetReachable,
        isOnline: isConnected && isInternetReachable,
    };
};

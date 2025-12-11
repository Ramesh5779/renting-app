import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/utils/timeout";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function useSupabaseReconnect() {
    useEffect(() => {
        const handleAppStateChange = async (state: AppStateStatus) => {
            if (state === "active") {
                console.log("🟡 App became active → reconnecting Supabase...");
                await reconnectSupabase();
            }
        };

        const sub = AppState.addEventListener("change", handleAppStateChange);

        // Run reconnect on initial app open
        reconnectSupabase();

        return () => sub.remove();
    }, []);
}

async function reconnectSupabase() {
    try {
        console.log("🔄 Starting Supabase reconnect sequence...");

        // 1️⃣ Fetch current session with timeout (10 seconds)
        const { data: sessionData, error: sessionError } = await withTimeout(
            supabase.auth.getSession(),
            10000,
            "Session fetch timed out"
        );

        if (sessionError) {
            console.log("⚠️  Session fetch error:", sessionError.message);

            // Check if it's an expired/invalid token error
            if (sessionError.message?.includes("Invalid Refresh Token") ||
                sessionError.message?.includes("Refresh Token Not Found")) {
                console.log("ℹ️  Session expired or not found - continuing in guest mode");
                // Don't throw - allow app to continue in guest mode
                return;
            }
        }

        // 2️⃣ Attempt to refresh session if we have one
        if (sessionData?.session) {
            try {
                await withTimeout(
                    supabase.auth.refreshSession(),
                    10000,
                    "Session refresh timed out"
                );
                console.log("✅ Session refreshed successfully");
            } catch (refreshError: any) {
                console.log("⚠️  Session refresh failed:", refreshError.message);
                // Continue anyway - not critical for guest browsing
            }
        }

        // 3️⃣ Lightweight connectivity check with timeout
        await withTimeout(
            supabase.from("room_listings").select("id").limit(1),
            10000,
            "Database connectivity check timed out"
        );

        console.log("🟢 Supabase reconnected successfully");
    } catch (err: any) {
        console.error("🔴 Supabase reconnect failed:", err.message);
        // Don't throw - let app continue with potentially degraded functionality
        // The ConnectionStatus component will show error UI if needed
    }
}

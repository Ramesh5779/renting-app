import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function useSupabaseReconnect() {
    useEffect(() => {
        const handleAppStateChange = async (state: AppStateStatus) => {
            if (state === "active") {
                console.log("🟡 App resumed → reconnecting Supabase...");
                await reconnectSupabase();
            }
        };

        const sub = AppState.addEventListener("change", handleAppStateChange);

        reconnectSupabase(); // Run on first app open too

        return () => sub.remove();
    }, []);
}

async function reconnectSupabase() {
    try {
        // 1️⃣ Always re-fetch session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) console.log("Session fetch error:", sessionError);

        // 2️⃣ Always force refresh when app wakes up
        await supabase.auth.refreshSession();

        // 3️⃣ Do a very small test request to reset dead network
        // Using 'room_listings' table as a lightweight check since 'profiles' might rely on auth and we want to just check connectivity
        // actually user suggested 'profiles', let's stick to 'profiles' if it exists. 
        // Wait, earlier I saw 'profiles' table usage in 'fix_owner_name_uuids.sql', so it exists.
        await supabase.from("profiles").select("id").limit(1);

        console.log("🟢 Supabase fully reconnected.");
    } catch (err: any) {
        console.log("🔴 Reconnect failed:", err.message);
    }
}

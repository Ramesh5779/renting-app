import Constants from "expo-constants";

export function checkEnv() {
    console.log("🔍 Environment Check:");
    console.log("URL:", Constants.expoConfig?.extra?.supabaseUrl);
    console.log("KEY:", Constants.expoConfig?.extra?.supabaseAnonKey?.slice(0, 6) + "...");
}

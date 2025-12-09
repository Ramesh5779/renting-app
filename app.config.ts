import 'dotenv/config';

export default {
    expo: {
        name: "renting-app",
        slug: "renting-app",
        version: "1.0.2",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "rentingapp",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,

        extra: {
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
            eas: {
                projectId: "8ca51af1-a065-41f7-9542-e2fe13cccaa6"
            }
        },

        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/splash-icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ],
            "expo-web-browser",
            [
                "expo-build-properties",
                {
                    ios: { useFrameworks: "static" }
                }
            ]
        ],

        ios: {
            supportsTablet: true,
            infoPlist: {
                NSCameraUsageDescription: "This app needs access to camera to take photos of your room",
                NSPhotoLibraryUsageDescription: "This app needs access to photo library to select room images",
                NSLocationWhenInUseUsageDescription: "This app needs access to location to help fill in your address"
            }
        },
        android: {
            package: "com.renthive.app",
            versionCode: 397,
            adaptiveIcon: {
                backgroundColor: "#E6F4FE",
                foregroundImage: "./assets/images/android-icon-foreground.png",
                backgroundImage: "./assets/images/android-icon-background.png",
                monochromeImage: "./assets/images/android-icon-monochrome.png"
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            permissions: [
                "android.permission.CAMERA",
                "android.permission.READ_MEDIA_IMAGES",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ]
        },
        web: {
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        experiments: {
            typedRoutes: true,
            reactCompiler: true
        }
    }
};

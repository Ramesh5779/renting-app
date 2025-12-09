import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { FlatList, LayoutChangeEvent, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ImageCarouselProps {
    images: string[];
    height?: number;
    style?: ViewStyle;
    contentFit?: 'cover' | 'contain';
    onPress?: () => void;
}

function RobustImage({ uri, contentFit }: { uri: string, contentFit: 'cover' | 'contain' }) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!uri) {
        return (
            <View style={styles.errorContainer}>
                <IconSymbol name="photo" size={32} color="#999" />
                <Text style={styles.errorText}>No image</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <IconSymbol name="photo" size={32} color="#999" />
                <Text style={styles.errorText}>Failed to load</Text>
            </View>
        );
    }

    return (
        <View style={styles.imageWrapper}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            )}
            <Image
                source={{ uri }}
                style={styles.image}
                contentFit={contentFit}
                transition={200}
                onError={(e) => {
                    console.error('[ImageCarousel] ❌ Failed to load:', uri.substring(0, 50));
                    setError(true);
                    setLoading(false);
                }}
                onLoad={() => {
                    console.log('[ImageCarousel] ✅ Loaded successfully');
                    setLoading(false);
                }}
            />
        </View>
    );
}

export function ImageCarousel({
    images,
    height = 240,
    style,
    contentFit = 'cover',
    onPress,
}: ImageCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [width, setWidth] = useState(0);

    const handleScroll = (event: any) => {
        if (width === 0) return;
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const onLayout = (e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    };

    if (!images || images.length === 0) {
        return (
            <Pressable onPress={onPress} style={[styles.container, { height }, style]}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' }}
                    style={styles.image}
                    contentFit={contentFit}
                    transition={200}
                />
            </Pressable>
        );
    }

    return (
        <View style={[styles.container, { height, backgroundColor: '#E5E7EB' }, style]} onLayout={onLayout}>
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={onPress}
                        style={{ width: width || 300, height: '100%', backgroundColor: '#E5E7EB' }}
                    >
                        <RobustImage uri={item} contentFit={contentFit} />
                    </Pressable>
                )}
                getItemLayout={(_, index) => ({
                    length: width || 300,
                    offset: (width || 300) * index,
                    index,
                })}
                style={styles.flatList}
            />

            {images.length > 1 && (
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        backgroundColor: '#E5E7EB',
    },
    flatList: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
    },
    pagination: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    activeDot: {
        width: 20,
        backgroundColor: '#FFFFFF',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    errorContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffebee',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    debugText: {
        color: '#666',
        fontSize: 10,
        marginTop: 2,
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        zIndex: 1,
    },
    loadingText: {
        color: '#666',
        fontSize: 12,
    }
});

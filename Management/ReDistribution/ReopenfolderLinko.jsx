import React, { useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Alert, Linking } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { link, returnArr } from "../ReConst/reLinkoDecor";
import { card, form, shared } from '../../assets/styles';

const ReopenfolderLinko = ({ group }) => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const linkAnimations = useRef(group.links.map(() => new Animated.Value(50))).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();

        Animated.stagger(100, linkAnimations.map(anim =>
            Animated.spring(anim, {
                toValue: 0,
                useNativeDriver: true,
            })
        )).start();
    }, []);

     const handleLinkPress = async (linkItem) => {
        try {
            if (!linkItem?.link) {
                Alert.alert("Error", "Invalid link item");
                return;
            }

            const linkUrl = String(linkItem.link).trim();
            if (!linkUrl) {
                Alert.alert("Error", "Empty link URL");
                return;
            }

            const formattedUrl = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
            
            const supported = await Linking.canOpenURL(formattedUrl);
            if (!supported) {
                Alert.alert("Error", "Cannot open this URL");
                return;
            }

            const now = new Date();
            const historyEntry = {
                ...linkItem,
                link: linkUrl,
                openDate: now.toLocaleDateString('en-GB').replace(/\//g, '.'),
                openTime: now.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                }),
                fullTimestamp: now.toISOString()
            };

            const existingHistory = await AsyncStorage.getItem('HISTORY_OPENED');
            const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
            await AsyncStorage.setItem(
                'HISTORY_OPENED', 
                JSON.stringify([historyEntry, ...historyArray])
            );

            await Linking.openURL(formattedUrl);

        } catch (error) {
            console.error('Error handling link:', error);
            Alert.alert("Error", "Failed to process the link");
        }
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={form.backButton}
                onPress={() => navigation.goBack()}
            >
                <Image source={returnArr} style={form.backIcon} />
            </TouchableOpacity>

            <Text style={[shared.title, {alignSelf: 'flex-end', width: '75%', marginBottom: 24}]}>{group.title}</Text>

            {group.links.length > 0 ? (
                <ScrollView style={{ width: '100%' }}>
                    {group.links.map((linkItem, idx) => (
                        <Animated.View
                            key={idx}
                            style={{
                                transform: [{ translateY: linkAnimations[idx] }],
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={card.container}
                                onPress={() => handleLinkPress(linkItem)}
                            >
                                <Image source={link} style={card.icon} />
                                <View style={{ flex: 1 }}>
                                    <Text style={card.title}>{linkItem.description}</Text>
                                    <Text style={card.text}>{linkItem.tags.join(', ')}</Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                    <View style={{ height: 150 }} />
                </ScrollView>
            ) : (
                <View>
                    <Text style={shared.notFoundText}>You do not have any links yet</Text>
                </View>
            )}
        </Animated.View>
    );
};

export default ReopenfolderLinko;
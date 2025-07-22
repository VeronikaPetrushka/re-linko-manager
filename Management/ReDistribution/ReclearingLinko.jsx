import React, { useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Animated, Alert, Image, Easing } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { form, shared } from "../../assets/styles";
import { logoClear, returnArr } from '../ReConst/reLinkoDecor';

const ReclearingLinko = () => {
    const navigation = useNavigation();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.spring(buttonSlide, {
                toValue: 0,
                delay: 200,
                speed: 12,
                bounciness: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const clearHistory = async () => {
        Alert.alert(
            "Clear History",
            "Are you sure you want to delete all your history?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Clear", 
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('HISTORY_OPENED');
                            Alert.alert("Success", "History cleared successfully");
                            // Success animation
                            Animated.sequence([
                                Animated.timing(buttonScale, {
                                    toValue: 1.1,
                                    duration: 100,
                                    useNativeDriver: true,
                                }),
                                Animated.spring(buttonScale, {
                                    toValue: 1,
                                    friction: 3,
                                    useNativeDriver: true,
                                })
                            ]).start();
                        } catch (error) {
                            console.error('Error clearing history:', error);
                            Alert.alert("Error", "Failed to clear history");
                        }
                    } 
                }
            ]
        );
    };

    const clearLinks = async () => {
        Alert.alert(
            "Clear All Links",
            "This will permanently delete all your saved links. Continue?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { 
                    text: "Clear All", 
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('MY_LINKS');
                            Alert.alert("Success", "All links cleared successfully");
                            // Success animation
                            Animated.sequence([
                                Animated.timing(buttonScale, {
                                    toValue: 1.1,
                                    duration: 100,
                                    useNativeDriver: true,
                                }),
                                Animated.spring(buttonScale, {
                                    toValue: 1,
                                    friction: 3,
                                    useNativeDriver: true,
                                })
                            ]).start();
                        } catch (error) {
                            console.error('Error clearing links:', error);
                            Alert.alert("Error", "Failed to clear links");
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>

            <TouchableOpacity 
                style={[form.backButton, {zIndex: 10}]}
                onPress={() => navigation.goBack()} 
            >
                <Image source={returnArr} style={form.backIcon} />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: logoScale }] }}>
                <Image source={logoClear} style={[form.logo, {width: 140}]} />
            </Animated.View>
            
            <Animated.View style={{ transform: [{ translateY: buttonSlide }], width: '100%' }}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[form.button, { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }]}
                        onPress={clearHistory}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>History</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[form.button, { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }]}
                        onPress={clearLinks}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>All links</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

        </Animated.View>
    );
};

export default ReclearingLinko;
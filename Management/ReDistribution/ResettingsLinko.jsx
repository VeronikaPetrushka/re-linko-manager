import React, { useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, Animated, Linking, Alert, Easing } from "react-native";
import { form, shared } from "../../assets/styles";

const ResettingsLinko = () => {
    const navigation = useNavigation();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const titleSlide = useRef(new Animated.Value(30)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(titleSlide, {
                toValue: 0,
                speed: 12,
                bounciness: 8,
                useNativeDriver: true,
            }),
            Animated.spring(buttonSlide, {
                toValue: 0,
                delay: 100,
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

    const openPrivacyPolicy = async () => {
        try {
            const url = 'https://www.termsfeed.com/live/f52800e4-dcef-41b8-a528-b1e9ef42e33b';
            const supported = await Linking.canOpenURL(url);
            
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Error", "Cannot open the privacy policy");
            }
        } catch (error) {
            console.error('Error opening privacy policy:', error);
            Alert.alert("Error", "Failed to open privacy policy");
        }
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>
            <Animated.View style={{ transform: [{ translateY: titleSlide }] }}>
                <Text style={[shared.title, { marginBottom: 16 }]}>Settings</Text>
            </Animated.View>

            <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[form.button, { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }]}
                        onPress={() => navigation.navigate('RemanagetagLinkoF')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>Tag Management</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[form.button, { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }]}
                        onPress={() => navigation.navigate('ReclearingLinkoF')}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>Clearing</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[form.button, { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }]}
                        onPress={openPrivacyPolicy}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>Privacy Policy</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
};

export default ResettingsLinko;
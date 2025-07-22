import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { link, whiteBall } from "../ReConst/reLinkoDecor";
import { card, shared } from '../../assets/styles';

const RecollectionsLinko = () => {
    const navigation = useNavigation();
    const [myCollectionsStorage, setMyCollectionsStorage] = useState([]);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const titleSlide = useRef(new Animated.Value(-30)).current;
    const buttonScale = useRef(new Animated.Value(0)).current;
    const cardAnimations = useRef([]).current;

    useEffect(() => {
        cardAnimations.current = myCollectionsStorage.map(() => new Animated.Value(0));
    }, [myCollectionsStorage]);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const storedLinks = await AsyncStorage.getItem('MY_COLLECTIONS');
                
                if (storedLinks) {
                    const parsedLinks = JSON.parse(storedLinks);
                    setMyCollectionsStorage(parsedLinks);
                }
                
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.spring(titleSlide, {
                        toValue: 0,
                        speed: 12,
                        bounciness: 8,
                        useNativeDriver: true,
                    }),
                    Animated.spring(buttonScale, {
                        toValue: 1,
                        friction: 5,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    myCollectionsStorage.forEach((_, index) => {
                        if (cardAnimations[index]) {
                            Animated.spring(cardAnimations[index], {
                                toValue: 1,
                                delay: index * 80,
                                friction: 6,
                                tension: 40,
                                useNativeDriver: true,
                            }).start();
                        }
                    });
                });
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        };

        fetchLinks();
    }, []);

    const handleCardPress = (group) => {
        const cardIndex = myCollectionsStorage.findIndex(g => g.title === group.title);
        
        if (cardAnimations[cardIndex]) {
            Animated.sequence([
                Animated.timing(cardAnimations[cardIndex], {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(cardAnimations[cardIndex], {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                })
            ]).start(() => {
                navigation.navigate('ReopenfolderLinkoF', {group});
            });
        } else {
            navigation.navigate('ReopenfolderLinkoF', {group});
        }
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>
            <Animated.View 
                style={[
                    shared.row, 
                    { 
                        marginBottom: 16,
                        transform: [{ translateX: titleSlide }]
                    }
                ]}
            >
                <Text style={[shared.title, {width: '60%'}]}>GROUPS AND COLLECTIONS</Text>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity 
                        style={shared.ballButton}
                        onPress={() => navigation.navigate('RenewgroupLinkoF')}
                        activeOpacity={0.7}
                    >
                        <Image source={whiteBall} style={shared.ballButtonImage} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {myCollectionsStorage.length > 0 ? (
                <ScrollView style={{width: '100%'}}>
                    {myCollectionsStorage.map((group, idx) => {
                        const animValue = cardAnimations[idx] || new Animated.Value(1);
                        
                        return (
                            <Animated.View
                                key={idx}
                                style={{
                                    opacity: animValue,
                                    transform: [
                                        { 
                                            translateY: animValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [20, 0]
                                            })
                                        },
                                        {
                                            scale: animValue.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.9, 1]
                                            })
                                        }
                                    ]
                                }}
                            >
                                <TouchableOpacity 
                                    style={card.container}
                                    onPress={() => handleCardPress(group)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[card.title, {marginBottom: 0}]}>{group.title}</Text>
                                    <Animated.View
                                        style={{
                                            position: 'absolute',
                                            right: 15,
                                            transform: [
                                                {
                                                    rotate: animValue.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['90deg', '0deg']
                                                    })
                                                }
                                            ]
                                        }}
                                    >
                                        <Image source={link} style={{ width: 20, height: 20 }} />
                                    </Animated.View>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                    <View style={{ height: 150 }} />
                </ScrollView>
            ) : (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={shared.notFoundText}>You do not have any groups yet</Text>
                </Animated.View>
            )}
        </Animated.View>
    );
};

export default RecollectionsLinko;
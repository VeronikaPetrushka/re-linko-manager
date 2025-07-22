import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { card, shared } from "../../assets/styles";

const ReremindersLinko = () => {
    const [myOpenedHistoryStorage, setMyOpenedHistoryStorage] = useState([]);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(20)).current;
    const itemOpacity = useRef(new Animated.Value(0)).current;
    const itemScale = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        // Entry animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(slideUpAnim, {
                toValue: 0,
                speed: 12,
                bounciness: 8,
                useNativeDriver: true,
            })
        ]).start();

        const fetchHistory = async () => {
            try {
                const history = await AsyncStorage.getItem('HISTORY_OPENED');
                if (history) {
                    const parsedHistory = JSON.parse(history);
                    const sortedHistory = parsedHistory.sort((a, b) => 
                        new Date(b.fullTimestamp) - new Date(a.fullTimestamp)
                    );
                    setMyOpenedHistoryStorage(sortedHistory);
                    
                    // Animate items in
                    Animated.stagger(100, sortedHistory.map((_, i) => (
                        Animated.parallel([
                            Animated.spring(itemOpacity, {
                                toValue: 1,
                                delay: i * 80,
                                useNativeDriver: true,
                            }),
                            Animated.spring(itemScale, {
                                toValue: 1,
                                delay: i * 80,
                                friction: 3,
                                useNativeDriver: true,
                            })
                        ])
                    ))).start();
                }
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };

        fetchHistory();
    }, []);

    const modifiedDate = (item) => {
        if (!item.fullTimestamp) return item.openDate || '';
        
        const now = new Date();
        const historyDate = new Date(item.fullTimestamp);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        if (historyDate > oneWeekAgo) {
            return historyDate.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        return item.openDate;
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>
            <Animated.View style={{ transform: [{ translateY: slideUpAnim }] }}>
                <Text style={[shared.title, { marginBottom: 16 }]}>History</Text>
            </Animated.View>
            
            {myOpenedHistoryStorage.length > 0 ? (
                <ScrollView style={{ width: '100%' }}>
                    {myOpenedHistoryStorage.map((item, id) => (
                        <Animated.View 
                            key={id} 
                            style={[
                                { 
                                    marginBottom: 15,
                                    opacity: itemOpacity,
                                    transform: [{ scale: itemScale }]
                                }
                            ]}
                        >
                            <Text style={card.title}>{item.description}</Text>
                            <Text style={card.text}>
                                {modifiedDate(item)}, {item.openTime}
                            </Text>
                            {item.link && (
                                <Text 
                                    style={{color: '#FF1464', marginTop: 4}} 
                                    numberOfLines={1} 
                                    ellipsizeMode='tail'
                                >
                                    {item.link}
                                </Text>
                            )}
                        </Animated.View>
                    ))}
                    <View style={{height: 200}} />
                </ScrollView>
            ) : (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={shared.notFoundText}>Your history is clear yet</Text>
                </Animated.View>
            )}
        </Animated.View>
    );
};

export default ReremindersLinko;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Animated, Easing, Linking, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { button, link, pin, search } from "../ReConst/reLinkoDecor";
import { card, shared } from '../../assets/styles';

const RemylinksLinko = () => {
    const navigation = useNavigation();
    const [myLinksStorage, setMyLinksStorage] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pinnedLinks, setPinnedLinks] = useState([]);
    const fadeAnim = new Animated.Value(0);

    const fetchLinks = async () => {
        try {
            const storedLinks = await AsyncStorage.getItem('MY_LINKS');
            const storedPinnedLinks = await AsyncStorage.getItem('PINNED_LINKS');
            
            if (storedLinks) {
                const parsedLinks = JSON.parse(storedLinks);
                setMyLinksStorage(parsedLinks);
                setFilteredLinks(parsedLinks);
            }

            if (storedPinnedLinks) {
                setPinnedLinks(JSON.parse(storedPinnedLinks));
            }
            
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLinks();
        }, [])
    );

    useEffect(() => {
        fetchLinks();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            const sortedLinks = [...myLinksStorage].sort((a, b) => {
                const aPinned = pinnedLinks.some(link => link.id === a.id);
                const bPinned = pinnedLinks.some(link => link.id === b.id);
                
                if (aPinned && !bPinned) return -1;
                if (!aPinned && bPinned) return 1;
                return 0;
            });
            setFilteredLinks(sortedLinks);
            return;
        }

        const filtered = myLinksStorage.filter(linkItem => {
            const searchLower = searchQuery.toLowerCase();
            return (
                linkItem.description.toLowerCase().includes(searchLower) ||
                linkItem.link.toLowerCase().includes(searchLower) ||
                linkItem.tags.some(tag => tag.toLowerCase().includes(searchLower)
            ));
        });

        const sortedFiltered = [...filtered].sort((a, b) => {
            const aPinned = pinnedLinks.some(link => link.id === a.id);
            const bPinned = pinnedLinks.some(link => link.id === b.id);
            
            if (aPinned && !bPinned) return -1;
            if (!aPinned && bPinned) return 1;
            return 0;
        });
        
        setFilteredLinks(sortedFiltered);
    }, [searchQuery, myLinksStorage, pinnedLinks]);
    
    const handlePinLink = async (linkItem) => {
        try {
            let updatedPinnedLinks;
            
            if (pinnedLinks.some(link => link.id === linkItem.id)) {
                updatedPinnedLinks = pinnedLinks.filter(link => link.id !== linkItem.id);
            } else {
                updatedPinnedLinks = [...pinnedLinks, linkItem];
            }
            
            await AsyncStorage.setItem('PINNED_LINKS', JSON.stringify(updatedPinnedLinks));
            setPinnedLinks(updatedPinnedLinks);
            
            setFilteredLinks(prev => [...prev]);
        } catch (error) {
            console.error('Error pinning link:', error);
            Alert.alert("Error", "Failed to pin the link");
        }
    };

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
    
    const linkPinned = (linkID) => {
        return pinnedLinks.some(link => link.id === linkID)
    };

    return (
        <View style={shared.container}>
            <View style={[shared.row, {marginBottom: 16}]}>
                <Text style={shared.title}>MY LINKS</Text>
                <TouchableOpacity 
                    style={shared.ballButton}
                    onPress={() => navigation.navigate('RenewlinkLinkoF')}
                >
                    <Image source={button} style={shared.ballButtonImage} />
                </TouchableOpacity>
            </View>

            <View style={{width: '80%', marginBottom: 30}}>
                <TextInput
                    style={shared.searchInput}
                    placeholder="Search links..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={{position: 'absolute', top: 5, right: 7}}>
                    <Image source={search} style={shared.searchIcon} />
                </View>
            </View>

            {filteredLinks.length > 0 ? (
                <ScrollView style={{width: '100%'}}>
                    {filteredLinks.map((linkItem, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            style={card.container}
                            onPress={() => handleLinkPress(linkItem)}
                            onLongPress={() => handlePinLink(linkItem)}
                        >
                            <Image source={link} style={card.icon} />
                            <View>
                                <Text style={card.title}>{linkItem.description}</Text>
                                <Text style={card.text}>{linkItem.tags.join(', ')}</Text>
                            </View>
                            {
                                linkPinned(linkItem.id) && (
                                    <Image source={pin} />
                                )
                            }
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 150 }} />
                </ScrollView>
            ) : (
                <View>
                    {searchQuery ? (
                        <Text style={shared.notFoundText}>No links found for "{searchQuery}"</Text>
                    ) : (
                        <Text style={shared.notFoundText}>You do not have any links yet</Text>
                    )}
                </View>
            )}
            
        </View>
    );
};

export default RemylinksLinko;
// add logic to pin links

import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Animated, Easing, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { button, link, pin, search } from "../ReConst/reLinkoDecor";
import WebView from 'react-native-webview';

const RemylinksLinko = () => {
    const navigation = useNavigation();
    const [myLinksStorage, setMyLinksStorage] = useState([]);
    const [filteredLinks, setFilteredLinks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [pinnedLinks, setPinnedLinks] = useState([]);
    const fadeAnim = new Animated.Value(0);

    // Retrieve links from storage
    useEffect(() => {
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
                
                // Fade animation
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

        fetchLinks();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            // Sort with pinned items first
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

        // Sort filtered results with pinned items first
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
                // Unpin the link
                updatedPinnedLinks = pinnedLinks.filter(link => link.id !== linkItem.id);
            } else {
                // Pin the link
                updatedPinnedLinks = [...pinnedLinks, linkItem];
            }
            
            await AsyncStorage.setItem('PINNED_LINKS', JSON.stringify(updatedPinnedLinks));
            setPinnedLinks(updatedPinnedLinks);
            
            // Trigger re-sorting by updating filteredLinks
            setFilteredLinks(prev => [...prev]);
        } catch (error) {
            console.error('Error pinning link:', error);
            Alert.alert("Error", "Failed to pin the link");
        }
    };

    const handleLinkPress = async (url) => {
        try {
            // Check if URL has protocol, add https if missing
            const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
            const supported = await Linking.canOpenURL(formattedUrl);
            
            if (supported) {
                await Linking.openURL(formattedUrl);
            } else {
                Alert.alert("Error", "Cannot open this URL");
            }
        } catch (error) {
            console.error('Error opening URL:', error);
            Alert.alert("Error", "Failed to open the link");
        }
    };

    const renderTags = (tags) => {
        return tags.map((tag, index) => (
            <Text key={index}>{tag}</Text>
        ));
    };

    const linkPinned = (linkID) => {
        return pinnedLinks.some(link => link.id === linkID)
    };

    return (
        <Animated.View style={[{ opacity: fadeAnim }]}>
            <View>
                <Text>MY LINKS</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('RenewlinkLinkoF')}
                >
                    <Image source={button} />
                </TouchableOpacity>
            </View>

            <View>
                <View>
                    <TextInput
                        placeholder="Search links..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <View>
                        <Image source={search} />
                    </View>
                </View>
            </View>

            {filteredLinks.length > 0 ? (
                <ScrollView>
                    {filteredLinks.map((linkItem, idx) => (
                        <TouchableOpacity 
                            key={idx} 
                            onPress={() => handleLinkPress(linkItem.link)}
                            onLongPress={() => handlePinLink(linkItem)}
                        >
                            <Image source={link} />
                            <View>
                                <Text>{linkItem.description}</Text>
                                <View>
                                    {renderTags(linkItem.tags)}
                                </View>
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
                        <Text>No links found for "{searchQuery}"</Text>
                    ) : (
                        <Text>You do not have any links yet</Text>
                    )}
                </View>
            )}
        </Animated.View>
    );
};

export default RemylinksLinko;
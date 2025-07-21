import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Easing, 
  Modal, 
  Alert,
  LayoutAnimation,
  Platform,
  UIManager
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logo, returnArr } from "../ReConst/reLinkoDecor";
import reLinkoTags from "../ReConst/reLinkoTags";
import Checkbox from '../ReShare/Checkbox';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RenewlinkLinko = () => {
    const navigation = useNavigation();
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagsSelectionListVisible, setTagsSelectionListVisible] = useState(false);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const modalSlide = useRef(new Animated.Value(300)).current;
    const tagItemOpacity = useRef(new Animated.Value(0)).current;
    const tagItemScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true,
            })
        ]).start();

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, []);

    useEffect(() => {
        if (tagsSelectionListVisible) {
            Animated.timing(modalSlide, {
                toValue: 0,
                duration: 400,
                easing: Easing.out(Easing.back(1)),
                useNativeDriver: true,
            }).start();
            
            reLinkoTags.forEach((_, index) => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.timing(tagItemOpacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }),
                        Animated.spring(tagItemScale, {
                            toValue: 1,
                            friction: 5,
                            useNativeDriver: true,
                        })
                    ]).start();
                }, index * 50);
            });
        } else {
            modalSlide.setValue(300);
            tagItemOpacity.setValue(0);
            tagItemScale.setValue(0.8);
        }
    }, [tagsSelectionListVisible]);

    const handleTagSelection = (tag) => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            })
        ]).start();

        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    };

    const saveMyNewLinkToStorage = async () => {
        if (!link.trim()) {
            shakeAnimation();
            Alert.alert("Validation Error", "Please enter a link");
            return;
        }

        if (!description.trim()) {
            shakeAnimation();
            Alert.alert("Validation Error", "Please enter a description");
            return;
        }

        if (tags.length === 0) {
            shakeAnimation();
            Alert.alert("Validation Error", "Please select at least one tag");
            return;
        }

        try {
            Animated.sequence([
                Animated.timing(buttonScale, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonScale, {
                    toValue: 1,
                    friction: 3,
                    useNativeDriver: true,
                })
            ]).start();

            const newLink = {
                id: Date.now(),
                link: link.trim(),
                description: description.trim(),
                tags,
            };

            const existingLinks = await AsyncStorage.getItem('MY_LINKS');
            let updatedLinks = [];
            
            if (existingLinks) {
                updatedLinks = JSON.parse(existingLinks);
            }
            
            updatedLinks.unshift(newLink);
            await AsyncStorage.setItem('MY_LINKS', JSON.stringify(updatedLinks));
            
            Alert.alert("Success", "Link saved successfully!");
            navigation.goBack();
        } catch (error) {
            console.error('Error saving link:', error);
            Alert.alert("Error", "Failed to save the link");
        }
    };

    const shakeAnimation = () => {
        const shake = new Animated.Value(0);
        
        Animated.sequence([
            Animated.timing(shake, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shake, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shake, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shake, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start();
        
        return shake;
    };

    return (
        <Animated.View 
            style={[
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }
            ]}
        >
            <TouchableOpacity 
                onPress={() => navigation.goBack()} 
            >
                <Image source={returnArr} />
            </TouchableOpacity>

            <Animated.View 
                style={[
                    {
                        opacity: fadeAnim,
                        transform: [{
                            translateY: slideUpAnim.interpolate({
                                inputRange: [0, 30],
                                outputRange: [0, -10],
                                extrapolate: 'clamp'
                            })
                        }]
                    }
                ]}
            >
                <Image source={logo} />
            </Animated.View>

            <Animated.View 
                style={[
                    {
                        transform: [{
                            translateY: slideUpAnim.interpolate({
                                inputRange: [0, 30],
                                outputRange: [0, -5],
                                extrapolate: 'clamp'
                            })
                        }]
                    }
                ]}
            >
                <TextInput
                    value={link}
                    onChangeText={setLink}
                    placeholder="Link"
                    autoCapitalize="none"
                    keyboardType="url"
                />
            </Animated.View>

            <Animated.View 
                style={[
                    {
                        transform: [{
                            translateY: slideUpAnim.interpolate({
                                inputRange: [0, 30],
                                outputRange: [0, -5],
                                extrapolate: 'clamp'
                            })
                        }]
                    }
                ]}
            >
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    multiline
                />
            </Animated.View>

            <View>
                <Animated.View
                    style={{
                        transform: [{ scale: buttonScale }]
                    }}
                >
                    <TouchableOpacity 
                        onPress={() => setTagsSelectionListVisible(true)}
                    >
                        <Text>
                            {tags.length > 0 ? tags.join(', ') : "Select tags"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Modal
                    visible={tagsSelectionListVisible}
                    animationType="none"
                    transparent={false}
                    onRequestClose={() => setTagsSelectionListVisible(false)}
                >
                    <Animated.View 
                        style={[
                            {
                                transform: [{ translateY: modalSlide }]
                            }
                        ]}
                    >
                        <View>
                            <Text>Select Tags</Text>
                            <TouchableOpacity 
                                onPress={() => setTagsSelectionListVisible(false)}
                            >
                                <Text>Done</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.tagsList}>
                            {reLinkoTags.map((tag, id) => (
                                <Animated.View
                                    key={id}
                                    style={{
                                        opacity: tagItemOpacity,
                                        transform: [{ scale: tagItemScale }]
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => handleTagSelection(tag)}
                                    >
                                        <Text>{tag}</Text>
                                        <Checkbox 
                                            checked={tags.includes(tag)}
                                            onChange={(checked) => {
                                                if (checked) {
                                                    setTags([...tags, tag]);
                                                } else {
                                                    setTags(tags.filter(t => t !== tag));
                                                }
                                            }}
                                        />
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </Modal>
            </View>

            <Animated.View
                style={{
                    transform: [{ scale: buttonScale }]
                }}
            >
                <TouchableOpacity 
                    onPress={saveMyNewLinkToStorage}
                >
                    <Text>Create Link</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

export default RenewlinkLinko;
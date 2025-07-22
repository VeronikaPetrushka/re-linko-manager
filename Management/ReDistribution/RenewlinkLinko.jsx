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
import { checked, logo, returnArr } from "../ReConst/reLinkoDecor";
import reLinkoTags from "../ReConst/reLinkoTags";
import Checkbox from '../ReShare/Checkbox';
import { form, modal, shared } from '../../assets/styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RenewlinkLinko = () => {
    const navigation = useNavigation();
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagsSelectionListVisible, setTagsSelectionListVisible] = useState(false);

    const [customTags, setCustomTags] = useState(null);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const modalSlide = useRef(new Animated.Value(300)).current;
    const tagItemOpacity = useRef(new Animated.Value(0)).current;
    const tagItemScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const loadTags = async () => {
            try {
                const storedTags = await AsyncStorage.getItem('CUSTOM_TAGS');
                if (storedTags !== null) {
                    const parsed = JSON.parse(storedTags);
                    setCustomTags(Array.isArray(parsed) ? parsed : []);
                } else {
                    setCustomTags(null);
                }
            } catch (err) {
                console.error("Failed to load custom tags", err);
                setCustomTags(null);
            }
        };
        loadTags();
    }, []);

    const effectiveTags = customTags === null ? reLinkoTags : customTags;

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
            
            effectiveTags.forEach((_, index) => {
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
                shared.container,
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }
            ]}
        >
            <TouchableOpacity 
                style={[form.backButton, {zIndex: 10}]}
                onPress={() => navigation.goBack()} 
            >
                <Image source={returnArr} style={form.backIcon} />
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
                <Image source={logo} style={form.logo} />
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
                        }],
                        width: '100%'
                    }
                ]}
            >
                <TextInput
                    style={form.input}
                    value={link}
                    onChangeText={setLink}
                    placeholder="Link"
                    placeholderTextColor='#fff'
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
                        }],
                        width: '100%'
                    }
                ]}
            >
                <TextInput
                    style={form.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Description"
                    placeholderTextColor='#fff'
                    multiline
                />
            </Animated.View>

            <View>
                <Animated.View
                    style={{
                        transform: [{ scale: buttonScale }],
                        width: '100%'
                    }}
                >
                    <TouchableOpacity 
                        style={[form.button, {backgroundColor: '#FF1464'}]}
                        onPress={() => setTagsSelectionListVisible(true)}
                    >
                        <Text style={form.buttonText}>
                            {tags.length > 0 ? tags.join(', ') : "Select tags"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <Modal
                    visible={tagsSelectionListVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setTagsSelectionListVisible(false)}
                >
                    <Animated.View 
                        style={[
                            modal.layout,
                            {
                                transform: [{ translateY: modalSlide }]
                            }
                        ]}
                    >
                        <View style={modal.container}>

                            <Text style={modal.title}>Select Tags</Text>
                            <TouchableOpacity 
                                onPress={() => setTagsSelectionListVisible(false)}
                                style={[form.button, {backgroundColor: '#FF1464', marginBottom: 12}]}
                            >
                                <Text style={form.buttonText}>Done</Text>
                            </TouchableOpacity>

                            <ScrollView style={{width: '100%'}}>
                                {
                                    effectiveTags.length > 0 ? (
                                        <>
                                            {effectiveTags.map((tag, id) => (
                                                <Animated.View
                                                    key={id}
                                                    style={{
                                                        opacity: tagItemOpacity,
                                                        transform: [{ scale: tagItemScale }]
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        style={[modal.button]}
                                                        onPress={() => handleTagSelection(tag)}
                                                    >
                                                        <Text style={modal.text}>{tag}</Text>
                                                        {/* <Checkbox 
                                                            checked={tags.includes(tag)}
                                                            onChange={(checked) => {
                                                                if (checked) {
                                                                    setTags([...tags, tag]);
                                                                } else {
                                                                    setTags(tags.filter(t => t !== tag));
                                                                }
                                                            }}
                                                        /> */}
                                                        <View
                                                            style={[modal.checkboxButton, 
                                                                tags.includes(tag) && {backgroundColor: 'rgba(255, 0, 191, 0.5)'}
                                                            ]}
                                                        >
                                                            {
                                                                tags.includes(tag) && (
                                                                    <Image source={checked} style={modal.checkboxIcon} />
                                                                )
                                                            }
                                                        </View>
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            ))}
                                        </>
                                    ) : (
                                            <Text style={[shared.notFoundText, {color: '#000'}]}>No tags available. Add them in Settings.</Text>
                                    )
                                }
                            </ScrollView>
                        </View>
                    </Animated.View>
                </Modal>
            </View>

            <Animated.View
                style={[
                    form.button,
                    {
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: 50,
                        transform: [{ scale: buttonScale }]
                    }
                ]}
            >
                <TouchableOpacity 
                    onPress={saveMyNewLinkToStorage}
                >
                    <Text style={form.buttonText}>Create Link</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

export default RenewlinkLinko;
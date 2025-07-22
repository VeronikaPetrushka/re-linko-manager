import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Animated, ScrollView, TextInput, Modal, Image, Easing, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { form, modal, shared } from "../../assets/styles";
import { checked, logoTag, returnArr } from '../ReConst/reLinkoDecor';
import reLinkoTags from '../ReConst/reLinkoTags';

const RemanagetagLinko = () => {
    const navigation = useNavigation();
    const [showTagsModal, setShowTagsModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [storedTags, setStoredTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;
    const modalSlide = useRef(new Animated.Value(300)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadTags();
        
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

    useEffect(() => {
        if (showTagsModal) {
            Animated.parallel([
                Animated.timing(modalSlide, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.back(1)),
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(modalSlide, {
                    toValue: 300,
                    duration: 200,
                    easing: Easing.in(Easing.back(1)),
                    useNativeDriver: true,
                }),
                Animated.timing(modalOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [showTagsModal]);

    const loadTags = async () => {
        try {
            const tags = await AsyncStorage.getItem('CUSTOM_TAGS');
            if (tags !== null) {
                setStoredTags(JSON.parse(tags));
            } else {
                await AsyncStorage.setItem('CUSTOM_TAGS', JSON.stringify(reLinkoTags));
                setStoredTags(reLinkoTags);
            }
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    };

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

        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const deleteSelectedTags = async () => {
        try {
            if (storedTags.length - selectedTags.length <= 0) {
                Alert.alert(
                    "Cannot Delete All Tags",
                    "You must keep at least one tag in your collection.",
                    [{ text: "OK" }]
                );
                return;
            }

            const updatedTags = storedTags.filter(tag => !selectedTags.includes(tag));
            await AsyncStorage.setItem('CUSTOM_TAGS', JSON.stringify(updatedTags));
            setStoredTags(updatedTags);
            setSelectedTags([]);
            setShowTagsModal(false);
            
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
            console.error('Error deleting tags:', error);
            Alert.alert('Error', 'Failed to delete tags');
        }
    };

    const saveNewTagToStorage = async () => {
        if (!newTag.trim()) {
            Alert.alert('Error', 'Tag cannot be empty');
            return;
        }

        if (storedTags.includes(newTag.trim())) {
            Alert.alert('Error', 'This tag already exists');
            return;
        }

        try {
            const updatedTags = [...storedTags, newTag.trim()];
            await AsyncStorage.setItem('CUSTOM_TAGS', JSON.stringify(updatedTags));
            setStoredTags(updatedTags);
            setNewTag('');
            setShowTagsModal(false);
            
            Animated.sequence([
                Animated.timing(buttonScale, {
                    toValue: 1.2,
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
            console.error('Error saving new tag:', error);
            Alert.alert('Error', 'Failed to save new tag');
        }
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
                <Image source={logoTag} style={[form.logo, {width: 264}]} />
            </Animated.View>
            
            <Animated.View style={{ transform: [{ translateY: buttonSlide }], width: '100%' }}>
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[
                            form.button,
                            modalType === 'create' && {backgroundColor: 'rgba(253, 245, 101, 0.2)'},
                            { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }
                        ]}
                        onPress={() => { 
                            setShowTagsModal((prev) => !prev); 
                            setModalType(modalType === 'create' ? null : 'create');
                            setNewTag('');
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>Create Tag</Text>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                        style={[
                            form.button,
                            modalType === 'remove' && {backgroundColor: 'rgba(253, 245, 101, 0.2)'},
                            { borderWidth: 1, borderColor: '#FDF565', backgroundColor: 'transparent', marginBottom: 16 }
                        ]}
                        onPress={() => { 
                            setShowTagsModal((prev) => !prev); 
                            setModalType(modalType === 'remove' ? null : 'remove');
                            setSelectedTags([]);
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={[form.buttonText, { color: '#fff', fontSize: 24 }]}>Remove Tags</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* Remove Tags Modal */}
            <Modal
                visible={showTagsModal && modalType === 'remove'}
                transparent={true}
                onRequestClose={() => setShowTagsModal(false)}
            >
                <Animated.View 
                    style={[
                        modal.layout,
                        {
                            opacity: modalOpacity,
                            transform: [{ translateY: modalSlide }],
                            paddingTop: 320
                        }
                    ]}
                >
                    <View style={[modal.container, {maxHeight: '55%'}]}>
                        <Text style={modal.title}>Select Tags to Remove</Text>
                        
                        <TouchableOpacity 
                            onPress={deleteSelectedTags}
                            style={[form.button, {backgroundColor: '#FF1464', marginBottom: 12}]}
                            disabled={selectedTags.length === 0}
                        >
                            <Text style={form.buttonText}>
                                DELETE {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            onPress={() => {
                                setModalType(null);
                                setSelectedTags([]);
                                setShowTagsModal(false);
                            }}
                            style={[form.button, {borderColor: '#FF1464', backgroundColor: 'transparent', marginBottom: 10}]}
                        >
                            <Text style={[form.buttonText, {color: '#FF1464'}]}>CANCEL</Text>
                        </TouchableOpacity>

                        <ScrollView style={{ width: '100%' }}>
                            {storedTags.map((tag, id) => (
                                <Animated.View
                                    key={id}
                                    style={{
                                        opacity: selectedTags.includes(tag) ? 1 : 0.8,
                                        transform: [{
                                            scale: selectedTags.includes(tag) ? 1.02 : 1
                                        }]
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[modal.button, {width: '98%', alignSelf: 'center'}]}
                                        onPress={() => {
                                            // Prevent selecting the last tag if it's the only one not selected
                                            if (storedTags.length - selectedTags.length === 1 && !selectedTags.includes(tag)) {
                                                Alert.alert(
                                                    "Cannot Select Last Tag",
                                                    "You must keep at least one tag in your collection.",
                                                    [{ text: "OK" }]
                                                );
                                                return;
                                            }
                                            handleTagSelection(tag);
                                        }}
                                    >
                                        <Text style={modal.text}>{tag}</Text>
                                        <View
                                            style={[modal.checkboxButton, 
                                                selectedTags.includes(tag) && {backgroundColor: 'rgba(255, 0, 191, 0.5)'}
                                            ]}
                                        >
                                            {selectedTags.includes(tag) && (
                                                <Image source={checked} style={modal.checkboxIcon} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </Modal>

            {/* Create Tag Modal */}
            <Modal
                visible={showTagsModal && modalType === 'create'}
                transparent={true}
                onRequestClose={() => setShowTagsModal(false)}
            >
                <Animated.View 
                    style={[
                        modal.layout,
                        {
                            opacity: modalOpacity,
                            transform: [{ translateY: modalSlide }],
                            paddingTop: 320
                        }
                    ]}
                >
                    <View style={[modal.container, { minHeight: 190 }]}>
                        <Text style={modal.title}>Create New Tag</Text>
                        
                        <TextInput
                            style={[form.input, {borderColor: '#FF1464', color: '#FF1464', marginBottom: 15}]}
                            value={newTag}
                            onChangeText={setNewTag}
                            placeholder="Enter tag name"
                            placeholderTextColor='#FF1464'
                            autoCapitalize="none"
                            autoFocus={true}
                        />
                        
                        <TouchableOpacity 
                            onPress={saveNewTagToStorage}
                            style={[form.button, {
                                backgroundColor: '#FF1464',
                                marginBottom: 12,
                                opacity: newTag.trim() ? 1 : 0.6
                            }]}
                            disabled={!newTag.trim()}
                        >
                            <Text style={[form.buttonText, { color: '#000' }]}>CREATE TAG</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => {
                                setModalType(null);
                                setSelectedTags([]);
                                setShowTagsModal(false);
                            }}
                            style={[form.button, {borderColor: '#FF1464', backgroundColor: 'transparent'}]}
                        >
                            <Text style={[form.buttonText, {color: '#FF1464'}]}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Modal>
        </Animated.View>
    );
};

export default RemanagetagLinko;
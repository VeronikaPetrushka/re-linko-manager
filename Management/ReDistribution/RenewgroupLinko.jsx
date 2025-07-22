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
  Platform,
  UIManager
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checked, link, logoFolder, returnArr } from "../ReConst/reLinkoDecor";
import reLinkoTags from "../ReConst/reLinkoTags";
import { shared, form, card, modal } from "../../assets/styles";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RenewgroupLinko = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [myLinksStorage, setMyLinksStorage] = useState([]);
    const [selectedLinks, setSelectedLinks] = useState([]);

    const [newLink, setNewLink] = useState({
        link: '',
        description: '',
        tags: []
    });

    const [showMyLinks, setShowMyLinks] = useState(false);
    const [showNewLinkForm, setShowNewLinkForm] = useState(false);
    const [tagsSelectionListVisible, setTagsSelectionListVisible] = useState(false);

    const [customTags, setCustomTags] = useState(null);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const modalSlide = useRef(new Animated.Value(500)).current;
    const tagItemOpacity = useRef(new Animated.Value(0)).current;
    const tagItemScale = useRef(new Animated.Value(0.8)).current;
    const linkItemScale = useRef(new Animated.Value(1)).current;
    const titleSlide = useRef(new Animated.Value(30)).current;
    const buttonSlide = useRef(new Animated.Value(30)).current;

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

    // Entry animations
    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.spring(titleSlide, {
                toValue: 0,
                speed: 2,
                bounciness: 8,
                useNativeDriver: true,
            }),
            Animated.spring(buttonSlide, {
                toValue: 0,
                delay: 100,
                speed: 2,
                bounciness: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    // Modal animations
    useEffect(() => {
        if (showMyLinks || showNewLinkForm) {
            Animated.spring(modalSlide, {
                toValue: 0,
                speed: 12,
                bounciness: 8,
                useNativeDriver: true,
            }).start();
        } else {
            modalSlide.setValue(500);
        }
    }, [showMyLinks, showNewLinkForm]);

    // Tag selection animations
    useEffect(() => {
        if (tagsSelectionListVisible) {
            effectiveTags.forEach((_, index) => {
                setTimeout(() => {
                    Animated.parallel([
                        Animated.spring(tagItemOpacity, {
                            toValue: 1,
                            speed: 12,
                            useNativeDriver: true,
                        }),
                        Animated.spring(tagItemScale, {
                            toValue: 1,
                            friction: 3,
                            useNativeDriver: true,
                        })
                    ]).start();
                }, index * 50);
            });
        } else {
            tagItemOpacity.setValue(0);
            tagItemScale.setValue(0.8);
        }
    }, [tagsSelectionListVisible]);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const storedLinks = await AsyncStorage.getItem('MY_LINKS');
                if (storedLinks) {
                    const parsedLinks = JSON.parse(storedLinks);
                    setMyLinksStorage(parsedLinks);
                }
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        };
        fetchLinks();
    }, []);

    const handleLinkSelection = (linkItem) => {
        Animated.sequence([
            Animated.timing(linkItemScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(linkItemScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            })
        ]).start();

        if (selectedLinks.some(l => l.link === linkItem.link)) {
            setSelectedLinks(selectedLinks.filter(l => l.link !== linkItem.link));
        } else {
            setSelectedLinks([...selectedLinks, linkItem]);
        }
    };

    const handleTagSelection = (tag) => {
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

        if (newLink.tags.includes(tag)) {
            setNewLink({...newLink, tags: newLink.tags.filter(t => t !== tag)});
        } else {
            setNewLink({...newLink, tags: [...newLink.tags, tag]});
        }
    };

    const saveNewLinkToStorage = async () => {
        if (!newLink.link.trim()) {
            shakeAnimation('link');
            Alert.alert("Validation Error", "Please enter a link");
            return;
        }

        try {
            const linkToAdd = {
                ...newLink,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };

            const updatedLinks = myLinksStorage ? [...myLinksStorage, linkToAdd] : [linkToAdd];
            await AsyncStorage.setItem('MY_LINKS', JSON.stringify(updatedLinks));
            
            setMyLinksStorage(updatedLinks);
            setSelectedLinks([...selectedLinks, linkToAdd]);
            
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

            setNewLink({
                link: '',
                description: '',
                tags: []
            });
            setShowNewLinkForm(false);
            
            Alert.alert("Success", "Link saved successfully!");
        } catch (error) {
            console.error('Error saving link:', error);
            Alert.alert("Error", "Failed to save the link");
        }
    };

    const saveNewCollectionToStorage = async () => {
        if (!title.trim()) {
            shakeAnimation('title');
            Alert.alert("Validation Error", "Please enter a title");
            return;
        }

        if (selectedLinks.length === 0) {
            shakeAnimation('links');
            Alert.alert("Validation Error", "Please select at least one link");
            return;
        }

        try {
            const newCollection = {
                id: Date.now().toString(),
                title: title.trim(),
                links: selectedLinks,
                createdAt: new Date().toISOString()
            };

            const existingCollections = await AsyncStorage.getItem('MY_COLLECTIONS');
            const updatedCollections = existingCollections 
                ? [...JSON.parse(existingCollections), newCollection] 
                : [newCollection];

            await AsyncStorage.setItem('MY_COLLECTIONS', JSON.stringify(updatedCollections));
            
            // Success animation
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

            setTimeout(() => {
                navigation.goBack();
            }, 500);
            
            Alert.alert("Success", "Collection created successfully!");
        } catch (error) {
            console.error('Error saving collection:', error);
            Alert.alert("Error", "Failed to create collection");
        }
    };

    const shakeAnimation = (target) => {
        const shakeValue = new Animated.Value(0);
        
        Animated.sequence([
            Animated.timing(shakeValue, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeValue, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeValue, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeValue, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start();
        
        return shakeValue;
    };

    return (
        <Animated.View style={[shared.container, { opacity: fadeAnim }]}>
            <TouchableOpacity 
                style={[form.backButton, {zIndex: 10}]}
                onPress={() => navigation.goBack()} 
            >
                <Image source={returnArr} style={form.backIcon} />
            </TouchableOpacity>

            <Animated.View 
                style={{
                    transform: [{ translateY: titleSlide }]
                }}
            >
                <Image source={logoFolder} style={[form.logo, {width: 180}]} />
            </Animated.View>

            <Animated.View
                style={{
                    transform: [{ translateY: titleSlide }]
                }}
            >
                <TextInput
                    style={form.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Title"
                    placeholderTextColor='#fff'
                />
            </Animated.View>

            <Animated.View 
                style={[
                    shared.row, 
                    {marginBottom: 24},
                    { transform: [{ translateY: buttonSlide }] }
                ]}
            >
                <TouchableOpacity
                    onPress={() => setShowMyLinks(true)}
                    style={[form.button, { borderColor: 'rgba(253, 245, 101, 0.6)', borderWidth: 1, backgroundColor: 'transparent', width: '48%', marginBottom: 0 }]}
                >
                    <Text style={[form.buttonText, {color: '#FDF565'}]}>Add your own link</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowNewLinkForm(true)}
                    style={[form.button, { borderColor: 'rgba(253, 245, 101, 0.6)', borderWidth: 1, backgroundColor: 'transparent', width: '48%', marginBottom: 0 }]}
                >
                    <Text style={[form.buttonText, {color: '#FDF565'}]}>Add a new link</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Existing Links Modal */}
            <Modal
                visible={showMyLinks}
                animationType="none"
                transparent={true}
                onRequestClose={() => setShowMyLinks(false)}
            >
                <Animated.View style={[modal.layout, { transform: [{ translateY: modalSlide }] }]}>
                    <View style={[modal.container, {minHeight: 250}]}>
                        <ScrollView style={{width: '100%'}}>
                            {myLinksStorage.map((linkItem, id) => (
                                <Animated.View
                                    key={id}
                                    style={{
                                        transform: [{ scale: linkItemScale }],
                                        width: '100%'
                                    }}
                                >
                                    <TouchableOpacity
                                        style={modal.button}
                                        onPress={() => handleLinkSelection(linkItem)}
                                    >
                                        <Text style={modal.text}>{linkItem.description}</Text>
                                        <View
                                            style={[modal.checkboxButton, 
                                                selectedLinks.some(l => l.id === linkItem.id) && {backgroundColor: 'rgba(255, 0, 191, 0.5)'}
                                            ]}
                                        >
                                            {selectedLinks.some(l => l.id === linkItem.id) && (
                                                <Image source={checked} style={modal.checkboxIcon} />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                            <TouchableOpacity 
                                onPress={() => setShowMyLinks(false)}
                                style={[form.button, {backgroundColor: '#FF1464', marginTop: 12}]}
                            >
                                <Text style={form.buttonText}>Done</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Animated.View>
            </Modal>

            {/* New Link Form Modal */}
            <Modal
                visible={showNewLinkForm}
                animationType="none"
                transparent={true}
                onRequestClose={() => setShowNewLinkForm(false)}
            >
                <Animated.View style={[modal.layout, { transform: [{ translateY: modalSlide }] }]}>
                    <View style={[modal.container, { minHeight: 250 }]}>
                        <ScrollView style={{width: '100%'}}>
                            <TextInput
                                style={[form.input, {borderColor: '#FF1464', color: '#FF1464'}]}
                                value={newLink.link}
                                onChangeText={(text) => setNewLink({...newLink, link: text})}
                                placeholder="Link"
                                placeholderTextColor='#FF1464'
                                autoCapitalize="none"
                                keyboardType="url"
                            />

                            <TextInput
                                style={[form.input, {borderColor: '#FF1464', color: '#FF1464'}]}
                                value={newLink.description}
                                onChangeText={(text) => setNewLink({...newLink, description: text})}
                                placeholder="Description"
                                placeholderTextColor='#FF1464'
                                multiline
                            />

                            <TouchableOpacity 
                                style={[form.button, {borderColor: '#FF1464', borderWidth: 1, alignItems: 'flex-start', marginBottom: 20, backgroundColor: 'transparent'}]}
                                onPress={() => setTagsSelectionListVisible(true)}
                            >
                                <Text style={[form.buttonText, {color: '#FF1464'}]}>
                                    {newLink.tags.length > 0 ? newLink.tags.join(', ') : "Select tags"}
                                </Text>
                            </TouchableOpacity>

                            {tagsSelectionListVisible && (
                                <View style={[modal.container, {marginBottom: 20}]}>
                                    <Text style={modal.title}>Select Tags</Text>
                                    <TouchableOpacity 
                                        onPress={() => setTagsSelectionListVisible(false)}
                                        style={[form.button, {backgroundColor: '#FF1464', marginBottom: 12}]}
                                    >
                                        <Text style={form.buttonText}>Done</Text>
                                    </TouchableOpacity>

                                    <ScrollView style={{ width: '100%' }}>
                                        {effectiveTags.length > 0 ? (
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
                                                            style={modal.button}
                                                            onPress={() => handleTagSelection(tag)}
                                                        >
                                                            <Text style={modal.text}>{tag}</Text>
                                                            <View
                                                                style={[modal.checkboxButton, 
                                                                    newLink.tags.includes(tag) && {backgroundColor: 'rgba(255, 0, 191, 0.5)'}
                                                                ]}
                                                            >
                                                                {newLink.tags.includes(tag) && (
                                                                    <Image source={checked} style={modal.checkboxIcon} />
                                                                )}
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
                            )}

                            <TouchableOpacity 
                                onPress={saveNewLinkToStorage}
                                style={[form.button, {backgroundColor: '#FF1464', marginBottom: 12}]}
                            >
                                <Text style={form.buttonText}>ADD LINK</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => {
                                    setShowNewLinkForm(false);
                                    setTagsSelectionListVisible(false);
                                }}
                                style={[form.button, {borderColor: '#FF1464', backgroundColor: 'transparent'}]}
                            >
                                <Text style={[form.buttonText, {color: '#FF1464'}]}>CANCEL</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Animated.View>
            </Modal>

            {selectedLinks.length > 0 && (
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[form.buttonText, {color: '#FDF565', marginBottom: 8}]}>Links:</Text>
                    {selectedLinks.map((linkItem, idx) => (
                        <Animated.View 
                            key={idx} 
                            style={[card.container, {
                                opacity: fadeAnim,
                                transform: [{ scale: linkItemScale }]
                            }]}
                        >
                            <Image source={link} style={card.icon} />
                            <View>
                                <Text style={card.title}>{linkItem.description}</Text>
                                <Text style={card.text}>{linkItem.tags.join(', ')}</Text>
                            </View>
                        </Animated.View>
                    ))}
                    <View style={{ height: 150 }} />
                </ScrollView>
            )}

            <Animated.View
                style={{
                    transform: [{ scale: buttonScale }],
                     position: 'absolute',
                    alignSelf: 'center',
                    bottom: 50,
                    width: '100%'
                }}
            >
                <TouchableOpacity
                    style={[
                        form.button
                    ]}
                    onPress={saveNewCollectionToStorage}
                >
                    <Text style={form.buttonText}>Create Collection</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

export default RenewgroupLinko;
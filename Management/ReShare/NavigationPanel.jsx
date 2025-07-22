import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import reLinkoNav from "../ReConst/reLinkoNav";
import { panel } from '../../assets/styles';

const NavigationPanel = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const currentScreen = route.name;

    const handleNavigation = (screenName) => {
        if (currentScreen !== screenName) {
            navigation.navigate(screenName);
        }
    };

    return (
        <View style={panel.container}>
            {reLinkoNav.map((nav, idx) => (
                <TouchableOpacity 
                    key={idx}
                    onPress={() => handleNavigation(nav.dis)}
                >
                    <Image 
                        source={nav.image} 
                        style={[
                            panel.image,
                            currentScreen === nav.dis && {tintColor: '#FF1464'}
                        ]} 
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default NavigationPanel;
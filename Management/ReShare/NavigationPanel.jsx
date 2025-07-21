import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import reLinkoNav from "../ReConst/reLinkoNav";

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
        <View>
            {reLinkoNav.map((nav, idx) => (
                <TouchableOpacity 
                    key={idx}
                    onPress={() => handleNavigation(nav.screenName)}
                    style={[
                        currentScreen === nav.screenName && styles.activeNavItem
                    ]}
                >
                    <Image 
                        source={nav.image} 
                        style={[
                            currentScreen === nav.screenName && styles.activeNavIcon
                        ]} 
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default NavigationPanel;
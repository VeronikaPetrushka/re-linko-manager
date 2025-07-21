import React, { JSX } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { ReloaderLinkoF, RemylinksLinkoF, RenewlinkLinkoF } from './Management/ReConst/reLinkoWrapper';

export type RootStackParamList = {
    ReloaderLinkoF: undefined;
    RemylinksLinkoF: undefined;
    RenewlinkLinkoF: undefined;
};

enableScreens();

const Stack = createStackNavigator<RootStackParamList>();

function App(): JSX.Element {

  return (
      <NavigationContainer>
            <Stack.Navigator
                initialRouteName="ReloaderLinkoF"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    name="ReloaderLinkoF"
                    component={ReloaderLinkoF}
                />
                <Stack.Screen
                    name="RemylinksLinkoF"
                    component={RemylinksLinkoF}
                />
                <Stack.Screen
                    name="RenewlinkLinkoF"
                    component={RenewlinkLinkoF}
                />
            </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;

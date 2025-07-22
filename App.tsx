import React, { JSX } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {
    ReloaderLinkoF,
    RemylinksLinkoF,
    RenewlinkLinkoF,
    ReopenfolderLinkoF,
    RecollectionsLinkoF,
    RenewgroupLinkoF,
    ReremindersLinkoF,
    ResettingsLinkoF,
    ReclearingLinkoF,
    RemanagetagLinkoF
} from './Management/ReConst/reLinkoWrapper';

export type RootStackParamList = {
    ReloaderLinkoF: undefined;
    RemylinksLinkoF: undefined;
    RenewlinkLinkoF: undefined;
    ReopenfolderLinkoF: undefined;
    RecollectionsLinkoF: undefined;
    RenewgroupLinkoF: undefined;
    ReremindersLinkoF: undefined;
    ResettingsLinkoF: undefined;
    ReclearingLinkoF: undefined;
    RemanagetagLinkoF: undefined;
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
                <Stack.Screen
                    name="ReopenfolderLinkoF"
                    component={ReopenfolderLinkoF}
                />
                <Stack.Screen
                    name="RecollectionsLinkoF"
                    component={RecollectionsLinkoF}
                />
                <Stack.Screen
                    name="RenewgroupLinkoF"
                    component={RenewgroupLinkoF}
                />
                <Stack.Screen
                    name="ReremindersLinkoF"
                    component={ReremindersLinkoF}
                />
                <Stack.Screen
                    name="ResettingsLinkoF"
                    component={ResettingsLinkoF}
                />
                <Stack.Screen
                    name="ReclearingLinkoF"
                    component={ReclearingLinkoF}
                />
                <Stack.Screen
                    name="RemanagetagLinkoF"
                    component={RemanagetagLinkoF}
                />
            </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;

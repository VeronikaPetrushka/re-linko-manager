import { ImageBackground, View } from "react-native";
import NavigationPanel from "./NavigationPanel";
import { mainBack } from "../ReConst/reLinkoDecor";

const Background = ({ dis, nav }) => {
    return (
        <ImageBackground source={mainBack} style={{flex: 1}}>
            <View style={{width: '100%', height: '100%'}}>
                <View style={{width: '100%', height: '100%'}}>
                    {dis}
                </View>
                {
                    nav && (
                        <View
                            style={{
                                width: '100%', 
                                position: 'absolute', 
                                alignSelf: 'center', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                bottom: 37,
                                zIndex: 12
                            }}
                        >
                            <NavigationPanel />
                        </View>
                    )
                }
            </View>
        </ImageBackground>
    )
};

export default Background;
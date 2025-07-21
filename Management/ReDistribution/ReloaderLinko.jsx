import { useNavigation } from "@react-navigation/native";
import Svg, { Text as SvgText } from "react-native-svg";
import { View, Animated, Dimensions, Easing, ImageBackground } from "react-native";
import { useEffect, useRef } from "react";
import { ball, loaderBack } from "../ReConst/reLinkoDecor";
import { FONT_BEBAS_NEUE } from "../../assets/styles";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ReloaderLinko = () => {
    const navigation = useNavigation();
    const ballAnimX = useRef(new Animated.Value(-120)).current;
    const ballAnimY = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            runJumpAnimation();
        });
    }, []);

    const runJumpAnimation = () => {
        const jumpSequence = [];
        const totalJumps = 2;
        const jumpDistance = screenWidth / (totalJumps + 1);
        let currentX = -120;

        for (let i = 0; i <= totalJumps + 1; i++) {
            const nextX = currentX + jumpDistance;

            jumpSequence.push(
                Animated.parallel([
                    Animated.timing(ballAnimX, {
                        toValue: nextX,
                        duration: 400,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.sequence([
                        Animated.timing(ballAnimY, {
                            toValue: -60,
                            duration: 200,
                            useNativeDriver: true,
                            easing: Easing.out(Easing.quad),
                        }),
                        Animated.timing(ballAnimY, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                            easing: Easing.in(Easing.quad),
                        }),
                    ]),
                ])
            );

            currentX = nextX;
        }

        Animated.sequence(jumpSequence).start(() => {
            navigation.navigate("RemylinksLinkoF");
        });
    };

    return (
        <ImageBackground source={loaderBack} style={{flex: 1 }}>
            <View style={{ flex: 1 }}>

                {/* Title Text with Fade In */}
                <Animated.View style={{ position: "absolute", top: 150, left: 0, right: 0, opacity: textOpacity }}>
                    <Svg height="220" width="100%">
                        <SvgText
                            fill="#FDF565"
                            stroke="#FF1464"
                            strokeWidth={4}
                            fontSize="96"
                            fontWeight="400"
                            fontFamily={FONT_BEBAS_NEUE}
                            x="50%"
                            y="80"
                            textAnchor="middle"
                        >
                            RE LINKO
                        </SvgText>
                        <SvgText
                            fill="#FDF565"
                            stroke="#FF1464"
                            strokeWidth={4}
                            fontSize="96"
                            fontWeight="400"
                            fontFamily={FONT_BEBAS_NEUE}
                            x="50%"
                            y="180"
                            textAnchor="middle"
                        >
                            MANAGER
                        </SvgText>
                    </Svg>
                </Animated.View>

                {/* Animated Ball */}
                <Animated.Image
                    source={ball}
                    style={{
                        width: 104,
                        height: 99,
                        resizeMode: "contain",
                        position: "absolute",
                        transform: [
                            { translateX: ballAnimX },
                            { translateY: ballAnimY },
                        ],
                        bottom: 200,
                    }}
                />
            </View>
        </ImageBackground>
    );
};

export default ReloaderLinko;
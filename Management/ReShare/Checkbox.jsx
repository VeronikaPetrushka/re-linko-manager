import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import checkbox from '../ReAnimations/checkbox';

const Checkbox = ({ checked, onChange }) => {
    const webViewRef = useRef(null);

    useEffect(() => {
        if (webViewRef.current) {
            webViewRef.current.injectJavaScript(`
                setChecked(${checked});
                true;
            `);
        }
    }, [checked]);

    const onMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'checkboxChange') {
                onChange(data.checked);
            }
        } catch (error) {
            console.error('Error parsing checkbox message:', error);
        }
    };

    return (
        <WebView
            ref={webViewRef}
            source={checkbox}
            injectedJavaScript={`
                window.initialChecked = ${checked};
                true;
            `}
            onMessage={onMessage}
            style={{ 
                width: 24, 
                height: 24,
                backgroundColor: 'transparent',
            }}
            scalesPageToFit={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            originWhitelist={['*']}
            mixedContentMode="always"
            scrollEnabled={false}
        />
    );
};

export default Checkbox;
import { Platform } from 'react-native';

export const FONT_BEBAS_NEUE = Platform.select({
  ios: 'Bebas Neue',
  android: 'BebasNeue-Regular',
});

export const FONT_CORMORANT_GARAMOND = Platform.select({
  ios: 'Cormorant Garamond',
  android: 'CormorantGaramond-Regular',
});

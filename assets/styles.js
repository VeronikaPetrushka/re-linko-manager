import { Platform, StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const FONT_BEBAS_NEUE = Platform.select({
  ios: 'Bebas Neue',
  android: 'BebasNeue-Regular',
});

export const FONT_CORMORANT_GARAMOND = Platform.select({
  ios: 'Cormorant Garamond',
  android: 'CormorantGaramond-VariableFont_wght',
});


export const panel = StyleSheet.create({

  container: {
    width: '90%',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(28, 28, 28, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },

  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }

});


export const shared = StyleSheet.create({

  container: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: height * 0.08
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  searchInput: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FDF565',
    paddingHorizontal: 10,
    paddingVertical: 7.5,
    color: '#fff',
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontSize: 16,
    fontWeight: '400'
  },

  title: {
    color: '#FDF565',
    fontFamily: FONT_BEBAS_NEUE,
    fontSize: 48,
    fontWeight: '400',
  },

  ballButton: {
    width: 60,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 15
  },

  ballButtonImage: {
    width: 49,
    height: 40,
    resizeMode: 'contain'
  },

  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },

  notFoundText: {
    color: '#fff',
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontSize: 26,
    fontWeight: '500',
  }

});


export const form = StyleSheet.create({

  input: {
    borderColor: 'rgba(253, 245, 101, 0.6)',
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7.5,
    color: '#fff',
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8
  },

  button: {
    width: '100%',
    padding: 8,
    backgroundColor: '#FDF565',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#000000',
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontSize: 16,
    fontWeight: '400',
  },

  backButton: {
    position: 'absolute',
    left: 16,
    top: height * 0.09
  },

  backIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  logo: {
    width: 140,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16
  }

});

export const card = StyleSheet.create({

  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(253, 245, 101, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    color: '#FDF565',
    fontSize: 16,
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontWeight: '400',
    marginBottom: 5
  },

  text: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontWeight: '400'
  },

  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 15
  }

});

export const modal = StyleSheet.create({

  layout: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 270,
    backgroundColor: 'transparent',
    width: '100%'
  },

  container: {
    width: '100%',
    maxHeight: '63%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 10
  },

  title: {
    color: '#000',
    fontSize: 22,
    fontFamily: FONT_BEBAS_NEUE,
    fontWeight: '400',
    marginBottom: 12,
    alignSelf: 'center',
    textAlign: 'center'
  },

  button: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF1464',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  text: {
    color: '#FF1464',
    fontSize: 16,
    fontFamily: FONT_CORMORANT_GARAMOND,
    fontWeight: '400'
  },

  checkboxButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#FF1464',
    borderRadius: 4
  },

  checkboxIcon: {
    position: 'absolute',
    top: 5,
    right: 4,
    width: 14,
    height: 10.5,
    resizeMode: 'contain',
    alignSelf: 'center'
  }

});
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gokulakrishnxn.hush',
  appName: 'Hush',
  webDir: 'dist',
  android: {
    backgroundColor: '#F2F2F4',
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

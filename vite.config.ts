import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const APP_SRC = path.resolve(__dirname, '../crypto-bros-app/src');
const shim = (p: string) => path.resolve(__dirname, 'src/shims', p);

// Reuse the REAL app renderer (NotionRenderer + theme) on the web by mapping
// react-native → react-native-web and neutralizing native-only modules with
// import-safe shims. Charts/video are not in the v1 preview path, so their shims
// only need to resolve at bundle time.
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    __DEV__: 'true',
    'process.env.NODE_ENV': '"development"',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js', '.json'],
    dedupe: ['react', 'react-dom', 'react-native-web'],
    alias: [
      { find: /^react-native$/, replacement: 'react-native-web' },
      { find: '@shopify/react-native-skia', replacement: shim('skia.tsx') },
      { find: 'expo-image', replacement: shim('expo-image.tsx') },
      { find: 'expo-haptics', replacement: shim('expo-haptics.ts') },
      { find: 'expo-video', replacement: shim('expo-video.tsx') },
      { find: 'expo-blur', replacement: shim('expo-blur.tsx') },
      { find: 'expo-linear-gradient', replacement: shim('expo-linear-gradient.tsx') },
      { find: 'expo-constants', replacement: shim('expo-constants.ts') },
      { find: 'expo-device', replacement: shim('expo-device.ts') },
      { find: 'expo-screen-corner-radius', replacement: shim('expo-screen-corner-radius.ts') },
      { find: 'expo-file-system', replacement: shim('expo-file-system.ts') },
      { find: 'react-native-reanimated', replacement: shim('reanimated.tsx') },
      { find: 'react-native-gesture-handler', replacement: shim('gesture-handler.tsx') },
      { find: '@expo/vector-icons', replacement: shim('vector-icons.tsx') },
      { find: 'expo-router', replacement: shim('expo-router.tsx') },
      { find: '@react-native-async-storage/async-storage', replacement: shim('async-storage.ts') },
      { find: '@', replacement: APP_SRC },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      loader: { '.js': 'jsx' },
    },
  },
});

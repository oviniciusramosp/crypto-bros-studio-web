// Gesture-handler web shim: gestures are inert in the preview; detectors pass
// their children through.
import * as RNW from 'react-native-web';

const chain: any = new Proxy(function () {}, { get: () => () => chain, apply: () => chain });
export const Gesture: any = new Proxy({}, { get: () => (..._a: any[]) => chain });
export const GestureDetector = ({ children }: any) => children ?? null;
export const GestureHandlerRootView: any = (RNW as any).View;
export default { Gesture, GestureDetector, GestureHandlerRootView };

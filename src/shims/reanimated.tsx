// Reanimated web shim: components render in their final (static) state — enough
// for an accurate static preview (no animation).
import * as RNW from 'react-native-web';

const safe = (fn: any) => {
  try {
    return typeof fn === 'function' ? fn() : {};
  } catch {
    return {};
  }
};

export const useSharedValue = (init: any) => ({ value: init });
export const useAnimatedStyle = (fn: any) => safe(fn);
export const useDerivedValue = (fn: any) => ({ value: safe(fn) });
export const useAnimatedProps = (fn: any) => safe(fn);
export const useAnimatedRef = () => ({ current: null });
export const useAnimatedReaction = () => {};
export const useFrameCallback = () => ({ setActive: () => {} });
export const useReducedMotion = () => false;
export const useScrollViewOffset = () => ({ value: 0 });
export const withTiming = (v: any) => v;
export const withSpring = (v: any) => v;
export const withDelay = (_: any, v: any) => v;
export const withRepeat = (v: any) => v;
export const withSequence = (...a: any[]) => a[a.length - 1];
export const cancelAnimation = () => {};
export const runOnJS = (fn: any) => (...a: any[]) => fn?.(...a);
export const runOnUI = (fn: any) => (...a: any[]) => fn?.(...a);
export const interpolate = () => 0;
export const interpolateColor = () => 'transparent';
export const scrollTo = () => {};
export const Easing: any = new Proxy({}, { get: () => (x: any) => x });
export const Extrapolation = { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' };
export const ReduceMotion = { System: 'system', Always: 'always', Never: 'never' };
export const SharedValue: any = undefined;

const builder = () => {
  const o: any = new Proxy(function () {}, { get: () => () => o, apply: () => o });
  return o;
};
export const FadeIn = builder();
export const FadeOut = builder();
export const FadeInDown = builder();
export const FadeInUp = builder();

const Animated: any = {
  View: (RNW as any).View,
  Text: (RNW as any).Text,
  ScrollView: (RNW as any).ScrollView,
  Image: (RNW as any).Image,
  createAnimatedComponent: (c: any) => c,
  addWhitelistedNativeProps: () => {},
};
export default Animated;

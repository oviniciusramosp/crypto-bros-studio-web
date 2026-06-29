// expo-router stub — navigation is inert in the Studio preview.
const noop = () => {};
const routerLike = {
  push: noop, replace: noop, back: noop, navigate: noop, setParams: noop,
  canGoBack: () => false, dismiss: noop, dismissAll: noop, dismissTo: noop,
};
export const useRouter = () => routerLike;
export const router = routerLike;
export const usePathname = () => '/';
export const useLocalSearchParams = () => ({});
export const useGlobalSearchParams = () => ({});
export const useSegments = () => [] as string[];
export const useFocusEffect = () => {};
export const useNavigation = () => ({ navigate: noop, goBack: noop, setOptions: noop, addListener: () => noop });
export const Link: any = ({ children }: any) => children ?? null;
export const Redirect = () => null;
export const Slot = () => null;
export const Stack: any = () => null;
(Stack as any).Screen = () => null;
export const Tabs: any = () => null;
(Tabs as any).Screen = () => null;
export default { useRouter, router, usePathname, useLocalSearchParams, useGlobalSearchParams, useSegments, useFocusEffect, useNavigation, Link, Redirect, Slot, Stack, Tabs };

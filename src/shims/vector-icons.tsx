// @expo/vector-icons stub. Without the icon fonts loaded, real glyphs wouldn't
// render on web anyway; we render a sized spacer so layout is preserved.
import * as React from 'react';
import { View } from 'react-native-web';

const makeIcon = () => (props: any) =>
  React.createElement(View, { style: { width: props?.size ?? 16, height: props?.size ?? 16 } });

export const Ionicons = makeIcon();
export const MaterialCommunityIcons = makeIcon();
export const MaterialIcons = makeIcon();
export const Feather = makeIcon();
export const FontAwesome = makeIcon();
export const FontAwesome5 = makeIcon();
export const AntDesign = makeIcon();
export const Entypo = makeIcon();
export const Octicons = makeIcon();
export default { Ionicons, MaterialCommunityIcons, MaterialIcons, Feather, FontAwesome, FontAwesome5, AntDesign, Entypo, Octicons };

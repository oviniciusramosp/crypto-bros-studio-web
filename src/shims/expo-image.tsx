// expo-image → react-native-web Image. Maps contentFit→resizeMode; drops
// native-only props. Good enough for accurate static image rendering.
import * as React from 'react';
import * as RNW from 'react-native-web';

const RNImage: any = (RNW as any).Image;

export const Image: any = React.forwardRef((props: any, ref: any) => {
  const {
    source,
    contentFit,
    placeholder,
    transition,
    cachePolicy,
    recyclingKey,
    allowDownscaling,
    priority,
    ...rest
  } = props;
  const resizeMode =
    contentFit === 'contain' ? 'contain' : contentFit === 'fill' ? 'stretch' : 'cover';
  return React.createElement(RNImage, { ref, source, resizeMode, ...rest });
});
(Image as any).prefetch = async () => {};
(Image as any).clearMemoryCache = async () => {};
(Image as any).clearDiskCache = async () => {};

export const ImageBackground: any = (RNW as any).ImageBackground ?? (RNW as any).View;
export const useImage = () => null;
export default Image;

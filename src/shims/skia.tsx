// Import-safe Skia stub. Charts are not rendered in the v1 web preview, so these
// only need to satisfy imports and not throw at module load.
const Noop = () => null;
export const Canvas = Noop;
export const Path = Noop;
export const Circle = Noop;
export const Group = Noop;
export const Rect = Noop;
export const RoundedRect = Noop;
export const LinearGradient = Noop;
export const Paint = Noop;
export const Blur = Noop;
export const DashPathEffect = Noop;
export const ImageShader = Noop;
export const Picture = Noop;

// Deep, callable proxy so any chained access (Skia.Path.Make()) is a no-op.
const deep: any = new Proxy(function () {}, { get: () => deep, apply: () => deep });
export const Skia: any = deep;

export const matchFont = () => ({});
export const rect = () => ({ x: 0, y: 0, width: 0, height: 0 });
export const vec = (x = 0, y = 0) => ({ x, y });
export const useCanvasRef = () => ({ current: null });
export const ImageFormat = { PNG: 'png', JPEG: 'jpeg', WEBP: 'webp' };

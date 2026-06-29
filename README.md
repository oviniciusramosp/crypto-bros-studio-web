# Crypto Bros Studio (Web)

A React + **React Native Web** desktop tool that reuses the mobile app's **real
renderer** (`NotionRenderer` + theme) so the post preview is pixel-accurate to
the app — solving the fidelity gap a Flutter editor could never close.

It imports the app's source directly (`@` → `../crypto-bros-app/src`), maps
`react-native` → `react-native-web`, and neutralizes native-only modules with
small shims in `src/shims/` (skia/video/charts = placeholder; expo-image →
`<img>`; gesture/reanimated → inert; AsyncStorage → localStorage). A global
`require` shim (in `index.html`) lets app modules that do
`require('../assets/x.png')` load on web.

## Status

- ✅ **Preview foundation**: the real `NotionRenderer` renders posts on the web
  with the real theme (verified — headings, rich text bold/italic/link/code,
  lists, quote, callout, code block, divider).
- ⏳ Next: TipTap editor + text-selection toolbar; browse/load/republish all
  posts (Notion proxy + content repo); media fields (cover/icon/thumbnail);
  publish to GitHub. Charts/video render as faithful placeholders (skia-web later).

## Run

```bash
npm install
npm run dev   # http://localhost:5173
```

Requires the `crypto-bros-app` repo checked out as a sibling directory.

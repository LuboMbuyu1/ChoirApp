# DCT Choir App

React Native CLI app for DCT Choir songbook (no Expo).

## Setup (Codespaces)

```bash
cd DCTChoirApp
npm install
npx pod-install ios
```

## Data Extraction

```bash
python extract_songs.py "../Choirbook V5.pdf"
```

## Development

```bash
npx react-native start
# New terminal:
npx react-native run-android
```

## Features per spec
- Offline songbook (songs.json)
- Songs vs Choruses (type field, no verse labels on choruses)
- Search (Fuse.js)
- Bookmarks/Setlist (Zustand persist)
- Dark mode (system/settings)
- Keep screen awake (presentation/setlist)
- Share lyrics (react-native-share)
- Drag reorder setlist

## Release
**Android:** `cd android && ./gradlew bundleRelease`
**iOS:** Xcode Archive → App Store Connect

## Structure
```
src/
├── data/songs.json
├── screens/ (Home, Search, etc.)
├── components/ (SongCard, TypeFilter)
├── store/ (Zustand)
├── navigation/
└── utils/searchUtils.ts
```


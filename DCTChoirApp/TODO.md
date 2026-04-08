# DCT Choir App - Bare React Native CLI Setup & Fixes

Status: ✅ Metro config created | ⏳ Icon fixes pending | 🔄 Native setup

## Completed:
- ✅ package.json cleaned (RN CLI scripts, deps added)
- ✅ index.js entry point
- ✅ metro.config.js created (fixes "No Metro config" error)

## Next Steps:

### 1. Fix Expo Vector Icons → react-native-vector-icons [⏳]
Files to update:
- src/screens/HomeScreen.tsx
- src/screens/SetlistScreen.tsx  
- src/screens/SongDetailScreen.tsx
- src/navigation/AppNavigator.tsx
- Any other using `import { Ionicons } from '@expo/vector-icons'`

Replace pattern:
```
import { Ionicons } from '@expo/vector-icons';
// →
import Ionicons from 'react-native-vector-icons/Ionicons';
```

### 2. Link Native Modules [🔄 User]
```
cd /workspaces/ChoirApp/DCTChoirApp
rm -rf node_modules package-lock.json
npm install
npx react-native link react-native-vector-icons
```

### 3. Test Metro Bundler [🔄 User]
```
npx react-native start --reset-cache
```
Should now work without "No Metro config".

### 4. Android Setup [🔄 User - Codespace Linux]
No ios/ folder exists (no pod needed).
For Android:
- Ensure ANDROID_HOME set (codespace devcontainers often have)
- Create android/ project: Manual setup or copy from `npx react-native init TempAndroid`
- Then: npx react-native run-android

### 5. Complete App Fixes per Original Plan [⏳]
- App.tsx theme
- Navigation stack
- Keep-awake replacement
- Device info
- Dark mode propagation



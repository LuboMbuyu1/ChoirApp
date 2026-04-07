# DCT Choir App - Implementation TODO

Status Legend: ✅ Done | ⏳ In Progress | 🔄 Pending User Action | ❌ Blocked

## Breakdown of Approved Plan

### 1. Clean package.json [⏳]
- Remove all expo/* deps and react-dom/web
- Add missing: react-native-keep-awake, react-native-share, react-native-device-info
- Update scripts to RN CLI standards
- Set main: 'index.js'

### 2. Create index.js root entry [⏳]
- Exact spec content for AppRegistry

### 3. Update App.tsx [⏳]
- Remove Expo StatusBar
- Add useColorScheme + settingsStore theme logic
- Pass isDark to AppNavigator

### 4. Fix AppNavigator.tsx [⏳]
- Switch to @react-navigation/native-stack
- Accept/use isDark prop for dynamic colors
- Update header/tab styles

### 5. Fix SongDetailScreen.tsx [⏳]
- Replace expo-keep-awake with react-native-keep-awake + useEffect
- Replace @expo/vector-icons with react-native-vector-icons
- Fix dupe route params
- Add proper cleanup

### 6. Fix remaining screens with Expo icons [⏳]
- HomeScreen.tsx, SetlistScreen.tsx, others using Ionicons from @expo/

### 7. Add device-info to SettingsScreen [⏳]

### 8. Propagate isDark to all components [⏳]
- Screens, cards, lyrics display, filters

### 9. Global imports cleanup [⏳]
- Ensure consistent RN replacements everywhere

### 10. User setup & test [🔄]
```
cd DCTChoirApp
rm -rf node_modules package-lock.json
npm install
npx pod-install ios
npx react-native start
# In new terminal: npx react-native run-android
```

## Next Action: Complete Step 1 (package.json)


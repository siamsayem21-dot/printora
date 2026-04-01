# PrintOps Monitor — React Native App

A production monitoring app for your digital printing company.
Built with React Native (Bare workflow) for iOS & Android.

---

## 📁 Project Structure

```
PrintOpsMonitor/
├── App.tsx                        # Root app + navigation
├── package.json
└── src/
    ├── data.ts                    # All data, types & color helpers
    ├── components/
    │   └── UI.tsx                 # Shared components (Badge, Card, ProgressBar...)
    └── screens/
        ├── DashboardScreen.tsx    # Live overview dashboard
        ├── JobsScreen.tsx         # Job queue + add new jobs
        ├── MachinesScreen.tsx     # Machine status + Operators + Alerts
        ├── AlertsScreen.tsx       # Re-export
        └── OperatorsScreen.tsx    # Re-export
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
Make sure you have these installed:
- Node.js 18+
- JDK 17 (for Android)
- Android Studio + Android SDK (for Android)
- Xcode 14+ (for iOS, Mac only)
- CocoaPods (for iOS): `sudo gem install cocoapods`

### 2. Create a New React Native Project
```bash
npx react-native@0.73.4 init PrintOpsMonitor --template react-native-template-typescript
cd PrintOpsMonitor
```

### 3. Copy the Source Files
Replace the generated files with the files provided:
- Copy `App.tsx` → project root
- Copy `src/` folder → project root

### 4. Install Dependencies
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

### 5. iOS Setup
```bash
cd ios && pod install && cd ..
```

### 6. Run the App

**Android:**
```bash
npx react-native run-android
```

**iOS (Mac only):**
```bash
npx react-native run-ios
```

---

## 📱 App Screens

| Screen | Description |
|---|---|
| **Dashboard** | Live KPIs, active jobs, machine status, ink levels, alerts |
| **Jobs** | Full job list with filters, progress bars, add new jobs |
| **Machines** | Per-machine status, live progress, error/maintenance states |
| **Alerts** | All notifications — dismiss individually |
| **Operators** | Workload per operator, jobs assigned & completed |

---

## 🔧 Customisation Tips

### Connect to Real Data
Replace the seed data in `src/data.ts` with API calls to your production system.
Example using fetch in a screen:
```typescript
useEffect(() => {
  fetch('https://your-api.com/jobs')
    .then(r => r.json())
    .then(data => setJobs(data));
}, []);
```

### Add Push Notifications
Install `@notifee/react-native` or `react-native-push-notification` for real machine alerts.

### Add Authentication
Use `@react-navigation/stack` with a Login screen + AsyncStorage for operator login.

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `@react-navigation/native` | Screen navigation |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `react-native-screens` | Native screen optimization |
| `react-native-safe-area-context` | Safe area (notch) handling |

# CrossFit Commune App

A modern CrossFit training application built with React Native and Expo, featuring workout schedules, calendar navigation, and a sleek dark-themed UI.

## Features

- 🔐 **Authentication System** - Secure login with persistent session management
- 📅 **Workout Calendar** - View and navigate through daily workout schedules
- 🏋️ **Workout Details** - Detailed workout breakdowns including:
  - Warm-up routines
  - Strength training programs
  - Metcon (Metabolic Conditioning) workouts
  - Accessory exercises
- 📱 **Cross-Platform** - Runs on iOS, Android, and Web
- 🎨 **Modern UI** - Dark theme with gold accents, built with NativeWind (Tailwind CSS)
- 📊 **Tab Navigation** - Easy navigation between Training and Explore sections

## Tech Stack

- **Framework**: React Native with Expo (~54.0.29)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State Management**: React Context API
- **Storage**: AsyncStorage for authentication persistence
- **Language**: TypeScript
- **UI Components**: 
  - Expo Vector Icons
  - React Native Safe Area Context
  - React Native Gesture Handler
  - React Native Reanimated

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (optional, but recommended)
- For iOS development: [Xcode](https://developer.apple.com/xcode/) (macOS only)
- For Android development: [Android Studio](https://developer.android.com/studio)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crossfitcommuneapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### Development Server

Start the Expo development server:
```bash
npm start
```

This will open the Expo DevTools in your browser. You can then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in web browser
- Scan the QR code with the Expo Go app on your physical device

### Platform-Specific Commands

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
crossfitcommuneapp/
├── app/                    # Main application directory (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/Training screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── _layout.tsx    # Tab layout configuration
│   ├── login.tsx          # Login screen
│   ├── modal.tsx          # Modal screen
│   └── _layout.tsx        # Root layout with auth provider
├── assets/                # Images and static assets
│   └── images/           # App icons and images
├── components/            # Reusable components
│   ├── ui/               # UI components (collapsible, icons)
│   └── ...               # Other shared components
├── contexts/              # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── hooks/                 # Custom React hooks
├── constants/             # App constants and theme
└── scripts/               # Utility scripts
```

## Authentication

The app uses a simple authentication system with AsyncStorage for persistence.

### Demo Credentials

- **Username**: `user`
- **Password**: `password`

The authentication state is persisted across app restarts using AsyncStorage. Users remain logged in until they explicitly log out.

### Authentication Flow

1. User enters credentials on the login screen
2. Credentials are validated (currently using mock validation)
3. On success, an auth token is stored in AsyncStorage
4. The app navigates to the main tab screens
5. Auth state is checked on app startup to maintain session

## Development

### Code Style

The project uses ESLint for code quality. Run the linter with:

```bash
npm run lint
```

### TypeScript

The project is fully typed with TypeScript. Type definitions are configured in `tsconfig.json`.

### Styling

The app uses NativeWind (Tailwind CSS) for styling. Classes are applied using the `className` prop, similar to web development.

Example:
```tsx
<View className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
  <Text className="text-white text-xl font-bold">Title</Text>
</View>
```

## Key Features Implementation

### Workout Calendar

The home screen features a weekly calendar view that allows users to:
- Navigate between days of the current week
- Select specific dates to view workouts
- Open a full calendar picker for month navigation
- View detailed workout information for selected dates

### Workout Display

Workouts are organized into sections:
- **Warm-up**: Pre-workout preparation exercises
- **Strength**: Weightlifting and strength training
- **Metcon**: High-intensity metabolic conditioning
- **Accessory**: Supplementary exercises

## Configuration

### App Configuration

App settings are configured in `app.json`, including:
- App name and slug
- Icon and splash screen settings
- Platform-specific configurations (iOS, Android, Web)
- Expo plugins and experiments

### Theme Configuration

Theme colors and styling are configured in:
- `tailwind.config.js` - Tailwind CSS configuration
- `constants/theme.ts` - App theme constants
- `global.css` - Global styles

## Building for Production

To build the app for production:

1. **Configure EAS Build** (if using Expo Application Services)
   ```bash
   eas build:configure
   ```

2. **Build for specific platforms**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

For more information, see the [Expo documentation](https://docs.expo.dev/build/introduction/).

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**
   ```bash
   npm start -- --clear
   ```

2. **Node modules issues**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS build issues**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Expo](https://expo.dev/)
- UI components styled with [NativeWind](https://www.nativewind.dev/)
- Icons provided by [Expo Vector Icons](https://docs.expo.dev/guides/icons/)

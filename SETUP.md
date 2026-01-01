# DeckDuel - iMessage Card Game Extension Setup Guide

This guide will help you set up DeckDuel as a production-ready iMessage extension for live multiplayer card games.

## 🎯 Current Status

✅ **Completed:**
- Full Texas Hold'em game engine with poker hand evaluation
- Real-time multiplayer architecture using Firebase
- Game state management with Zustand
- Interactive poker table UI with animations
- Player management and game lobby
- Card deck management with secure shuffling

🚧 **In Progress:**
- iMessage extension integration
- Additional game types (Blackjack, Gin Rummy, etc.)
- Server-side validation
- Authentication system

## 📋 Prerequisites

- Node.js 18+ (or Bun)
- Firebase account (free tier works fine)
- Xcode 14+ (for iOS/iMessage development)
- iOS Developer account (for App Store distribution)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Realtime Database**:
   - Go to Build > Realtime Database
   - Click "Create Database"
   - Choose "Start in test mode" for development
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" and add a Web app
   - Copy the configuration object

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173/game` to test the game interface.

## 🎮 Testing the Game

### Local Multiplayer Testing

1. Open the game in two browser windows/tabs
2. In window 1: Create a new game (Texas Hold'em)
3. Copy the game link that's automatically copied to clipboard
4. In window 2: Paste the URL or use the "Join Game" tab with the game ID
5. Start the game and play!

### Game Features

- **Texas Hold'em Poker**: Full implementation with betting rounds
- **Real-time sync**: All players see updates instantly
- **Player presence**: See who's online/offline
- **Turn management**: Automatic turn progression
- **Chip management**: Starting chips, bets, pot, all-in support
- **Hand evaluation**: Automatic winner determination

## 📱 iMessage Extension Setup

### Creating the iOS App

1. **Create Xcode Project**:
   ```bash
   # Open Xcode and create new project
   # Choose "App" template
   # Add target: File > New > Target > Messages Extension
   ```

2. **Configure Info.plist**:
   - Set `NSExtension` properties
   - Configure supported devices
   - Set minimum iOS version (14.0+)

3. **Add WebView Integration**:
   - Create `MessagesViewController.swift`
   - Add WKWebView to load your React app
   - Configure JavaScript bridge for native communication

4. **Build Settings**:
   ```
   Minimum iOS Version: 14.0
   Devices: iPhone, iPad
   Extension Bundle ID: com.yourcompany.deckduel.MessagesExtension
   ```

### Sample MessagesViewController (Swift)

```swift
import Messages
import WebKit

class MessagesViewController: MSMessagesAppViewController {
    var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let config = WKWebViewConfiguration()
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
        // Load your hosted React app
        if let url = URL(string: "https://your-app-url.com/game") {
            webView.load(URLRequest(url: url))
        }
        
        view.addSubview(webView)
    }
    
    override func didTransition(to presentationStyle: MSMessagesAppPresentationStyle) {
        // Handle compact/expanded view transitions
    }
}
```

## 🔐 Firebase Security Rules

Update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["status", "createdAt"]
      }
    }
  }
}
```

⚠️ **Important**: These are permissive rules for development. For production, implement proper authentication and validation rules.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── game/              # Game-specific components
│   │   ├── Card.tsx       # Card display component
│   │   ├── PlayerSeat.tsx # Player UI component
│   │   ├── PokerTable.tsx # Main poker table interface
│   │   └── GameLobby.tsx  # Lobby for creating/joining games
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── game/              # Game logic
│   │   ├── deck.ts        # Deck management & utilities
│   │   ├── poker.ts       # Poker hand evaluation
│   │   └── texasHoldem.ts # Texas Hold'em game engine
│   └── firebase/          # Firebase integration
│       ├── config.ts      # Firebase initialization
│       └── gameService.ts # Real-time database operations
├── stores/
│   └── gameStore.ts       # Zustand state management
├── types/
│   └── game.ts            # TypeScript type definitions
└── pages/
    ├── Index.tsx          # Landing page
    └── Game.tsx           # Main game page
```

## 🎨 Customization

### Adding New Card Games

1. Create game engine in `src/lib/game/[gameName].ts`
2. Implement game-specific types in `src/types/game.ts`
3. Create UI components in `src/components/game/`
4. Add game type to lobby options in `GameLobby.tsx`

### Styling

The app uses Tailwind CSS with custom color schemes. Modify `tailwind.config.ts` to customize:

- Color schemes
- Fonts
- Animations
- Breakpoints

## 🚢 Deployment

### Web App Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting provider (Vercel, Netlify, etc.)
```

### iMessage Extension Deployment

1. **App Store Connect Setup**:
   - Create app in App Store Connect
   - Configure App ID with Messages extension capability
   - Create provisioning profiles

2. **Build & Archive**:
   - Open Xcode
   - Select "Any iOS Device"
   - Product > Archive
   - Distribute to App Store

3. **Submission**:
   - Fill in app metadata
   - Add screenshots (required for Messages apps)
   - Submit for review

## 🔧 Troubleshooting

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase console for database rules
- Ensure Realtime Database is enabled (not just Firestore)

### Game State Not Syncing
- Check browser console for errors
- Verify Firebase rules allow read/write
- Ensure players are in the same game session

### Card Display Issues
- Clear browser cache
- Check that card suit symbols render correctly
- Verify Tailwind CSS is compiling properly

## 📚 Next Steps

1. **Add Authentication**: Implement Firebase Auth for persistent player profiles
2. **Server Validation**: Add Cloud Functions to validate game actions server-side
3. **More Games**: Implement Blackjack, Gin Rummy, and other card games
4. **Analytics**: Add Firebase Analytics to track user engagement
5. **Push Notifications**: Notify players when it's their turn
6. **Leaderboards**: Track wins, losses, and statistics

## 🤝 Contributing

This is a personal project, but contributions are welcome! Areas that need work:
- Additional game implementations
- UI/UX improvements
- Performance optimizations
- Test coverage

## 📄 License

This project is for educational purposes. Ensure proper licenses for any card game implementations.

## 🆘 Support

For issues or questions:
1. Check Firebase console logs
2. Review browser console for errors
3. Verify all environment variables are set
4. Check that you're using compatible Node.js version

---

Happy coding! 🎴

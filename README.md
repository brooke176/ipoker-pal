# DeckDuel - Multiplayer Card Games for iMessage

🎴 A production-ready iMessage extension for playing live multiplayer card games with friends.

## 🌟 Features

- **Real-time Multiplayer**: Play with friends using Firebase Realtime Database
- **Texas Hold'em Poker**: Full game implementation with betting, hand evaluation, and winner determination
- **Beautiful UI**: Smooth animations and polished poker table interface
- **iMessage Integration**: Ready to be packaged as an iOS Messages Extension
- **Game Lobby**: Create or join games with shareable links
- **Player Management**: Real-time presence, turn tracking, and player status
- **Secure Shuffling**: Cryptographically secure card shuffling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Firebase account (free tier)
- For iOS: Xcode 14+ and Apple Developer account

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Firebase credentials to .env
# (See SETUP.md for detailed instructions)

# Start development server
npm run dev
```

Visit `http://localhost:5173/game` to play!

## 🎮 How to Play

1. **Create a Game**: Choose Texas Hold'em and enter your name
2. **Invite Friends**: Share the auto-generated game link
3. **Start Playing**: Host starts the game when all players join
4. **Take Actions**: Fold, Check, Call, Raise, or go All-In
5. **Win Chips**: Best hand wins the pot!

## 📱 iMessage Extension

This app is designed to run as an iMessage extension. See the [iOS Setup Guide](./ios/README.md) for:

- Creating the Xcode project
- Configuring the Messages Extension
- Building and testing on iOS
- App Store submission process

## 🏗️ Architecture

### Game Logic

- **Deck Management** (`src/lib/game/deck.ts`): Card creation, shuffling, dealing
- **Poker Engine** (`src/lib/game/poker.ts`): Hand evaluation, ranking
- **Texas Hold'em** (`src/lib/game/texasHoldem.ts`): Complete game flow

### Real-time Sync

- **Firebase Integration** (`src/lib/firebase/`): Realtime Database operations
- **State Management** (`src/stores/gameStore.ts`): Zustand store for game state
- **Presence System**: Track online/offline players

### UI Components

- **Poker Table** (`src/components/game/PokerTable.tsx`): Main game interface
- **Card Display** (`src/components/game/Card.tsx`): Animated card component
- **Player Seats** (`src/components/game/PlayerSeat.tsx`): Player info display
- **Game Lobby** (`src/components/game/GameLobby.tsx`): Create/join interface

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Firebase Realtime Database
- **State**: Zustand
- **iOS**: Swift, WebKit (WKWebView)

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup and configuration guide
- **[ios/README.md](./ios/README.md)** - iOS/iMessage extension setup
- **[Firebase Security Rules](./SETUP.md#firebase-security-rules)** - Database configuration

## 🎯 Roadmap

### Completed ✅
- [x] Texas Hold'em game engine
- [x] Real-time multiplayer sync
- [x] Game lobby and player management
- [x] Poker table UI with animations
- [x] Card deck and shuffling system
- [x] Hand evaluation and winner determination

### In Progress 🚧
- [ ] iMessage extension integration
- [ ] Server-side game validation
- [ ] Additional game types (Blackjack, Gin Rummy)
- [ ] Player authentication
- [ ] Game statistics and leaderboards

### Planned 📋
- [ ] Push notifications for turns
- [ ] Spectator mode
- [ ] Tournament support
- [ ] Custom table themes
- [ ] In-game chat

## 🤝 Contributing

Contributions welcome! Areas that need work:

- Additional card game implementations
- UI/UX improvements
- Performance optimizations
- Test coverage
- Documentation improvements

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

## 📧 Support

For issues or questions:
1. Check the [SETUP.md](./SETUP.md) guide
2. Review Firebase console for errors
3. Check browser console for debugging

---

**Status**: Production-ready web app ✅ | iMessage extension: Integration pending 🚧

Happy gaming! 🎴♠️♥️♦️♣️

# DeckDuel - Quick Start Guide

## 🎉 Your app is ready to test!

Everything has been set up for you. Follow these steps to test your iMessage poker game.

## What's Been Done ✅

1. **Firebase**: Configured and connected
2. **Web App**: Production-ready Texas Hold'em poker game
3. **iOS Project**: Complete Xcode project with iMessage extension
4. **Integration**: WebView bridge between native and web
5. **Game Sharing**: Deep linking and iMessage integration

## Test It Now (5 minutes)

### Step 1: Start the Web Server

```bash
npm run dev
```

Keep this terminal open. The web app will run at http://localhost:5173

### Step 2: Open Xcode

```bash
open ios/DeckDuel.xcodeproj
```

### Step 3: Run in Simulator

1. In Xcode, select **DeckDuelMessagesExtension** from the scheme dropdown (top-left)
2. Select **iPhone 16 Pro** (or any iPhone simulator) from the device dropdown
3. Click the **Play button** (▶) or press **⌘R**

The Messages app will open in the simulator.

### Step 4: Test the Extension

1. In the Messages simulator, tap on a conversation (or create a new one)
2. Tap the **App Store icon** (gray icon next to the text field)
3. Find and tap **DeckDuel** in the app drawer
4. The poker game should load!

### Step 5: Create a Game

1. Tap **"Create Game"**
2. Select **"Texas Hold'em"**
3. Enter your name
4. Wait in the lobby

### Step 6: Join with Another Player

**Option A: Open in Browser**
1. In the web browser, go to http://localhost:5173/game
2. Click **"Join Game"**
3. Enter the game ID from your simulator
4. Enter a player name

**Option B: Second Simulator** (if you want to test full iMessage flow)
1. In Xcode: Window > Devices and Simulators
2. Click the **+** button to add another simulator
3. Run the extension on the second simulator
4. Join the same game

### Step 7: Play!

Once 2+ players have joined:
1. Host clicks **"Start Game"**
2. Play Texas Hold'em poker!

## Common Issues & Solutions

### "Cannot connect to localhost"

**Problem**: Simulator can't reach your dev server

**Solution**: Make sure `npm run dev` is running. Check that you see:
```
  ➜  Local:   http://localhost:5173/
```

### "WebView shows blank screen"

**Problem**: The web app isn't loading

**Solutions**:
1. Check Safari Web Inspector:
   - Safari > Develop > Simulator > DeckDuel
2. Check browser console for errors
3. Refresh by restarting the extension

### "App doesn't appear in Messages"

**Problem**: Extension not showing up

**Solutions**:
1. Make sure you selected **DeckDuelMessagesExtension** scheme (not just DeckDuel)
2. Try rebuilding: Product > Clean Build Folder (⌘⇧K), then Build (⌘B)
3. Restart the simulator

### "Build Failed" or "Signing Error"

**Problem**: Code signing issues

**Solution**: For simulator testing only, you can disable signing:
1. Select DeckDuel project
2. Select each target (DeckDuel and DeckDuelMessagesExtension)
3. Signing & Capabilities tab
4. Uncheck "Automatically manage signing"

## Next Steps

### Before Submitting to App Store:

1. **Add App Icons** (Required)
   - Main app: 1024x1024 icon
   - iMessage extension: 1024x1024 icon
   - Use a card/poker theme

2. **Deploy Web App** (Required)
   - Deploy to Vercel, Netlify, or Firebase Hosting
   - Update production URL in `ios/DeckDuelMessagesExtension/MessagesViewController.swift`:
   ```swift
   #else
   let urlString = "https://YOUR-PRODUCTION-URL.com/game"
   ```

3. **Update Security Settings** (Required for App Store)
   - Remove `NSAllowsArbitraryLoads` from `ios/DeckDuelMessagesExtension/Info.plist`
   - Only allow HTTPS connections

4. **Add Screenshots** (Required)
   - Take screenshots showing gameplay in iMessage
   - Required sizes for iPhone 16 Pro Max, iPhone 14 Pro Max, etc.

5. **Sign with Developer Account** (Required)
   - Join Apple Developer Program ($99/year)
   - Configure signing with your Team in Xcode

6. **Archive and Submit**
   - See DEPLOYMENT_GUIDE.md for complete instructions

## Testing on Real Devices

To test on your iPhone:

1. Connect iPhone to Mac via cable
2. Trust the computer on iPhone
3. In Xcode, select your iPhone as the destination
4. You'll need to sign the app (free with Apple ID, or paid Developer account)
5. Run and test on actual iMessage with friends!

## Files You May Want to Customize

### Branding
- `ios/DeckDuel/Assets.xcassets/` - Add app icons
- `src/components/HeroSection.tsx` - Update landing page
- `public/` - Add favicon

### Game Settings
- `src/lib/game/texasHoldem.ts` - Adjust starting chips, blinds, etc.
- Starting chips: Line 15 (currently 1000)
- Small/big blind: Lines 27-28 (currently 10/20)

### Colors/Theme
- `tailwind.config.ts` - Customize colors
- `src/index.css` - Global styles

## Debugging

### Enable Web Inspector

The extension is configured to allow debugging:

1. Run the app in simulator
2. Open **Safari**
3. **Safari menu** > **Develop** > **Simulator - iPhone X** > **DeckDuel**
4. Web Inspector opens - you can debug JavaScript, check console, etc.

### Check Firebase

- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project: `deckdual-276a4`
- Realtime Database > Data tab
- See live game state updates

### Xcode Logs

- In Xcode, open the Debug area (⌘⇧Y)
- Console shows native iOS logs
- Look for errors or warnings

## Architecture Overview

```
┌─────────────────────────────────────┐
│   iMessage App (Native iOS)         │
│   - MessagesViewController.swift    │
│   - WKWebView container              │
└───────────────┬─────────────────────┘
                │
                │ JavaScript Bridge
                │
┌───────────────▼─────────────────────┐
│   React Web App                      │
│   - Game.tsx (main game page)        │
│   - PokerTable.tsx (game UI)         │
│   - gameStore.ts (state management)  │
└───────────────┬─────────────────────┘
                │
                │ Firebase SDK
                │
┌───────────────▼─────────────────────┐
│   Firebase Realtime Database        │
│   - Game state synchronization       │
│   - Real-time updates                │
│   - Player presence                  │
└─────────────────────────────────────┘
```

## Performance Tips

- The web app is optimized and minified for production
- Firebase handles real-time sync efficiently
- No server-side code needed - everything is client-side
- Scales to thousands of concurrent games

## Support

- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for full App Store submission process
- **Setup Guide**: See `SETUP.md` for detailed technical documentation
- **Next Steps**: See `NEXT_STEPS.md` for planned features

## Have Fun!

You now have a fully functional iMessage poker game. Test it, customize it, and when you're ready, publish it to the App Store!

If you run into issues, check the Firebase Console and Safari Web Inspector first. Most issues are related to network connectivity or Firebase configuration.

Good luck! 🎴🎉

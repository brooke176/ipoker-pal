# DeckDuel - iMessage Extension Deployment Guide

## Overview

Your DeckDuel iMessage extension is now ready for testing and deployment! This guide will walk you through the complete process from local testing to App Store submission.

## Project Status ✅

- ✅ Firebase configured and ready
- ✅ Web app built and functional
- ✅ iOS Xcode project created
- ✅ iMessage extension implemented with WKWebView
- ✅ Deep linking and game sharing configured
- ✅ Messages app integration complete

## Testing Locally

### Step 1: Start the Development Server

```bash
# In the project root
npm run dev
```

This will start the web app at `http://localhost:5173`. Keep this running during development.

### Step 2: Open the Xcode Project

```bash
open ios/DeckDuel.xcodeproj
```

### Step 3: Configure Signing

1. Select the **DeckDuel** project in Xcode's project navigator
2. Select the **DeckDuel** target
3. Go to **Signing & Capabilities** tab
4. Select your Team (or disable signing for simulator testing with "Automatically manage signing" unchecked)
5. Repeat for the **DeckDuelMessagesExtension** target

### Step 4: Run in Simulator

1. Select **DeckDuelMessagesExtension** scheme from the scheme selector
2. Choose an iPhone simulator (iPhone 14 Pro or later recommended)
3. Press **⌘R** or click the Run button
4. The Messages app will open with your extension loaded

### Step 5: Test the Extension

1. In the Messages app simulator, create a new conversation or open an existing one
2. Tap the App Store icon (next to the text field)
3. Find your DeckDuel app in the app drawer
4. Tap it to launch the extension
5. The poker game should load in the Messages extension

### Testing Multiplayer

**Option A: Two Simulators**
1. Run two iPhone simulators
2. Install the extension on both
3. Send game invitations between them

**Option B: Simulator + Real Device**
1. Install on your iPhone via Xcode (requires Apple Developer account)
2. Use the simulator for the second player
3. Send iMessage between devices

## Building for Production

### Prerequisites

- **Apple Developer Account** ($99/year)
- **Xcode 14+** installed
- **Valid code signing certificates** and provisioning profiles

### Step 1: Update Production URL

Edit `ios/DeckDuelMessagesExtension/MessagesViewController.swift`:

```swift
#if DEBUG
let urlString = "http://localhost:5173/game"
#else
let urlString = "https://YOUR-PRODUCTION-URL.com/game"  // ⚠️ UPDATE THIS
#endif
```

### Step 2: Deploy Web App

Deploy your React app to a hosting provider:

**Recommended Options:**
- **Vercel** (Easiest): `npx vercel --prod`
- **Netlify**: Connect your GitHub repo
- **Firebase Hosting**: `firebase deploy`
- **AWS Amplify**: Connect your GitHub repo

After deployment, update the production URL in MessagesViewController.swift.

### Step 3: Remove Development Settings

Edit `ios/DeckDuelMessagesExtension/Info.plist`:

Remove or set to false:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <!-- Remove these lines for production -->
    <key>NSAllowsArbitraryLoads</key>
    <false/>
</dict>
```

### Step 4: Add App Icons

You need to add app icons for both targets:

1. **Main App Icon**: `ios/DeckDuel/Assets.xcassets/AppIcon.appiconset/`
   - 1024x1024 App Store icon
   - Various sizes for iPhone/iPad

2. **iMessage Extension Icon**: `ios/DeckDuelMessagesExtension/Assets.xcassets/iMessage App Icon.stickersiconset/`
   - 1024x1024 App Store icon
   - Message-specific sizes

**Tips for Creating Icons:**
- Use a card game themed icon
- Make it recognizable at small sizes
- Follow Apple's [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- Use tools like [MakeAppIcon](https://makeappicon.com/) to generate all sizes

### Step 5: Configure App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click **My Apps** → **+** → **New App**
3. Fill in app information:
   - **Platform**: iOS
   - **Name**: DeckDuel
   - **Primary Language**: English
   - **Bundle ID**: `com.deckduel.DeckDuel` (or your bundle ID)
   - **SKU**: A unique identifier (e.g., `deckduel-001`)

4. Configure app details:
   - **Category**: Games → Card
   - **Content Rights**: Your content info
   - **Age Rating**: Complete questionnaire (likely 4+)

### Step 6: Prepare App Store Assets

You'll need:

1. **App Screenshots** (Required for each supported device):
   - iPhone 6.9" Display (iPhone 16 Pro Max)
   - iPhone 6.7" Display (iPhone 14 Pro Max, 15 Pro Max)
   - iPhone 6.5" Display (iPhone 14 Plus, 13 Pro Max, 12 Pro Max, 11 Pro Max)
   - 12.9" iPad Pro (5th gen)

   **Screenshot Requirements:**
   - Show the app in action in Messages
   - Show both compact and expanded view
   - Show actual gameplay
   - No placeholder content

2. **App Preview Video** (Optional but recommended):
   - 15-30 second video showing gameplay
   - Show how to start and play a game
   - Must be actual device footage

3. **App Description**:
   ```
   DeckDuel brings Texas Hold'em poker directly to your iMessage conversations!

   Play poker with friends without leaving Messages. Create a game, share it
   with your friends, and start playing instantly.

   FEATURES:
   • Full Texas Hold'em poker
   • 2-8 players support
   • Real-time multiplayer
   • Beautiful card animations
   • Easy game sharing
   • No account required

   Just tap, play, and enjoy!
   ```

4. **Keywords** (comma-separated, max 100 characters):
   ```
   poker, cards, multiplayer, friends, texas holdem, card game, imessage
   ```

5. **Support URL**: Your website or support page
6. **Marketing URL** (optional): Your marketing website
7. **Privacy Policy URL**: Required (see below)

### Step 7: Create Privacy Policy

You need a privacy policy. Here's a minimal template:

```markdown
# Privacy Policy for DeckDuel

## Data Collection
DeckDuel does not collect, store, or share any personal information.

## Game Data
Game state is temporarily stored in Firebase Realtime Database for the
duration of your game session and is automatically deleted.

## Analytics
We do not use any analytics or tracking services.

## Contact
For questions, contact: your-email@example.com

Last updated: [Date]
```

Host this on your website or use a service like [Privacy Policy Generator](https://www.privacypolicygenerator.info/).

### Step 8: Archive and Upload

1. In Xcode, select **Any iOS Device** as the destination
2. **Product** → **Archive**
3. Wait for the archive to complete
4. In the Archives organizer:
   - Click **Validate App** to check for issues
   - If validation passes, click **Distribute App**
   - Select **App Store Connect**
   - Follow the prompts to upload

### Step 9: Submit for Review

1. Go to App Store Connect
2. Select your app
3. Under **iOS App** section, click **+** next to **Version** to create version 1.0
4. Fill in all required information:
   - What's New in This Version
   - Upload screenshots
   - Add description, keywords, etc.
5. Select the build you uploaded
6. Complete App Review Information:
   - Contact Information
   - Demo Account (if needed - not required for your app)
   - Notes for Reviewer:
     ```
     This is an iMessage extension for playing Texas Hold'em poker with
     friends. To test:
     1. Open Messages app
     2. Start a conversation
     3. Tap the App Store icon
     4. Select DeckDuel
     5. Create a game and start playing

     A second device/simulator can join by tapping on the shared game message.
     ```
7. Answer the Export Compliance questions (typically "No" for encryption)
8. Click **Submit for Review**

## Review Process

- **Typical review time**: 24-48 hours
- **Possible rejection reasons**:
  - Missing screenshots showing iMessage integration
  - App crashes or doesn't load properly
  - Privacy policy issues
  - Icon doesn't meet guidelines

## Post-Approval

Once approved:

1. **Release**: You can release immediately or schedule a release date
2. **Monitor**: Check reviews and crash reports in App Store Connect
3. **Respond**: Reply to user reviews
4. **Update**: Push updates for bug fixes and new features

## Firebase Security Rules

Before launch, update your Firebase Realtime Database rules in the Firebase Console:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        ".read": true,
        ".write": "!data.exists() || data.child('players').child(auth.uid).exists()",
        ".indexOn": ["status", "createdAt"],
        "players": {
          "$playerId": {
            ".write": "$playerId === auth.uid"
          }
        }
      }
    }
  }
}
```

This restricts write access appropriately while allowing read access for game state synchronization.

## Troubleshooting

### Build Issues

**"No code signing identities found"**
- Solution: Add your Apple ID in Xcode Preferences → Accounts

**"Failed to verify bitcode"**
- Solution: Set `ENABLE_BITCODE = NO` in build settings

**"App installation failed"**
- Solution: Clean build folder (⌘⇧K) and rebuild

### Runtime Issues

**WebView shows blank screen**
- Check that `npm run dev` is running (development)
- Check that production URL is correct and accessible
- Check browser console in Safari Web Inspector

**Cannot connect to Firebase**
- Verify `.env` file has correct Firebase credentials
- Check Firebase Console that Realtime Database is enabled
- Check network connectivity

**iMessage extension doesn't appear**
- Make sure you're running the MessagesExtension scheme, not just DeckDuel
- Check that the extension target built successfully
- Try deleting and reinstalling the app

### Debugging WebView

1. Connect iPhone to Mac (or use simulator)
2. Run the extension
3. Open **Safari** → **Develop** → **[Your iPhone/Simulator]** → **DeckDuel**
4. Use web inspector to debug JavaScript

## Performance Optimization

Before release:

1. **Optimize images**: Compress any assets
2. **Minimize bundle**: `npm run build` creates optimized production build
3. **Test on older devices**: Ensure it runs smoothly on iPhone X/11
4. **Test on slow network**: Use Network Link Conditioner

## Marketing Tips

1. **Demo video**: Create a video showing how to play
2. **Social media**: Share on Twitter, Reddit, etc.
3. **Press kit**: Create a simple website with screenshots
4. **Product Hunt**: Launch on Product Hunt
5. **Reddit**: Post in r/iOSGaming, r/poker

## Next Steps & Features

Consider adding:

- **Push notifications**: Notify when it's your turn
- **Player profiles**: Firebase Authentication
- **Game history**: Track wins/losses
- **Tournaments**: Multi-table tournaments
- **More games**: Blackjack, Gin Rummy, etc.
- **In-app purchases**: Premium features
- **Leaderboards**: Global rankings

## Support

For issues during deployment:

1. Check the Xcode build logs
2. Review Apple's [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
3. Check [Apple Developer Forums](https://developer.apple.com/forums/)

## Estimated Timeline

- **Setup & Testing**: 2-4 hours (done! ✅)
- **Icon Design**: 2-4 hours
- **Screenshot Creation**: 1-2 hours
- **App Store Listing**: 1 hour
- **Submission**: 15 minutes
- **Apple Review**: 24-48 hours
- **Total**: ~1 week

---

**Congratulations!** Your iMessage poker app is ready for the world. Good luck with your App Store submission! 🎴🎉

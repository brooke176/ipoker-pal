# Troubleshooting Guide

## Error: "Failed to create game" or "This game type is not yet implemented"

### Quick Fix Steps

1. **Check Firebase Console**
   - Open browser console (F12 or Cmd+Option+I)
   - Look for any error messages, especially Firebase-related ones
   - You should see: "✅ Firebase configuration loaded successfully"

2. **Restart Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart it
   npm run dev
   ```

3. **Check Firebase Realtime Database Rules**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `deckdual-276a4`
   - Go to **Realtime Database** (not Firestore)
   - Click the **Rules** tab
   - Make sure rules allow read/write access:

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

4. **Test Firebase Connection**
   - After restarting the dev server, open http://localhost:5173/game
   - Open browser console (F12)
   - You should see:
     ```
     ✅ Firebase configuration loaded successfully
     📊 Database URL: https://deckdual-276a4-default-rtdb.firebaseio.com
     ```

5. **Clear Browser Cache**
   - Sometimes old cached JavaScript can cause issues
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Common Issues & Solutions

#### Issue: "Firebase configuration incomplete"

**Symptom**: Error message about missing Firebase fields

**Solution**:
1. Make sure `.env` file is in the project root (not in `ios/` folder)
2. Verify all variables start with `VITE_` prefix
3. Restart dev server after changing `.env`

#### Issue: "PERMISSION_DENIED" in console

**Symptom**: Firebase error about permissions

**Solution**: Update Firebase Realtime Database rules (see step 3 above)

#### Issue: Game creates but shows "Waiting for Players" forever

**Symptom**: Can create game but can't start it

**Solution**:
1. Check that you have at least 2 players joined
2. Only the host can start the game
3. Check browser console for errors

#### Issue: Can't join game with game ID

**Symptom**: "Failed to join game" error

**Solution**:
1. Make sure the game ID is correct
2. Check that the game exists in Firebase Console
3. Verify Firebase rules allow write access

#### Issue: "Texas Hold'em requires 2-8 players"

**Symptom**: Error when creating a game

**Solution**: This error was fixed! If you still see it:
1. Make sure you pulled the latest code
2. Restart your dev server (Ctrl+C, then `npm run dev`)
3. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+R)

#### Issue: "This game type is not yet implemented"

**Symptom**: Error when selecting a game type

**Solution**:
- Only Texas Hold'em is implemented
- Make sure you selected "Texas Hold'em" (♠) in the game lobby
- Other games (Gin Rummy, Blackjack, War) are coming soon

### Debug Mode

To see detailed logs, open browser console and check for these messages:

**Good signs:**
```
✅ Firebase configuration loaded successfully
📊 Database URL: https://deckdual-276a4-default-rtdb.firebaseio.com
Game created! Link copied to clipboard.
```

**Bad signs:**
```
❌ Firebase configuration error
PERMISSION_DENIED
Failed to create game
```

### Testing the Game Locally

**Test with 2 Browser Windows:**

1. **Window 1** (Player 1 - Host):
   - Go to http://localhost:5173/game
   - Click "Create Game"
   - Select "Texas Hold'em"
   - Enter name: "Alice"
   - Copy the game link

2. **Window 2** (Player 2):
   - Paste the game link OR
   - Click "Join Game" and enter the game ID
   - Enter name: "Bob"

3. **Back to Window 1**:
   - You should see Bob joined
   - Click "Start Game"
   - Play poker!

### Firebase Realtime Database Check

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `deckdual-276a4`
3. Click **Realtime Database** in the left menu
4. Click the **Data** tab
5. You should see a `games` node
6. When you create a game, a new entry appears here
7. You can see all game data in real-time

### Still Having Issues?

1. **Check Firebase Console Logs**
   - Go to Firebase Console > your project
   - Check if there are any quota limits or errors

2. **Verify Network Connection**
   - Make sure you're connected to the internet
   - Try opening https://deckdual-276a4-default-rtdb.firebaseio.com/.json in your browser
   - You should see `{"error":"Permission denied"}`  (this is expected without auth)

3. **Try Incognito/Private Window**
   - Sometimes browser extensions interfere
   - Try in incognito mode to rule out extensions

4. **Check Package Versions**
   ```bash
   npm list firebase
   ```
   Should show: `firebase@12.7.0` or similar

### Getting More Help

If you're still stuck, provide these details:

1. Error message from browser console (full text)
2. Screenshot of Firebase Console showing Realtime Database rules
3. Screenshot of browser console when trying to create game
4. Output of `npm run dev`

### Firebase Quota Limits

Free tier limits:
- **Simultaneous connections**: 100
- **GB stored**: 1 GB
- **GB downloaded**: 10 GB/month

For development, you're nowhere near these limits. If you somehow hit them, upgrade to the Blaze plan (pay-as-you-go).

---

## Other Common Issues

### Port 5173 already in use

```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### TypeScript errors in IDE

These are just linting warnings and don't affect functionality. The app will still work.

### Simulator can't connect to localhost

In the iOS app, the WebView tries to connect to `http://localhost:5173`. Make sure:
1. Dev server is running (`npm run dev`)
2. You're using the simulator (not a physical device)
3. For physical devices, use your computer's IP address instead of localhost

---

**Pro Tip**: Always check the browser console first! Most issues show clear error messages there.

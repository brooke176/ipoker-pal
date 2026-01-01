# 🔧 Quick Fix - Add Missing Files to Xcode

## What I Did
I created all the missing source files for your main app:
- ✅ AppDelegate.swift
- ✅ ViewController.swift
- ✅ Info.plist
- ✅ Main.storyboard
- ✅ LaunchScreen.storyboard

## 🎯 Add Files to Xcode (2 Minutes)

### Step 1: Open Xcode
```bash
open /Users/brookeskinner/Desktop/Repos/ipoker-pal/ios/Decker/Decker.xcodeproj
```

### Step 2: Add Files to Main App Target

1. In Xcode's left sidebar (Project Navigator), **right-click on "Decker"** folder (the top one, under the project)
2. Select **"Add Files to Decker..."**
3. Navigate to: `/Users/brookeskinner/Desktop/Repos/ipoker-pal/ios/Decker/Decker/`
4. **Select ALL these files:**
   - AppDelegate.swift
   - ViewController.swift
   - Info.plist
   - Base.lproj (the folder)
5. **IMPORTANT:** Check the box **"Copy items if needed"** (at bottom)
6. **IMPORTANT:** Under "Add to targets", make sure **"Decker"** is checked (NOT the extension)
7. Click **"Add"**

### Step 3: Verify Files Were Added

In the Project Navigator, you should now see under "Decker" folder:
- ✅ AppDelegate.swift
- ✅ ViewController.swift
- ✅ Base.lproj
  - Main.storyboard
  - LaunchScreen.storyboard

### Step 4: Clean and Build

1. Press **⌘⇧K** (Cmd+Shift+K) to clean
2. Select **"Decker MessagesExtension"** scheme
3. Select an **iPhone simulator**
4. Press **⌘R** to build and run

### Step 5: Test!

The Messages app should open and your extension should work!

---

## ⚡ Alternative: Quick Xcode Fix

If adding files manually doesn't work, try this:

1. **Close Xcode** (⌘Q)
2. **Delete DerivedData:**
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/Decker-*
   ```
3. **Reopen project:**
   ```bash
   open /Users/brookeskinner/Desktop/Repos/ipoker-pal/ios/Decker/Decker.xcodeproj
   ```
4. **Add files** as described above
5. **Build and run**

---

## 🎯 What Should Happen

After adding the files and building:
- ✅ Build succeeds without errors
- ✅ Messages app opens in simulator
- ✅ Your DeckDuel extension appears
- ✅ Extension loads poker game
- ✅ You can play!

---

## 🐛 If It Still Fails

The error message will be different now. If you get a new error, let me know what it says!

Common next issues:
- **Code signing** - Set to "Sign to Run Locally" or use your Apple ID
- **Simulator not found** - Select a different simulator
- **Files in wrong target** - Make sure files are in "Decker" target, not extension

---

## ✅ Success Checklist

- [ ] All files appear in Xcode Project Navigator under "Decker"
- [ ] AppDelegate.swift and ViewController.swift have target membership "Decker"
- [ ] Build succeeds (⌘B)
- [ ] Can run without "stub app" error
- [ ] Messages app opens
- [ ] Extension works

---

**Ready?** Open Xcode and add the files, then build! 🚀

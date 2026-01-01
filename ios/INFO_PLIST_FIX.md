# 🔧 Fix: Multiple Commands Produce Info.plist

## The Problem
Xcode is trying to process Info.plist in two ways at once, causing a conflict.

## ✅ Quick Fix (1 Minute)

### In Xcode:

1. **Select "Decker" target** (in the left sidebar, click the project name, then select "Decker" under TARGETS)

2. Click on **"Build Phases"** tab (at the top)

3. Expand **"Copy Bundle Resources"** section

4. **Find "Info.plist"** in the list (there might be two - one for main app, one for extension)

5. **Select Info.plist** and click the **minus (-)** button to remove it

6. **Repeat for "Decker MessagesExtension" target:**
   - Select "Decker MessagesExtension" target
   - Go to "Build Phases"
   - Expand "Copy Bundle Resources"
   - Remove "Info.plist" if it's there

7. **Clean and build:**
   - Press **⌘⇧K** (Cmd+Shift+K) to clean
   - Press **⌘R** (Cmd+R) to build and run

---

## 🎯 Alternative: Command Line Fix

If the Xcode UI method doesn't work, let me know and I can fix the project file directly.

---

## ✅ After This Fix

You should be able to build without the "multiple commands" error and the Messages app should open with your extension!

---

## 💡 Why This Happens

Info.plist should ONLY be referenced in Build Settings → Info.plist File (which it is). It should NOT also be in Copy Bundle Resources. Xcode got confused and added it to both places.

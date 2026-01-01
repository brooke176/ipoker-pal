#!/bin/bash

echo "🔍 Verifying DeckDuel iOS Project Files..."
echo ""

# Check main app files
echo "📱 Main App (Decker):"
files=(
    "Decker/AppDelegate.swift"
    "Decker/ViewController.swift"
    "Decker/Info.plist"
    "Decker/Base.lproj/Main.storyboard"
    "Decker/Base.lproj/LaunchScreen.storyboard"
    "Decker/Assets.xcassets"
)

for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
    fi
done

echo ""
echo "📲 Messages Extension:"
files=(
    "Decker MessagesExtension/MessagesViewController.swift"
    "Decker MessagesExtension/Info.plist"
    "Decker MessagesExtension/Base.lproj/MainInterface.storyboard"
    "Decker MessagesExtension/Assets.xcassets"
)

for file in "${files[@]}"; do
    if [ -e "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ MISSING: $file"
    fi
done

echo ""
echo "🎯 Project File:"
if [ -e "Decker.xcodeproj/project.pbxproj" ]; then
    echo "  ✅ Decker.xcodeproj/project.pbxproj"
else
    echo "  ❌ MISSING: Decker.xcodeproj/project.pbxproj"
fi

echo ""
echo "✅ Verification complete!"

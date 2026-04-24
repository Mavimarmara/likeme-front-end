rm -rf ~/Library/Developer/Xcode/DerivedData
cd ios
  rm -rf Pods
  rm -rf ~/Library/Caches/CocoaPods
  rm -rf ~/Library/Developer/Xcode/DerivedData
  pod deintegrate
  pod repo update

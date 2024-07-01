rm s -rf
npm run build
electron-packager ./ --platform=win32 --arch=x64 Tune8
node build-installer.cjs
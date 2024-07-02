rm -rf dist* Tune8-win32-x64 windows_installer
npm run build
electron-packager ./ --platform=win32 --arch=x64 Tune8
node build-installer.cjs

module.exports = {
  packagerConfig: {
    icon: "[...]/public/setupFiles/setup.ico"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        loadingGif: "[...]/public/setupFiles/loader.gif",
        setupIcon: "[...]/public/setupFiles/setup.ico"
      },
    },
    {
      name: "@electron-forge/maker-wix",
      config: {
        ui: {
          chooseDirectory: true,
          images: {
            background: "[...]/public/setupFiles/bg1.jpg",
            banner: "[...]/public/setupFiles/bg2.jpg"
          }
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
};

const {MSICreator} = require('electron-wix-msi')
const path = require('path')

const APP_DIR = path.resolve(__dirname, './Tune8-win32-x64')
const OUT_DIR = path.resolve(__dirname, './windows_installer')

const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    exe: 'Tune8.exe',
    name: 'Tune8',
    description: 'A music player',
    version: '1.0.0',
    manufacturer: 'Grld-Andy',
    noShortcut: false,
    setupIcon: path.resolve(__dirname, './public/setupFiles/tune8-3.ico'),
    ui: {
        chooseDirectory: true,
        images: {
            background: path.resolve(__dirname, './public/setupFiles/bg2.png'),
            banner: path.resolve(__dirname, './public/setupFiles/bg1.png')
        }
    },
    icon: path.resolve(__dirname, './public/setupFiles/tune8-3.ico')
})

msiCreator.create().then(() => {
    msiCreator.compile()
})
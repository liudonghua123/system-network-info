const path = require('path');
const package = require('./package.json');

module.exports = {
  packagerConfig: {
    dir: "build",
    icon: path.resolve(__dirname, 'assets', 'icon'),
    appBundleId: 'com.liudonghua.system-network-info',
    appCategoryType: 'public.app-category.developer-tools',
    win32metadata: {
      CompanyName: 'Donghua Liu',
      OriginalFilename: 'system-network-info',
    },
    osxSign: {
      identity: 'Developer ID Application: Donghua Liu (TODO)'
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: {
        name: 'system-network-info',
        authors: 'Donghua Liu',
        exe: 'system-network-info.exe',
        noMsi: true,
        remoteReleases: '',
        setupExe: `system-network-info-win32-${package.version}-setup-${process.arch}.exe`,
        setupIcon: path.resolve(__dirname, 'assets', 'icon.ico'),
        certificateFile: process.env.WINDOWS_CERTIFICATE_FILE,
        certificatePassword: process.env.WINDOWS_CERTIFICATE_PASSWORD
      }
    },
    {
      // https://v6.electronforge.io/makers/zip
      name: '@electron-forge/maker-zip'
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      // https://js.electronforge.io/maker/deb/interfaces/makerdebconfigoptions
      config: {
        name: 'system-network-info',
        maintainer: 'liudonghua123',
        homepage: 'liudonghua.com',
        icon: path.resolve(__dirname, 'assets', 'icon.ico')
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      // https://js.electronforge.io/maker/rpm/interfaces/makerrpmconfigoptions
      config: {
        name: 'system-network-info',
        maintainer: 'liudonghua123',
        homepage: 'liudonghua.com',
        icon: path.resolve(__dirname, 'assets', 'icon.ico')
      }
    }
  ]
};

module.exports = {
  chainWebpack: config => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .use('vue-loader')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  configureWebpack: {
    module: {
      rules: [
        { test: /\.svg$/, loader: 'vue-svg-loader' }
      ]
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@use '@/assets/styles/_variables.scss' as *;`
      }
    }
  },
  pwa: {
    name: "Cotera.io",
    themeColor: '#312626',
    msTileColor: '#312626',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestPath: 'site.webmanifest',
    iconPaths: {
      favicon16: "favicon-16x16.png",
      favicon32: "favicon-32x32.png",
      maskIcon: "safari-pinned-tab.svg",
      appleTouchIcon: "apple-touch-icon.png",
      msTileImage: "android-chrome-192x192.png",
    },
    manifestOptions: {
      name: "Cotera.io",
      short_name: "Cotera.io",
      background_color: "#312626",
      start_url: "/",
      display: "standalone",
      orientation: "portrait",
      // Include icons in the manifest itself
      icons: [
        { src: "/favicon.ico", sizes: "16x16 32x32 48x48" },
        { src: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { src: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { src: "/favicon-128x128.png", sizes: "128x128", type: "image/png" },
        { src: "/favicon-256x256.png", sizes: "256x256", type: "image/png" },
        { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
      ]
    }
  }
}
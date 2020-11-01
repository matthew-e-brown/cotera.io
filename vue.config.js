const PrerenderSpaPlugin = require('prerender-spa-plugin');
const path = require('path');

module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('svg');

    if (process.env.NODE_ENV === 'production') {
      config.plugin('prerender-spa-plugin').use(new PrerenderSpaPlugin({
        staticDir: path.resolve(__dirname, 'dist'),
        // There's no user-generated content, so we can probably pre-render
        // everything (except the requiresAuth == 'in' routes)
        routes: [
          '/',
          '/about',
          '/login',
          '/login/reset',
          '/register'
        ]
      }));
    }
  },
  configureWebpack: {
    module: {
      rules: [
        { test: /\.svg$/, loader: 'vue-svg-loader' }
      ]
    }
  }
}
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
        prependData: `
        @import "@/assets/styles/_variables.scss";
        `
      }
    }
  }
}
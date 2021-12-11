const path = require('path')
module.exports = {
  lintOnSave: false,
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    port: 3001,
    // proxy: {
    //   '/api': {
    //     // 此处的写法，目的是为了 将 /api 替换成 https://u.y.qq.com/
    //     target: 'https://u.y.qq.com/',
    //     // 允许跨域
    //     changeOrigin: true,
    //     secure: false,
    //     pathRewrite: {
    //       '^/api': ''
    //     },
    //     headers: {
    //       referer: 'https://y.qq.com/',
    //       origin: 'https://y.qq.com',
    //       host: 'u.y.qq.com'
    //     }
    //   }
    // }
  },
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@common': path.resolve(__dirname, 'src/common'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@base': path.resolve(__dirname, 'src/base')
      }
    }
  }
}

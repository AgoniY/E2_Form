const path = require('path')

//__dirname 总是指向被执行 js 文件的绝对路径
const resolve = dir => {
  return path.join(__dirname, dir)
}

const os = require('os')
// 动态获取主机IP地址 host || 也可在package.json中配置 HOST （--host 0.0.0.0)
let arr = []
let HOST
for (let key in os.networkInterfaces()) {
  os.networkInterfaces()[key].forEach((item) => {
    if (item.family === 'IPv4' && item.address.indexOf('192.168.') !== -1) {
      arr.push(item.address)
    }
  })
}
HOST = arr[0]
//console.log(HOST)

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/

// 打包后的资源引用路径
const BASE_URL = process.env.NODE_ENV === 'production'
  ? './'
  : '/'

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'));

    //config.entry.app = ['babel-polyfill', './src/main.js'];
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  
  // 只有在通过devServer启动webpack时，配置文件里的devServer才会生效
  // 这里写你调用接口的基础路径，来解决(**跨域**)，如果设置了代理，那你本地开发环境的axios的baseUrl可写为 '' ，即空字符串
  devServer: {  
    //proxy: 'http://localhost:8888',    //  
    proxy:{
      "/api": {
        target: "http://localhost:8888",    //http://localhost:8888/api
        pathRewrite: {"^/api" : ""},   //修改最终请求的API路径,请求时把指定命名替换掉。  
        //changeOrigin:true,      //// target是域名的话，需要这个参数。是ip地址不用
        //secure:false,     // 设置支持https协议的代理
      }
    },
    //port:8084,               //端口号，默认是8080，如果占用就换成8085等
    open:true,
    //host:HOST,          //启动服务可以将host配置为自己本机的IP地址，供局域网内的其他用户访问自己的设备。cli3已经自动配置
  },
  /* pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      importWorkboxFrom: 'local',
      importsDirectory: 'js',
      navigateFallback: '/',
      navigateFallbackBlacklist: [/\/api\//]
    }
  } */
  pwa: {
    workboxPluginMode: 'GenerateSW', // 也可以定义为‘InjectManifest’模式。但是需自己写SW.js文件进行配置
    workboxOptions: {
        importWorkboxFrom: 'cdn', //从''cdn"导入workbox,也可以‘local’
        skipWaiting: true, // 安装完SW不等待直接接管网站
        clientsClaim: true,
        navigateFallback: '/index.html', 
        exclude: [/\.(?:png|jpg|jpeg|svg)$/], //在预缓存中排除图片
        // 定义运行时缓存
        runtimeCaching: [
            {
                urlPattern: new RegExp('^https://cdn'),
                handler: 'NetworkFirst',
                options: {
                    networkTimeoutSeconds: 20,
                    cacheName: 'cdn-cache',
                    cacheableResponse: {
                        statuses: [200]
                    }
                }
            }
        ]
    }
}
}

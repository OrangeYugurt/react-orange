const path = require('path') // 引入‘path’，为了在这里使用绝对路径，避免相对路径在不同系统时出现不必要的问题
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development'
const config={
    // 入口文件
    entry: {
        /*
            app: path.join(__dirname, '../src/app.js')  // app.js作为打包的入口 __dirname返回绝对路径
            path.join('/a', '/b') // 'a/b'  目录拼接
            path.resolve('/a', '/b') // '/b' 结对路径的目录拼接
        */
        app: path.resolve('src/app.js')  // app.js作为打包的入口
    },
    // 输出目录/出口文件
    output: {
        filename: '[name].[hash:4].js',  //name代表entry对应的名字; hash代表 整个app打包完成后根据内容加上hash。一旦整个文件内容变更，hash就会变化
        // path: path.join(__dirname, '../dist'), // 打包好之后的输出路径
        path: path.resolve('dist'), // 打包好之后的输出路径
        publicPath: '' // 静态资源文件引用时的路径（加在引用静态资源前面的）
    },
    // 配置loader/处理对应模块
    module: {
        rules: [
            {
                test: /.jsx$/, //使用loader的目标文件。这里是.jsx
                loader: 'babel-loader'
            },
            {
                test: /.(js)$/, //使用loader的目标文件。这里是.js
                loader: 'babel-loader',
                include: path.resolve('src'),
                exclude: [
                    path.resolve('node_modules')  // 由于node_modules都是编译过的文件，这里我们不让babel去处理其下面的js文件
                
                ]
            },
            {
                test: /\.css$/,     // 解析css
                use: ExtractTextWebpackPlugin.extract({
                    use: [ 'css-loader', 'postcss-loader']   // 将css用link的方式引入就不再需要style-loader了
                })
                /* 
                    也可以这样写，这种方式方便写一些配置参数
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                */
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            },
        ]
    },
     // 提取公共代码
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
    },
    //对应的插件
    plugins: [
        // 生成一个html页面，同时在webpack编译的时候。把我们所生成的entry都注入到这个html页面中,路径都是根据我们output配置的来走的。
        new HtmlWebpackPlugin({
            template: path.resolve('src/index.html'), // 以index.html作为模板文件生成html
            hash: true, // 会在打包好的bundle.js后面加上hash串
        }),
        new ExtractTextWebpackPlugin('css/style.css'),  // 拆分后会把css文件放到dist目录下的css/style.css
        new CleanWebpackPlugin('dist'),
        // 热替换，热替换不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    // 别名
    // alias: {
    //     $: './src/jquery.js'
    // },
    // 省略后缀
    // extensions: ['.js', '.json', '.css'],





    // 模式配置        
    mode: 'development'      
}
if (isDev) {
    // 开发服务器配置
    config.devServer = {
      host: '127.0.0.1',  // 我们可以允许我们用任意方式进行访问（127.0.0.1，localhost, 本机ip）
      port: '10031',
      contentBase: path.resolve('dist'),
    //   hot: true,  //启动热加载
    //   open: true, // 自动打开浏览器
      overlay: {  // 错误提醒弹窗小遮层
        errors: true //只显示error
      },
      // 和output配置对应起来
      publicPath: '/',  // 访问所有静态路径都要前面加/public才能访问生成的静态文件
      historyApiFallback: {
        index: '/index.html' // 所有404的请求全部访问该配置下的url
      }
    }
  }
module.exports =config; 
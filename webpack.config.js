const path = require('path') //path是node.js中的基本包，用来处理路径的

const HTMLPlugin = require('html-webpack-plugin')
//该插件将为你生成一个 HTML5 文件,其中包括使用 script 标签的 body 中的所有 webpack 包,
//只需添加插件到你的 webpack 配置

const isDev = process.env.NODE_ENV === 'development' //判断当前运行环境是否在开发环境
//我们在启动脚本时设置的环境变量全部存在于process.env这个对象里面的，无论设置多少环境变量

const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')
//帮我们把非js文件单独打包成一个静态资源文件

const config = {
    target: 'web', //webpack的编译目标是web平台，默认是web，可以省略不写
    entry: path.join(__dirname, 'src/index.js'), //入口文件，__dirname相当于跟目录，根目录与后面路径拼接起来就是绝对路径
    output: { //出口文件，也就是打包后的文件名和路径
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [
            { //一.vue结尾的文件用vue-loader来解析
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            // {//因为我们用的是stylus,所以这个配置可以去掉
            //     test: /\.css$/,
            //     // loader: 'css-loader',
            //     use: [ //两个loader经常配合使用 
            //         'style-loader', //把css-loader打包好的css文件以style标签的形式插入到html文件里
            //         'css-loader' //把项目中的css读出来打包好
            //     ]
            // },
            // {//css预处理器的配置
            //     //根据不同的环境，不同的加法
            //     test: /\.styl$/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 sourceMap: true
            //             }
            //         },
            //         'stylus-loader'
            //     ]
            // },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [
                    {//url-loader依赖于file-loader,做了一层封装
                     //url-loader将图片转换成base64的编码直接写在js的内容里面，而不是生成单独的图片文件
                     //对于较小的图片很有用处，减少了请求的次数
                     //对于较大的图片，得不偿失，会加大加载页面的大小，代码可读性差，limit进行限制
                        loader: 'url-loader',
                        options: {
                            limit: 1024, //图片小于1024Byte才会转义，大于这个值用file-loader解析
                            name: '[name]-aaa.[ext]'//输出图片的名字，name就是图片输入时的名字，ext扩展名
                                                    //名字可以随意定义，比如 -aaa
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        //用处：1. 在webpack编译的过程中以及我们再写js代码时在判断环境时可以调用process.env.NODE_ENV
        //2. 在vue react中，会根据不同的环境进行区分打包，所以要根据'process.env'这个变量进行区分
        new webpack.DefinePlugin({//在vue react中要写上
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]
}

if (isDev) {//在开发环境下，我们对devServer做一些配置
    config.module.rules.push({
        test: /\.styl$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'
    //devtool是帮助我们在页面上调我们的代码的，因为我们的代码都是.vue ES6等的代码，浏览器需编译之后
    //才能运行，如果我们直接调试代码，都是编译之后的代码，所以要用这个工具
    config.devServer = {
        port: 8000, //devServer启动时监听的端口
        host: '0.0.0.0', //访问的地址，使用这个host我们可以用localhost访问，也可以用ip访问，可以用其他电脑手机访问我们的内网IP访问
        overlay: {//在webpack编译打包时有任何的错误，都显示在网页上面
         errors: true   
        },
        //open: true,//我们运行完dev-server的时候，帮我自动打开浏览器
        // historyApiFallback: {//把webpack不理解也就是没有映射的地址全部映射到入口的index.html上

        // }
        hot: true, //热加载，改动了页面的内容，不用全部刷新，之刷新改变内容的那个组件，
    },
    config.plugins.push(//热加载需要配置的，其实热加载过程的代码怎么处理，是需要我们自己定的，但我们使用vue，vue已经处理啦
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    config.entry = {
        path: path.join(__dirname, 'src/index.js'),
        vendor: ['vue'] //将vue框架单独打包
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.styl$/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'stylus-loader'
            ]
        })
    })
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'//将vendor打包成一个单独文件
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'//将webpack打包成单独文件
        })
    )
}




module.exports = config


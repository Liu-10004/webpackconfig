let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');//自动把生成一个html
let MiniCssExtractPLugin = require('mini-css-extract-plugin');// 提取css，生成新的css文件
let OptimizeCss = require('optimize-css-assets-webpack-plugin');//压缩css
let Uglifyjs = require('uglifyjs-webpack-plugin');//压缩js
let webpack = require('webpack') // 目的是把 jquery 注入到每个模块中去
let CleanWebpackPlugin = require('clean-webpack-plugin')//每次打包前都会清空上一次打包好的文件
let copyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  mode:'production',
  
  entry:{// 多入口的话，就可以用对象的形式来写
    main:'./src/main.js',
    home:'./src/index.js',
    other:'./src/other.js',
    q:'./src/q.js',
    // react:'./src/index1.js'
  },
  devServer:{ // 在内存中生成一个打包文件
    port:3000,// 默认是 8080
    progress:true,// 能看到进度条
    open:true, //自动打开浏览器
    contentBase:'./build',
    compress:true,
  },
  output:{
    //filename:'bundle[hash:8].js',
    filename:'[name].js',
    path:path.resolve(__dirname,'dist'),
    //publicPath:'http://www.ssa.cn/'  // 指向 cdn 地址，给引用的图片或者其他文件加上这些前缀，但是如果只想从 cdn 中取图片，那么可以把这个命令单独加到图片的loader下
  },

  


  // 配置跨域
  devServer:{

    proxy:{
      '/api':{
        target:'http://localhost:3001', //这里就配置了一个代理
        pathRewrite:{'/api':''} //把 api 替代成空
      }
    },

    //前端只想单纯的mock一些数据
    before(app){
      app.get('/user',(req,res)=>{
        res.json({name:'lalalla'})
      })
    }

    // 有服务端 ，不用代理来处理，能不能在服务端中启动webpack，端口用服务端端口

  },
  
  devtool:'eval-source-map',

  watch:true,
  watchOptions:{
    poll:1000,// 每秒轮询1000次
    
    aggregateTimeout:500, // 防抖，输入代码500毫秒后开始更新
    ignored:/node_modules/  // 不需要监控这个文件
  },
  optimization:{// 优化项
    minimizer:[
      new OptimizeCss(), //压缩css
      new Uglifyjs({
        cache:true, // 设置缓存
        parallel:true, // 并发压缩
        sourceMap:true, // 源码映射
      })
    ],
  },

  resolve:{//解析第三方包  common
    modules:[path.resolve('node_module')],
    extensions:['.js','.css','.json'],//定义扩展名
    alias:{ //别名  vue  vue.runtime  
      bootstrap:'bootstrap/dist/css/bootstrap.css',
        // 公共组件
      Mycomponents: path.join(process.cwd(), './src/components'),
      // 公共帮助类库
      Myutilities: path.join(process.cwd(), './src/utils'),
      
    },
    modules:["src","node_modules"]
  },

  plugins:[
    new webpack.IgnorePlugin(/\.\/locale/,/moment/),// 在moment 中把这个包忽略掉，我们这个文件太大了，我们用不到
    new HtmlWebpackPlugin({
      template:'./src/index.html',//模板的位置
      filename:'index.html',//打包出来文件的命名
      chunks:['main'],
      hash:true,//防止bundle更新了，但是bundle文件名字没有更新，bundle一个hash戳
      minify:{
        removeAttributeQuotes:true,// 去除双引号
        collapseWhitespace:true,// 不折行
        
      },
      
    }),
    new HtmlWebpackPlugin({
      template:'./src/index.html',//模板的位置
      filename:'main.html',//打包出来文件的命名
      chunks:['main'],
      hash:true,//防止bundle更新了，但是bundle文件名字没有更新，bundle一个hash戳
      minify:{
        removeAttributeQuotes:true,// 去除双引号
        collapseWhitespace:true,// 不折行
        
      },
    }),
    new HtmlWebpackPlugin({
      template:'./src/index.html',//模板的位置
      filename:'react.html',//打包出来文件的命名
      chunks:['react','q'],
      hash:true,//防止bundle更新了，但是bundle文件名字没有更新，bundle一个hash戳
      
    }),
    // 产出到某个文件夹下，并且压缩
    new MiniCssExtractPLugin({
      filename:'css/main.css'
    }),

    new webpack.ProvidePlugin({ // 在每个模块中都注入 $
      $:'jquery'
    }),

    new CleanWebpackPlugin(), 

    new copyWebpackPlugin([ 
      {from:'doc',to:'./'}
    ]),

    new webpack.BannerPlugin('by liubignqun in 2019.4.23'),

    //定义环境变量 , 把DEV 注入文件中
    new webpack.DefinePlugin({
      DEV:JSON.stringify('prodution'),
    }),
    // new webpack.Dll
  ],

  //假如我已经在html 中引入了  jquery 的 cdn，就不需要把它打包了
  externals:{
    jquery: 'jQuery'
  },


  module:{//模块
    noParse:/jquery/, //不去解析jquery 中的依赖库 ，使打包速度更快
    rules:[//loader 默认是从右边向做执行的， 从下到上来的
      
      
      // {
      //   test:/\.js$/,
      //   use:{
      //     loader:'eslint-loader',
      //     options:{
      //       enforce:'pre' //它会改变执行顺序，它会在别的规则前面
      //     }
      //   },
        
      // },

      {
        test:/\.html$/,
        use:'html-withimg-loader',
      },
      {
        test:/\.(png|jpg|gif)$/,
        use:{
          loader:'url-loader',
          // 做一个 限制当 我们的图片 小于多少 k的时候， 用base64来转化
          // 否则用file-loader 产出真实的图片
          options:{
            limit:2*1024,
            //产出的文件到特定的文件夹下面
            outputPath:'img/',
            publicPath:'http://www.ssa.cn/'
          }
        }
        
      },

      {
        test:require.resolve('jquery'),
        use:'expose-loader?$',
      },
      
      //规则 css-loader 解析@import这种语法
      // style-loader 是把 css 插入到head 的标签中
      // loader 的特点 只专一处理
      // loader 的用法  字符串只用一个 loader
      // 多个loader 需要[] , loader 的顺序默认  是从右向左执行 ，loader还可以写成对象的形式的
      // loader 还可以写成对象方式
      // {
      //   test:/\.css$/,
      //   use:[
      //     // {
      //     //   loader:'style-loader',
      //     //   options:{
      //     //     insertAt:'top',
      //     //   }
      //     // },
      //   //MiniCssExtractPLugin.loader,//代替了上面的部分
      //   'css-loader',
      //   'postcss-loader',//css 自动加上各种前缀
      //   ]
      // },
      {
        test:/\.less$/,
        use:[
          {
          loader:'style-loader',
          options:{
            insertAt:'top',
          }
        },
        //MiniCssExtractPLugin.loader,//代替了上面的部分
        'css-loader',
        'postcss-loader',
        'less-loader'
      ]
      },
      
      {
        test:/\.js$/,
        exclude:/node_modules/,
        include:path.resolve('src'),
        use:{
          loader:'babel-loader',
          options:{//babel-loader 需要 把 es6 转 es5
            presets:[
              '@babel/preset-env',// 预设
              '@babel/preset-react'
            ],
            plugins:[
              '@babel/plugin-proposal-class-properties',
              "@babel/plugin-transform-runtime",
              
            ]
          }
        },
        include:path.resolve(__dirname,'src'),
        exclude:/node_modules/
        


      }
    ]
  }
}

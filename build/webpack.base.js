const path = require('path');
const webpack = require('webpack');
const glob = require("glob")
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");  
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const pxtorem = require('postcss-pxtorem')
const autoprefixer = require('autoprefixer')
const optimizeCss = require('optimize-css-assets-webpack-plugin') 

const jsArr = glob.sync(path.join(__dirname, "../src/views/*/*.js"));
const entryObject = {};
const HtmlArray = [];
Object.keys(jsArr).map(index=>{
        const entryFile = jsArr[index];
        const match = entryFile.match(/src\/views\/(.*)\/index\.js/);
        const pageName = match && match[1];
        entryObject[pageName] = entryFile;
}) 
Object.keys(entryObject).forEach(item=>{
    HtmlArray.push(
        new HtmlWebpackPlugin({
            filename: `html/${item}/index.html`,
            template: path.resolve(__dirname, `../src/views/${item}/index.html`),
            inject: true,
            chunks:[`${item}`],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
            }
          })
    )
})
module.exports={
    entry: entryObject,
    module:{
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                  test: /\.(png|svg|jpg|gif)$/,
                  use:[
                      {
                          loader: 'file-loader',
                          options:{
                              limit:5000,
                              name: "imgs/[name].[ext]"
                          }
                    }
                  ]
            },
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=happyBabel',
                exclude: /node_modules/
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                              ident: 'postcss',
                              plugins: () => [
                                pxtorem({
                                  rootValue: 100,
                                  propWhiteList: []
                                }),
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                  browsers: [
                                    'iOS >= 7',
                                    'Android >= 4',
                                    '>1%',
                                    'Firefox ESR',
                                    'not ie < 9'
                                  ],
                                  flexbox: 'no-2009'
                                })
                              ]
                            }
                        },
                        {
                            loader: 'less-loader',
                            options: { javascriptEnabled: true }
                        }
                    ]
                })
            }
        ]
    },
    plugins:[
        new webpack.HashedModuleIdsPlugin(),
        //打包之前清除文件
        new CleanWebpackPlugin(),
        ...HtmlArray,
        new VueLoaderPlugin(),
        new ExtractTextPlugin("./style/[name].css"),
        new optimizeCss({
            assetNameRegExp: /\.style\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),  
        new HappyPack({
            id: "happyBabel",
            loaders:[{
                loader:"babel-loader?cacheDirectory=true"
            }],
            threadPool: happyThreadPool,
            verbose: true
        })  
    ]
}
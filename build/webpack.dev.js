const merge = require('webpack-merge')
const common = require('./webpack.base.js');
const path = require('path');

module.exports = merge(common,{
    devtool: 'inline-source-map',
    devServer: {
        host: 'localhost', //虚拟目录 (内存中存在)
        port: 8088,
        open: true,
        hot: true,
        openPage: 'src/app.html'
    },
    output: {
        filename: 'js/[name]/[name].[hash].js', //每次保存hash都会发生变化
        path:path.join(__dirname,'../dist')
    },
    module:{},
    mode:'development'
})
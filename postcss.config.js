//说明： postcss是后编译我们的css的，就是css已经通过css-loader styles-loader 处理打包之后
//postcss在对他们进行处理优化，用一系列的组件优化

const autoprefixer = require('autoprefixer') //自动添加css中一些需要加浏览器前缀的属性前缀

module.exports = {
    plugins: [
        autoprefixer()
    ]
}






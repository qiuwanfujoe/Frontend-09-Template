module.exports = {
    entry:"./main.js",
    mode:"development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
      },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[ '@babel/preset-env' ],
                        plugins:[
                            ["@babel/plugin-transform-react-jsx",{pragma:'createElement'}]
                        ]
                    }
                }
            }
        ]
    }
}
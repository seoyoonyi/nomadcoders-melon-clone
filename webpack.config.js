const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const BASE_JS = './src/client/js/';
const PUG_DIR = path.resolve(__dirname, 'src/views');

function findAllPugFiles(dir, arrayOfFiles) {
    const files = fs.readdirSync(dir);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            arrayOfFiles = findAllPugFiles(dir + '/' + file, arrayOfFiles);
        } else if (file.endsWith('.pug')) {
            arrayOfFiles.push(path.join(dir, '/', file));
        }
    });

    return arrayOfFiles;
}

const pugFiles = findAllPugFiles(PUG_DIR);
const htmlPlugins = pugFiles.map(pugFile => {
    const outputFilename = pugFile.endsWith('home.pug')
        ? 'index.html' 
        : pugFile.replace(PUG_DIR, '').replace('.pug', '.html').replace(/\\|\//g, '_'); 

    return new HtmlWebpackPlugin({
        template: pugFile,
        filename: outputFilename
    });
});

module.exports = {
    entry: {
        main: BASE_JS + 'main.js',
    },
    devtool: 'source-map',
    plugins: [
		...htmlPlugins,
        new MiniCssExtractPlugin({
            filename: 'css/styles.css',
        }),
		new webpack.EnvironmentPlugin(['NODE_ENV']),

    ],
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'assets'),
        clean: true,
        publicPath: '/', 
    },
    resolve: {
        alias: {
            '@public': path.resolve(__dirname, 'public'),
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
							outputPath: 'public/',  
							publicPath: '/public/', 
                        },
                    },
                ],
            },
            {
                test: /\.pug$/,
                use: ['pug-loader'] 
            },
        ],
    },
};

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const BASE_JS = './src/client/js/';

module.exports = {
	entry: {
		main: BASE_JS + 'main.js',
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/styles.css',
		}),
	],
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'assets'),
		clean: true,
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
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							outputPath: '/',
							publicPath: '/',
						},
					},
				],
			},
		],
	},
};

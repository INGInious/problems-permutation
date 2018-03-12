const path = require('path');
var webpack = require('webpack');

var projectConfig = {
	devtool: 'source-map',
	mode: 'development',
	entry: {
		index: './src/index.jsx',
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PermutationTaskUI',
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [
		  	{
				test: /\.jsx?$/,
				use: [
					{ loader: 'babel-loader',
					  query:
						{
							babelrc: false,
							cacheDirectory: true,
							presets: [['es2015', {modules: false}], 'react', 'stage-3']
						}
					}
				]
			}
		]
	},
	externals: {
		Muuri: 'muuri',
		Hammer: 'hammerjs'
	}
};

var pluginConfig = {
	mode: 'production',
	entry: {
		index: './src/index.jsx',
	},
	output: {
		filename: '../../inginious-problems-permutation/static/task/bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PermutationTaskUI',
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
		  'process.env': {
			'NODE_ENV': JSON.stringify('production')
		  }
		})
	],
	module: {
		rules: [
		  	{
				test: /\.jsx?$/,
				use: [
					{ loader: 'babel-loader',
					  query:
						{
							babelrc: false,
							cacheDirectory: true,
							presets: [['es2015', {modules: false}], 'react', 'stage-3']
						}
					}
				]
			}
		]
	},
	externals: {
		Muuri: 'muuri'
	}
};

module.exports = [projectConfig, pluginConfig];

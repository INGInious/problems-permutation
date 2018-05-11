const path = require('path');
var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
	devtool: 'source-map',
	mode: 'development',
	entry: {
		index: './src/index.jsx',
	},
	output: {
		filename: '../../inginious-problems-permutation/static/ui/permutation_task.js',
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
	}
};
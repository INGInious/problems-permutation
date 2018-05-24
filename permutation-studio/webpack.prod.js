const path = require('path');

var webpack = require('webpack');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var JavaScriptObfuscator = require('webpack-obfuscator');


module.exports = {
	mode: 'production',
	entry: {
		index: './src/index.jsx',
	},
	output: {
		filename: '../../inginious-problems-permutation/static/ui/permutation_studio.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PermutationStudioUI',
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
		  'process.env.NODE_ENV':  JSON.stringify('production')
		}),
		new JavaScriptObfuscator ({
			rotateUnicodeArray: true
		}, '../../inginious-problems-permutation/static/ui/permutation_task.js')
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
	}
};
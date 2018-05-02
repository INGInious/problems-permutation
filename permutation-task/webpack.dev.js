const path = require('path');

module.exports = {
	devtool: 'source-map',
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9001
    },
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
		muuri: 'Muuri',
		hammerjs: 'HammerJS'
	}
};
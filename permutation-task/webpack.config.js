const path = require('path');

var projectConfig = {
	mode: 'development',
	entry: './src/index.jsx',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PermutationTaskUI',
	}
};

var pluginConfig = {
	mode: 'development',
	entry: {
		index: './src/index.jsx',
	},
	output: {
		filename: '../../inginious-problems-permutation/static/task/bundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: 'var',
		library: 'PermutationTaskUI',
	}
};

module.exports = [projectConfig, pluginConfig];

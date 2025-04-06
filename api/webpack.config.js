import { fileURLToPath } from 'url';

import path from 'node:path';
import nodeExternals from 'webpack-node-externals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
	entry: './src/server.ts',
	target: 'node',
	mode: 'development',
	devtool: 'source-map',
	externals: [ nodeExternals() ],

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'server.js'
	},

	resolve: {
		extensions: ['.ts', '.js'],
		alias: {
			'~': path.resolve(__dirname, "src/")
		}
	},
	
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
}

export default config;
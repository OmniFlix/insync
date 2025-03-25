const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    webpack: function override (config, env) {
        config.resolve.fallback = {
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            process: require.resolve('process/browser'),
            buffer: require.resolve('buffer'),
            vm: false,
        };

        config.resolve.alias = {
            ...config.resolve.alias,
            '../package.json': path.resolve(__dirname, 'node_modules/@namada/sdk/package.json'),
        };

        config.resolve.extensions = [...config.resolve.extensions, '.ts', '.js', '.wasm'];

        // Enable WebAssembly support
        config.experiments = {
            asyncWebAssembly: true,
            topLevelAwait: true,
        };

        // Add rule to properly handle .wasm files
        config.module.rules.push({
            test: /\.wasm$/,
            type: 'asset/resource',
        });

        // Copy WASM file from node_modules/@namada/sdk/dist to the build folder
        config.plugins = [
            ...config.plugins,
            new HtmlWebpackPlugin({
                template: path.join(__dirname, './public/index.html'),
            }),
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new webpack.DefinePlugin({
                process: {
                    env: {},
                },
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, 'node_modules/@namada/sdk/dist/shared.namada.wasm'),
                        to: '',
                    },
                    {
                        from: path.resolve(__dirname, 'node_modules/@namada/sdk/dist/crypto.namada.wasm'),
                        to: '',
                    },
                ],
            }),
        ];

        config.ignoreWarnings = [/Failed to parse source map/];

        return config;
    },

    // Function to customize the devServer
    devServer: function (configFunction) {
        return function (proxy, allowedHost) {
            // Get the default config and modify it
            const config = configFunction(proxy, allowedHost);

            // Update devServer settings here
            config.static = [
                path.join(__dirname, 'public'),
                path.join(__dirname, 'node_modules', '@heliaxdev', 'namada-sdk', 'dist'),
                path.join(__dirname, 'node_modules', '@namada', 'sdk', 'dist'),
            ];
            config.compress = true;
            config.port = 9000;

            // Return the modified configuration
            return config;
        };
    },
};

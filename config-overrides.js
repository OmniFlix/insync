const webpack = require('webpack');

module.exports = function override (config, env) {
    config.resolve.fallback = {
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer'),
    };
    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.js'];
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ];
    config.ignoreWarnings = [/Failed to parse source map/];

    return config;
};

'use strict';
const webpack  = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const entry   = require('./webpack.entry');

module.exports = {

    mode: 'development',

    context: path.resolve(__dirname, './resources/js'),

    devtool: 'cheap-module-eval-source-map',

    entry,

    output: {
        path: __dirname + '/public/js',
        filename: '[name].js',
        // library: 'app',
        pathinfo: true
    },

    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            js  : path.resolve(__dirname, './resources/js'),
        },
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // это будет применяться к файлам `.js`
            // А ТАКЖЕ к секциям `<script>` внутри файлов `.vue`
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            // это будет применяться к файлам `.css`
            // А ТАКЖЕ к секциям `<style>` внутри файлов `.vue`
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            // это правило будет применяться к обычным файлам `.scss`
            // А ТАКЖЕ к секциям `<style lang="scss">` в файлах `.vue`
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     Vue    : ['vue/dist/vue.runtime.esm.js', 'default'],
        // //     // Vuex   : ['vuex/dist/vuex.esm.js', 'default'],
        // }),

        // убедитесь что подключили плагин!
        new VueLoaderPlugin()
    ]
};

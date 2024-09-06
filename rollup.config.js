import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import serve from 'rollup-plugin-serve';
import less from 'rollup-plugin-less';
import resolve from '@rollup/plugin-node-resolve'; //编写的代码与依赖的第三方库进行合并
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import json from 'rollup-plugin-json';
import url from '@rollup/plugin-url';
import image from '@rollup/plugin-image';
import { terser } from 'rollup-plugin-terser';
const path = require('path');

const isProd = process.env.NODE_ENV == 'production'; // 环境 or 开发环境
const extensions = ['.js', '.jsx', '.less', '.json'];

export default [
  {
    //入口文件
    input: './src/main.js',
    //输出文件
    output: [
      {
        file: "./dist/index.js",
        format: "umd",
        name: 'KGraph',
        sourcemap: !isProd ? true : false,
      },
    ],
    plugins: [
      resolve({
        extensions,
      }),
      json(),
      url(),
      image(),
      replace({
        'process.env.NODE_ENV': JSON.stringify(
          isProd ? 'production' : 'development'
        ),
      }),
      isProd && terser(),
      !isProd &&
      livereload({
        watch: 'dist',
      }),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true,
      }),
      commonjs(),
      less(),
      !isProd &&
      serve({
        open: true, // 是否打开浏览器
        contentBase: '', // 入口html的文件位置
        historyApiFallback: true, // Set to true to return index.html instead of 404
        host: 'localhost',
        port: 10001,
      }),
    ],
    //隐掉(!) this has been rewritten to undefined这个报错，自定义警告事件
    onwarn: function (warning) {
      if (warning.code === 'THIS_IS_UNDEFINED') {
        return;
      }
    },
  },
];


// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import routes from './routes';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV, SERVE_ENV, NODE_ENV } = process.env;
const IS_PROD = NODE_ENV !== 'development';
console.log('当前环境', REACT_APP_ENV, '代理环境', SERVE_ENV, 'node环境', NODE_ENV);
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // define: {
  //   REACT_APP_ENV: REACT_APP_ENV,
  // },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: false,
    siderWidth: 200,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  // 生产环境移除 console，性能优化
  extraBabelPlugins: [IS_PROD ? 'transform-remove-console' : ''],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});

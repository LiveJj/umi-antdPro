import serveUrlMap from './serveUrlMap';
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: serveUrlMap[process.env.SERVE_ENV],
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
    '/repos/': {
      target: 'https://api.github.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/repos': '',
      },
    },
    '/moko/': {
      target: 'https://authapi-dev.s-moko.cn',
      changeOrigin: true,
      pathRewrite: {
        '^/moko': '',
      },
    },
  },
  test: {},
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};

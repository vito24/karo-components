const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;

module.exports = {
  port: 8000,
  // exclude: /should-be-ignore/,
  source: {
    components: './components',
    docs: './docs'
  },
  theme: './site/theme',
  htmlTemplate: './site/theme/static/template.html',
  themeConfig: {
    categoryOrder: {
      'Ant Design': 0,
      原则: 1,
      Principles: 1,
      视觉: 2,
      Visual: 2,
      模式: 3,
      Patterns: 3,
      其他: 6,
      Other: 6,
      Components: 100,
    },
    typeOrder: {
      General: 0,
      Layout: 1,
      Navigation: 2,
      'Data Entry': 3,
      'Data Display': 4,
      Feedback: 5,
      Other: 6,
      通用: 0,
      布局: 1,
      导航: 2,
      数据录入: 3,
      数据展示: 4,
      反馈: 5,
      其他: 6,
    },
  },
  root: '/',
  lessConfig: {
    javascriptEnabled: true,
  },
  webpackConfig(config) {
    config.plugins.push(new CSSSplitWebpackPlugin({ size: 4000 }));

    return config;
  }
};

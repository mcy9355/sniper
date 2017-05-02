var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  new webpack.optimize.CommonsChunkPlugin(
    {
      name: ['jquery'],   // 将公共模块提取
      filename: 'common.js',
      minChunks: 3 // 提取所有entry公用依赖的模块
    }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
  }),
  new webpack.IgnorePlugin(/src\/libs\/*/),
  new ExtractTextPlugin('[name].[contenthash:9].css')
];

module.exports = {
  cache: true,
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true
  },
  entry: {
    whd: 'webpack/hot/dev-server',
    client: 'webpack-dev-server/client?http://localhost:8080',
    'login': './src/js/login.js',
    'login2': './src/js/login2.js',
    'index': './src/js/index.js',
    'host-manage': './src/js/host-manage.js',
    'log-details': './src/js/log-details.js',
    'strategy': './src/js/strategy.js',
    'defend-tem': './src/js/defend-tem.js',
    'host-details': './src/js/host-details.js',
    'area-manage': './src/js/area-manage.js',
    'action-track': './src/js/action-track.js',
    'restore': './src/js/restore.js',
    'system-settings': './src/js/system-settings.js',
    'system-status': './src/js/system-status.js',
    'email': './src/js/email.js',
    'audit-log': './src/js/audit-log.js',
    'email-setting': './src/js/email-setting.js',
    'upgrade-setting': './src/js/upgrade-setting.js',
    'safe-migrate': './src/js/safe-migrate.js',
    'install': './src/js/install.js',
    'account': './src/js/account.js',
    'download': './src/js/download.js',
    'about': './src/js/about.js',
    'more-scan-result': './src/js/more-scan-result.js',
    'more-associated-operation': './src/js/more-associated-operation.js',
    'no-licence': './src/js/no-licence.js',
    'event-details': './src/js/event-details.js',
    'event-link': './src/js/event-link.js',
    'network-connections': './src/js/network-connections.js',
    'data-filter': './src/js/data-filter.js',
    'template': './src/js/template.js',
    'sys-sta': './src/js/sys-sta.js'
  },
  plugins: plugins,
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js',
    publicPath: '/static/js/'
    //publicPath: './js/'
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style!css-loader'},
      {test: /\.js$/, loader: 'babel?presets[]=es2015'},
      {test: /\.less$/, loader: 'style!css!less?sourceMap'},
      {test: /\.(gif|png|jpg|jpeg)$/, loader: 'url?limit=8192&name=images/[name].[ext]'},
      {test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'url'}
    ]
  },
  resolve: {
    root: __dirname,
    extensions: ['', '.js', '.json', '.less'],
    alias: {
      baseURL: 'src/js/base-url.js',
      jquery: 'src/lib/jquery-1.12.1.min.js',
      layer: 'src/lib/layer/layer.js',
      daterangepicker: 'src/lib/daterangepicker/daterangepicker.js',
      jqueryModal: 'src/lib/jquery-modal/jquery.modal.min.js',
      scrollbar: 'src/lib/jquery.perfect-scrollbar/perfect-scrollbar.jquery.min.js',
      switchery: 'src/lib/switchery/switchery.js',
      dataTables: 'src/lib/jquery.dataTables/js/jquery.dataTables.min.js',
      echarts: 'src/lib/echarts.min.js',
      china: 'src/lib/china.js',
      serialize: 'src/lib/jquery.serialize-object.js',
      select2: 'src/lib/select/select2.js',
      tooltipster: 'src/lib/tooltipster/tooltipster.bundle.min.js',
      jsTree: 'src/lib/jsTree/jstree.min.js',
      slide: 'src/lib/jquery.SuperSlide.2.1.1.js'
    }
  },
  externals: {
    '$': 'jquery'
  }
};

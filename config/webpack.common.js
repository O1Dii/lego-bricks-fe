const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('./paths');
const postcssNormalize = require('postcss-normalize');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const publicUrl = paths.servedPath.slice(0, -1);
const getClientEnvironment = require('./env');
const env = getClientEnvironment(publicUrl);

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: paths.publicUrlOrPath.startsWith('.')
        ? {publicPath: '../../'}
        : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: true,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvDevelopment,
          root: "" //paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: isEnvDevelopment,
        },
      }
    );
  }
  return loaders;
};

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

const isEnvDevelopment = env.raw.NODE_ENV === "development";
const isEnvProduction = env.raw.NODE_ENV === 'production';

module.exports = {
  stats: {
    warnings: true,
    assets: true,
    children: false
  },
  entry: paths.appIndexJs,
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  module: {
    rules: [
      {parser: {requireEnsure: false}},
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            // fucking react-leaflet morons, fucking cannot compile their fucking library to fucking es6, fuck them, fuck react-leaflet
            // useless stupid pieces of dog shit
            exclude: /node_modules\/(?!(@react-leaflet|react-leaflet)\/)/i,
            use: [
              {
                loader: require.resolve('babel-loader'),
                options: {
                  customize: require.resolve(
                    'babel-preset-react-app/webpack-overrides'
                  ),
                  sourceType: 'unambiguous',
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        modules: false,
                      },
                    ],
                    [
                      require.resolve('babel-preset-react-app'),
                      {
                        runtime: hasJsxRuntime ? 'automatic' : 'classic',
                      },
                    ],
                    '@babel/preset-react',
                  ],

                  plugins: [
                    [
                      require.resolve('babel-plugin-named-asset-import'),
                      {
                        loaderMap: {
                          svg: {
                            ReactComponent:
                              '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                          },
                        },
                      },
                    ],
                    require.resolve('@babel/plugin-proposal-optional-chaining'),
                    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
                    require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
                  ].filter(Boolean),
                  // This is a feature of `babel-loader` for webpack (not Babel itself).
                  // It enables caching results in ./node_modules/.cache/babel-loader/
                  // directory for faster rebuilds.
                  cacheDirectory: true,
                  // See #6846 for context on why cacheCompression is disabled
                  cacheCompression: false,
                  compact: isEnvProduction,
                },
              },
              {
                loader: 'eslint-loader',
                options: {
                  emitError: isEnvProduction,
                }
              }
            ],
          },
          {
            test: /\.css$/,
            exclude: /\.module\.css$/,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: true,
              url: false
            }),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
          {
            test: /\.(scss|sass)$/,
            exclude: /\.module\.(scss|sass)$/,
            use: getStyleLoaders(
              {
                importLoaders: 3,
                sourceMap: true,
                url: false
              },
              'sass-loader'
            ),
            // Don't consider CSS imports dead code even if the
            // containing package claims to have no side effects.
            // Remove this when webpack adds a warning or an error for this.
            // See https://github.com/webpack/webpack/issues/6571
            sideEffects: true,
          },
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};
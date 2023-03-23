// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const sveltePreprocess = require("svelte-preprocess");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: {
    background: "./src/background/background.ts",
    linkedin: "./src/content/linkedin.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(svelte)$/,
        loader: "svelte-loader",
        options: {
          preprocess: sveltePreprocess({}),
        },
      },
      {
        // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".ts", ".js", ".svelte"],
    modules: ["node_modules"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte"],
  },
  devtool: false,
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};

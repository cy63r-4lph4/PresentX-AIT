// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  config.resolver.assetExts = config.resolver.assetExts.filter(
    (ext) => ext !== "svg"
  );
  config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

  config.transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
  );

  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    crypto: require.resolve("react-native-crypto"),
  };

  return withNativeWind(config, {
    input: "./app/global.css",
  });
})();

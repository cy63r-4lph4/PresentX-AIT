const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// ✅ Remove .svg from assetExts and add to sourceExts
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// ✅ Add SVG transformer
config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");

// ✅ Wrap with NativeWind config
module.exports = withNativeWind(config, {
  input: "./app/global.css",
});

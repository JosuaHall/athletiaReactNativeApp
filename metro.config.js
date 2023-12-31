const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  // Define custom transformer settings to disable minification
  const customTransformConfig = {
    transformer: {
      ...defaultConfig.transformer,
      minifierConfig: {
        // Disable minification
        keep_fnames: true,
      },
    },
  };

  return {
    ...defaultConfig,
    transformer: customTransformConfig.transformer,
    server: {
      rewriteRequestUrl: (url) => {
        if (!url.endsWith(".bundle")) {
          return url;
        }

        return (
          url +
          "?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true"
        );
      },
    },
  };
})();

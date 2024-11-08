/* eslint-disable @typescript-eslint/no-var-requires */
// This plugin is used to enable AdSupport for Firebase Analytics on iOS

const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const PREPEND_LINE = [];
PREPEND_LINE.push('$RNFirebaseAnalyticsEnableAdSupport = true');
PREPEND_LINE.push('$RNFirebaseAnalyticsWithoutAdIdSupport = true');

/**
 *
 * @param {import('expo/config-plugins').ExportedConfig} config
 * @returns {import('expo/config-plugins').ExportedConfigWithProps}
 */
module.exports = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, 'Podfile');

      const contents = fs.readFileSync(file, 'utf-8').replace(PREPEND_LINE.join('\n'), '');

      fs.writeFileSync(file, PREPEND_LINE.join('\n') + contents);

      return config;
    },
  ]);
};

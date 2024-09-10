// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => {
    const relativeFilenames = filenames.map((filename) => path.relative(process.cwd(), filename));
    return [`eslint --fix ${relativeFilenames.join(' ')}`, `prettier --write ${relativeFilenames.join(' ')}`];
  },
};

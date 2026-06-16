// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import next from "@insurance/config/eslint/next";

const config = [
  ...next,
  { ignores: ["public/mockServiceWorker.js"] },
  ...storybook.configs["flat/recommended"]
];

export default config;

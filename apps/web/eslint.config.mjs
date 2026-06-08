import next from "@insurance/config/eslint/next";

const config = [...next, { ignores: ["public/mockServiceWorker.js"] }];

export default config;

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: process.env.OPENAPI_SPEC_SOURCE ?? "https://api-dev.brbosang.com/v3/api-docs",
  output: "./src/shared/api/generated",
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    {
      name: "zod",
      exportFromIndex: true,
      definitions: {
        case: "PascalCase",
        name: "{{name}}Schema",
      },
    },
    "@hey-api/sdk",
    "@tanstack/react-query",
  ],
});

<div align="center">
  <h1>@call-me-dev/clean-architecture-example</h1>

  <p>
    <a href="./README.md" target="_blank">
      <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-green.svg">
    </a>
    <a href="./LICENSE" target="_blank">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-Call_Me_Dev-blue.svg" />
    </a>
  </p>

  <p>Clean Architecture and Test Driven Development<p>
</div>

## 📝 Table of content

- 🚀 [Getting Started](#getting-started)

## <a id="getting-started" name="getting-started">🚀 Getting Started</a>

```shell
# Install all the dependencies
pnpm i
# Run the application in development mode
pnpm development
```

    "build": "swc ./src --ignore **/*.spec.ts --out-dir ./build --strip-leading-paths",
    "development": "pnpm start:watch --silent & pnpm build --quiet --watch",
    "start": "node ./build/main.js",
    "start:watch": "chokidar build/**/*.js --initial -c \"pnpm run restart\"",
    "restart": "lsof -ti tcp:8080 | xargs kill -15 && node ./build/main.js",

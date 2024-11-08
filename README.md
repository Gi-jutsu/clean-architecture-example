<div align="center">
  <h1>NestJS - Clean Architecture Boilerplate</h1>

  <p>
    <a href="./README.md" target="_blank">
      <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg">
    </a>
    <a href="./LICENSE" target="_blank">
      <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" />
    </a>
  </p>
</div>

## 📝 Table of content

- 🚀 [Quick Start](#quick-start)
- 🌟 [Key Features](#key-features)
- 📂 [Project Structure](#project-structure)

## <a id="quick-start" name="quick-start">🚀 Quick Start</a>

> [!IMPORTANT]
> This API requires a postgresql database. <br />

<details>
<summary>Bootstrap the PostgreSQL database</summary>

1. Start PostgreSQL using [docker-compose.yaml](/docker/docker-compose.yaml)

```shell
docker compose -f docker/docker-compose.yaml database
```

2. Run the SQL migrations

```shell
pnpm drizzle-kit migrate
```

</details>

<details>

<summary>Start the API on Your Local Machine</summary>

```shell
# Run the backend in watch mode
pnpm dev
```

</details>

## <a id="key-features" name="key-features"> 🌟 Key Features </a>

### 🐳 Docker-Ready

- <b>Optimized for Deployments</b>: Multi-stage build keeps the production image lean, reducing network footprint and speeding up deployments.

- <b>Run Locally:</b> Launch the entire stack (API + Database) with [docker-compose.yaml](/docker/docker-compose.yaml)

## <a id="project-structure" name="project-structure"> 📂 Project Structure </a>

```perl
📁 src/
├── 📁 core/
│ ├── 📁 errors/ # Generic error classes
│ └── 📁 primitives/ # Core building blocks such as AggregateRoot, ...
│
├── 📁 identity-and-access/
│ ├── 📁 domain/ # Business logic around identity (e.g. Account, ...)
│ ├── 📁 infrastructure/ # Adapters implementing interfaces for external systems (e.g. database, JWT, email services, ...)
│ ├── 📁 use-cases/
│ └── 📄 identity-and-access.module.ts
│
├── 📁 shared-kernel/
│ ├── 📁 infrastructure/ # Adapters used across multiple bounded-contexts (e.g. GoogleCloudTasks, ...)
│ ├── 📁 use-cases/
│ └── 📄 shared-kernel.module.ts
│
├── 📄 application.module.ts
└── 📄 main.ts
```

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

- 👋 [Introduction](#👋-introduction)
- 🚀 [Quick Start](#🚀-quick-start)
- 🌟 [Key Features](#🌟-key-features)
- 📂 [Project Structure](#📂-project-structure)

## 👋 Introduction

Welcome to the NestJS Boilerplate. This project provides a solid foundation for building scalable and maintainable backend applications with NestJS, following the [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). It also integrates concepts from [Domain-Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html) to help organize your code around the core business logic.

## 🚀 Quick Start

> [!IMPORTANT]
> To run the backend locally, you need a PostgreSQL database with migrations applied.

### Bootstrap the PostgreSQL database

1. Start PostgreSQL using [docker-compose.yaml](/docker/docker-compose.yaml)

```shell
docker compose -f docker/docker-compose.yaml up database -d
```

2. Run the SQL migrations

```shell
pnpm drizzle-kit migrate
```

### Start the API on Your Local Machine

```shell
# Run the backend in watch mode
pnpm dev
```

## 🌟 Key Features

### 🐳 Docker-Ready

- <b>Optimized for Deployments</b>: Multi-stage build keeps the production image lean, reducing network footprint and speeding up deployments.

- <b>Run Locally:</b> Launch the entire stack (API + Database) with [docker-compose.yaml](/docker/docker-compose.yaml)

## 📂 Project Structure

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

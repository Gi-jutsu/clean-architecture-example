import { accountSchema } from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

let postgreSqlContainer: StartedPostgreSqlContainer;

export async function setup() {
  postgreSqlContainer = await new PostgreSqlContainer().start();

  const client = new pg.Client({
    connectionString: postgreSqlContainer.getConnectionUri(),
  });
  await client.connect();
  process.env.DATABASE_URL = postgreSqlContainer.getConnectionUri();

  const database = drizzle(client);

  await migrate(database, {
    migrationsFolder: "./drizzle",
  });

  const accounts = [
    {
      id: "52afc7a5-f0e7-4477-b5c7-249ef34099a1",
      email: "dylan@call-me-dev.com",
      password: "password",
    },
  ];

  await database.insert(accountSchema).values(accounts).execute();

  await client.end();
}

export async function teardown() {
  await postgreSqlContainer.stop();
}

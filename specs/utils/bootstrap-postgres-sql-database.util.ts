import { accountSchema } from "@identity-and-access/infrastructure/database/drizzle/schema.js";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

export async function bootstrapPostgresSqlDatabase() {
  const postgreSqlContainer = await new PostgreSqlContainer().start();
  const postgreSqlClient = new pg.Client({
    connectionString: postgreSqlContainer.getConnectionUri(),
  });

  await postgreSqlClient.connect();

  // @TODO: Is there a better way to set the DATABASE_URL?
  // What about using a .env.e2e file?
  process.env.DATABASE_URL = postgreSqlContainer.getConnectionUri();

  // Apply migrations & fixtures
  const client = drizzle(postgreSqlClient);

  await migrate(client, { migrationsFolder: "./drizzle" });

  // @TODO: Fixtures should be applied in a more elegant way
  const accounts = [
    {
      id: "52afc7a5-f0e7-4477-b5c7-249ef34099a1",
      email: "dylan@call-me-dev.com",
      // password: "password" (hashed with bcrypt using 10 rounds)
      password: "$2b$10$KSdssXhRW/VjBlb7uAMt.OgwcwjycWZx8oCxam6JV.hmL0BMPp.iu",
    },
  ];

  await client.insert(accountSchema).values(accounts).execute();

  await postgreSqlClient.end();

  return { postgreSqlContainer };
}

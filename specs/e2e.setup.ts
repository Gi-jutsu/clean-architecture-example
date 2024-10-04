import { bootstrapPostgresSqlDatabase } from "./utils/bootstrap-postgres-sql-database.util.js";

const { postgreSqlContainer } = await bootstrapPostgresSqlDatabase();

export async function setup() {
  await bootstrapPostgresSqlDatabase();
}

export async function teardown() {
  await postgreSqlContainer.stop();
}

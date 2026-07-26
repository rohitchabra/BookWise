import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://user:pass@localhost:5432/bookwise";

const client = postgres(connectionString, {
  prepare: false,
  ssl: "require",
});

export const db = drizzle(client, { schema });

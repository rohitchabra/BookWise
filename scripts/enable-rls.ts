import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, {
    ssl: "require",
    max: 1,
    prepare: false,
  });

  try {
    // The app connects as the table owner (postgres role), which bypasses
    // RLS. Enabling it with no policies blocks the Supabase Data API
    // (anon/authenticated roles) from reading these tables.
    await sql`alter table public.users enable row level security`;
    await sql`alter table public.books enable row level security`;
    await sql`alter table public.borrow_records enable row level security`;

    const status = await sql`
      select tablename, rowsecurity
      from pg_tables
      where schemaname = 'public'
      order by tablename
    `;
    console.log("RLS status:", status);
    await sql.end();
  } catch (error) {
    console.error("Failed:", error);
    await sql.end({ timeout: 1 }).catch(() => undefined);
    process.exit(1);
  }
}

main();

import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { hash } from "bcryptjs";
import { books, users } from "../src/database/schema";
import { sampleBooks } from "../src/constants";

config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  ssl: "require",
  max: 1,
});
const db = drizzle(client);

async function seed() {
  console.log("Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "admin@bookwise.com";
  const hashedPassword = await hash("admin12345", 10);

  await db
    .insert(users)
    .values({
      fullName: "BookWise Admin",
      email: adminEmail,
      universityId: 1000001,
      password: hashedPassword,
      universityCard: "https://placehold.co/600x400/png?text=Admin+ID",
      status: "APPROVED",
      role: "ADMIN",
    })
    .onConflictDoNothing();

  for (const book of sampleBooks) {
    await db
      .insert(books)
      .values({
        title: book.title,
        author: book.author,
        genre: book.genre,
        rating: Math.round(book.rating),
        coverUrl: book.coverUrl,
        coverColor: book.coverColor,
        description: book.description,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies,
        videoUrl: book.videoUrl,
        summary: book.summary,
      })
      .onConflictDoNothing();
  }

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / admin12345`);
  await client.end();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await client.end();
  process.exit(1);
});

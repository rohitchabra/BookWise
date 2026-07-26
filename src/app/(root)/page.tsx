import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
import { Book } from "@/types";

async function getLatestBooks(): Promise<Book[]> {
  try {
    if (!process.env.DATABASE_URL) return sampleBooks as Book[];

    const latestBooks = (await db
      .select()
      .from(books)
      .limit(10)
      .orderBy(desc(books.createdAt))) as Book[];

    return latestBooks.length > 0 ? latestBooks : (sampleBooks as Book[]);
  } catch {
    return sampleBooks as Book[];
  }
}

const HomePage = async () => {
  const session = await auth();
  const latestBooks = await getLatestBooks();
  const featured = latestBooks[0];

  return (
    <>
      <BookOverview
        book={featured}
        userId={session?.user?.id as string}
        userStatus={session?.user?.status}
      />
      <BookList
        title="Latest Books"
        books={latestBooks.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default HomePage;

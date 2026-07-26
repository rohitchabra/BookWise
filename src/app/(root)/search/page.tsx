import { Suspense } from "react";
import { ilike, or } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BookList from "@/components/BookList";
import SearchInput from "@/components/SearchInput";
import { sampleBooks } from "@/constants";
import { Book } from "@/types";
import Image from "next/image";
import Link from "next/link";

async function searchBooks(query?: string): Promise<Book[]> {
  try {
    if (!process.env.DATABASE_URL) {
      if (!query) return sampleBooks as Book[];
      const q = query.toLowerCase();
      return (sampleBooks as Book[]).filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.genre.toLowerCase().includes(q),
      );
    }

    if (!query) {
      return (await db.select().from(books).limit(12)) as Book[];
    }

    const results = await db
      .select()
      .from(books)
      .where(
        or(
          ilike(books.title, `%${query}%`),
          ilike(books.author, `%${query}%`),
          ilike(books.genre, `%${query}%`),
        ),
      )
      .limit(20);

    return results as Book[];
  } catch {
    return sampleBooks as Book[];
  }
}

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;
  const results = await searchBooks(query);

  return (
    <section className="animate-fade-up">
      <h1 className="text-center font-bebas-neue text-5xl text-light-100">
        Discover Your Next Great Read
      </h1>

      <Suspense fallback={<div className="mt-10 h-14" />}>
        <SearchInput initialQuery={query || ""} />
      </Suspense>

      {results.length > 0 ? (
        <BookList
          title={query ? `Search Results for "${query}"` : "All Books"}
          books={results}
          containerClassName="mt-16"
        />
      ) : (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <Image
            src="/icons/search-fill.svg"
            alt="No results"
            width={64}
            height={64}
            className="opacity-40"
          />
          <h2 className="text-2xl font-semibold text-white">No Results Found</h2>
          <p className="max-w-md text-light-100">
            We couldn&apos;t find any books matching &quot;{query}&quot;. Try a
            different search term.
          </p>
          <Link href="/search" className="form-btn mt-2 max-w-xs">
            Clear Search
          </Link>
        </div>
      )}
    </section>
  );
};

export default SearchPage;

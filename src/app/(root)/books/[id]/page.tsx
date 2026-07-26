import { eq, ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BookOverview from "@/components/BookOverview";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { Book } from "@/types";

async function getBook(id: string): Promise<Book | null> {
  try {
    if (!process.env.DATABASE_URL) {
      return (sampleBooks as Book[]).find((b) => b.id === id) || null;
    }

    const result = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    return (result[0] as Book) || null;
  } catch {
    return (sampleBooks as Book[]).find((b) => b.id === id) || null;
  }
}

async function getSimilarBooks(id: string, genre: string): Promise<Book[]> {
  try {
    if (!process.env.DATABASE_URL) {
      return (sampleBooks as Book[])
        .filter((b) => b.id !== id)
        .slice(0, 6);
    }

    const similar = await db
      .select()
      .from(books)
      .where(ne(books.id, id))
      .limit(6);

    return similar as Book[];
  } catch {
    return (sampleBooks as Book[]).filter((b) => b.id !== id).slice(0, 6);
  }
}

const BookDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await auth();
  const book = await getBook(id);

  if (!book) notFound();

  const similarBooks = await getSimilarBooks(id, book.genre);

  return (
    <>
      <BookOverview
        book={book}
        userId={session?.user?.id as string}
        userStatus={session?.user?.status}
      />

      <section className="mt-20 space-y-6">
        <div>
          <h3 className="font-bebas-neue text-3xl text-light-100">Video</h3>
          <div className="mt-4 aspect-video max-w-2xl overflow-hidden rounded-xl bg-dark-300">
            {book.videoUrl ? (
              <iframe
                src={book.videoUrl}
                title={`${book.title} trailer`}
                className="h-full w-full"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-light-100">
                No trailer available
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-bebas-neue text-3xl text-light-100">Summary</h3>
          <p className="mt-3 max-w-3xl whitespace-pre-line text-xl text-light-100">
            {book.summary}
          </p>
        </div>
      </section>

      <BookList
        title="More Similar Books"
        books={similarBooks}
        containerClassName="mt-20"
      />
    </>
  );
};

export default BookDetailsPage;

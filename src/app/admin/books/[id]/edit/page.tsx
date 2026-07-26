import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import BookForm from "@/components/admin/BookForm";
import { sampleBooks } from "@/constants";
import { Book } from "@/types";

const EditBookPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  let book: Book | null = null;

  try {
    if (process.env.DATABASE_URL) {
      const result = await db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);
      book = (result[0] as Book) || null;
    } else {
      book = (sampleBooks as Book[]).find((b) => b.id === id) || null;
    }
  } catch {
    book = (sampleBooks as Book[]).find((b) => b.id === id) || null;
  }

  if (!book) notFound();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold text-dark-400">Edit Book</h1>
      <BookForm type="update" book={book} />
    </section>
  );
};

export default EditBookPage;

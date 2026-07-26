import Link from "next/link";
import Image from "next/image";
import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { sampleBooks } from "@/constants";

const BooksPage = async () => {
  let allBooks: Array<{
    id: string;
    title: string;
    author: string;
    genre: string;
    createdAt?: Date | null;
    coverUrl: string;
    coverColor: string;
  }> = [];

  try {
    if (process.env.DATABASE_URL) {
      allBooks = await db.select().from(books).orderBy(desc(books.createdAt));
    } else {
      allBooks = sampleBooks;
    }
  } catch {
    allBooks = sampleBooks;
  }

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-dark-400">All Books</h1>
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Image src="/icons/admin/plus.svg" alt="add" width={14} height={14} />
          Create a New Book
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-light-300 text-light-500">
            <tr>
              <th className="px-4 py-3 font-medium">Book Title</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Genre</th>
              <th className="px-4 py-3 font-medium">Date Created</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {allBooks.map((book) => (
              <tr key={book.id} className="border-t border-admin-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="relative h-12 w-8 overflow-hidden rounded-sm"
                      style={{ backgroundColor: book.coverColor }}
                    >
                      <Image
                        src={book.coverUrl}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-dark-400">{book.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-dark-200">{book.author}</td>
                <td className="px-4 py-3 text-dark-200">{book.genre}</td>
                <td className="px-4 py-3 text-dark-200">
                  {book.createdAt
                    ? dayjs(book.createdAt).format("MMM DD, YYYY")
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/books/${book.id}/edit`}
                    className="text-sm font-medium text-blue"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BooksPage;

import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import ProfileCard from "@/components/ProfileCard";
import BorrowedBookCard from "@/components/BorrowedBookCard";
import { sampleBooks } from "@/constants";
import { Book } from "@/types";

const MyProfilePage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;

  let universityId: number | null = null;
  let universityCard: string | null = null;
  let borrowed: Array<{
    book: Book;
    borrowDate: Date | string;
    dueDate: string;
    status: string;
  }> = [];

  try {
    if (process.env.DATABASE_URL && userId) {
      const userRows = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userRows[0]) {
        universityId = userRows[0].universityId;
        universityCard = userRows[0].universityCard;
      }

      const records = await db
        .select({
          borrow: borrowRecords,
          book: books,
        })
        .from(borrowRecords)
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .where(eq(borrowRecords.userId, userId))
        .orderBy(desc(borrowRecords.createdAt));

      borrowed = records.map((r) => ({
        book: r.book as Book,
        borrowDate: r.borrow.borrowDate,
        dueDate: r.borrow.dueDate,
        status: r.borrow.status,
      }));
    }
  } catch {
    borrowed = (sampleBooks as Book[]).slice(0, 2).map((book) => ({
      book,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      status: "BORROWED",
    }));
  }

  return (
    <section className="flex flex-col gap-10 lg:flex-row">
      {session && (
        <ProfileCard
          session={session}
          universityId={universityId}
          universityCard={universityCard}
        />
      )}

      <div className="flex-1">
        <h2 className="font-bebas-neue text-4xl text-light-100">
          Borrowed Books
        </h2>
        {borrowed.length === 0 ? (
          <p className="mt-6 text-light-100">
            You haven&apos;t borrowed any books yet.
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-5">
            {borrowed.map((item, index) => (
              <BorrowedBookCard
                key={`${item.book.id}-${index}`}
                book={item.book}
                borrowDate={item.borrowDate}
                dueDate={item.dueDate}
                status={item.status}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyProfilePage;

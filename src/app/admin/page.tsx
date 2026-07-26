import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";

async function getStats() {
  try {
    if (!process.env.DATABASE_URL) {
      return {
        totalBooks: 6,
        totalUsers: 12,
        borrowRequests: 3,
        recentBorrows: [] as Array<{
          id: string;
          userName: string;
          bookTitle: string;
          borrowDate: Date;
          status: string;
        }>,
        recentUsers: [] as Array<{
          id: string;
          fullName: string;
          email: string;
          createdAt: Date | null;
        }>,
      };
    }

    const [booksCount] = await db.select({ count: count() }).from(books);
    const [usersCount] = await db.select({ count: count() }).from(users);
    const [borrowsCount] = await db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED"));

    const recentBorrows = await db
      .select({
        id: borrowRecords.id,
        userName: users.fullName,
        bookTitle: books.title,
        borrowDate: borrowRecords.borrowDate,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.createdAt))
      .limit(5);

    const recentUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5);

    return {
      totalBooks: booksCount.count,
      totalUsers: usersCount.count,
      borrowRequests: borrowsCount.count,
      recentBorrows,
      recentUsers,
    };
  } catch {
    return {
      totalBooks: 0,
      totalUsers: 0,
      borrowRequests: 0,
      recentBorrows: [],
      recentUsers: [],
    };
  }
}

const AdminHomePage = async () => {
  const stats = await getStats();

  return (
    <>
      <h1 className="text-2xl font-semibold text-dark-400">
        Welcome, Admin
      </h1>

      <section className="mt-6 flex flex-wrap gap-4">
        {[
          { label: "Total Books", value: stats.totalBooks },
          { label: "Total Users", value: stats.totalUsers },
          { label: "Borrow Requests", value: stats.borrowRequests },
        ].map((stat) => (
          <div key={stat.label} className="admin-stat min-w-[180px]">
            <p className="text-sm text-light-500">{stat.label}</p>
            <p className="text-3xl font-semibold text-dark-400">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-400">
              Borrow Requests
            </h2>
            <Link
              href="/admin/borrow-records"
              className="text-sm font-medium text-blue"
            >
              View all
            </Link>
          </div>
          {stats.recentBorrows.length === 0 ? (
            <p className="text-sm text-light-500">No borrow requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentBorrows.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-light-300 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-dark-400">{item.bookTitle}</p>
                    <p className="text-xs text-light-500">
                      {item.userName} · {dayjs(item.borrowDate).format("MMM DD")}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-light px-3 py-1 text-xs font-medium text-blue">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-admin-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-dark-400">
              Recently Added Users
            </h2>
            <Link href="/admin/users" className="text-sm font-medium text-blue">
              View all
            </Link>
          </div>
          {stats.recentUsers.length === 0 ? (
            <p className="text-sm text-light-500">No users yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-lg bg-light-300 px-4 py-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-full bg-blue text-xs font-semibold text-white">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-dark-400">{user.fullName}</p>
                    <p className="text-xs text-light-500">{user.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="mt-8">
        <Link
          href="/admin/books/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue/90"
        >
          <Image src="/icons/admin/plus.svg" alt="add" width={16} height={16} />
          Create a New Book
        </Link>
      </div>
    </>
  );
};

export default AdminHomePage;

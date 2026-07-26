import { desc, eq } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";

const BorrowRecordsPage = async () => {
  let records: Array<{
    id: string;
    status: string;
    borrowDate: Date;
    dueDate: string;
    returnDate: string | null;
    userName: string;
    userEmail: string;
    bookTitle: string;
  }> = [];

  try {
    if (process.env.DATABASE_URL) {
      records = await db
        .select({
          id: borrowRecords.id,
          status: borrowRecords.status,
          borrowDate: borrowRecords.borrowDate,
          dueDate: borrowRecords.dueDate,
          returnDate: borrowRecords.returnDate,
          userName: users.fullName,
          userEmail: users.email,
          bookTitle: books.title,
        })
        .from(borrowRecords)
        .innerJoin(users, eq(borrowRecords.userId, users.id))
        .innerJoin(books, eq(borrowRecords.bookId, books.id))
        .orderBy(desc(borrowRecords.createdAt));
    }
  } catch {
    records = [];
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-dark-400">Borrow Requests</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-light-300 text-light-500">
            <tr>
              <th className="px-4 py-3 font-medium">Book</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Borrowed</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-light-500">
                  No borrow requests yet.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-t border-admin-border">
                  <td className="px-4 py-3 font-medium text-dark-400">
                    {record.bookTitle}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-dark-400">{record.userName}</p>
                    <p className="text-xs text-light-500">{record.userEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-dark-200">
                    {dayjs(record.borrowDate).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3 text-dark-200">
                    {dayjs(record.dueDate).format("MMM DD, YYYY")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        record.status === "RETURNED"
                          ? "bg-green-light text-green"
                          : "bg-blue-light text-blue"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BorrowRecordsPage;

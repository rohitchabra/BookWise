import { eq, desc } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import AccountRequestActions from "@/components/admin/AccountRequestActions";

const AccountRequestsPage = async () => {
  let pendingUsers: Array<typeof users.$inferSelect> = [];

  try {
    if (process.env.DATABASE_URL) {
      pendingUsers = await db
        .select()
        .from(users)
        .where(eq(users.status, "PENDING"))
        .orderBy(desc(users.createdAt));
    }
  } catch {
    pendingUsers = [];
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-dark-400">Account Requests</h1>
      <p className="mt-1 text-sm text-light-500">
        Approve or deny new student registrations.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-light-300 text-light-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Date Requested</th>
              <th className="px-4 py-3 font-medium">University ID</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-light-500">
                  No pending account requests.
                </td>
              </tr>
            ) : (
              pendingUsers.map((user) => (
                <tr key={user.id} className="border-t border-admin-border">
                  <td className="px-4 py-3">
                    <p className="font-medium text-dark-400">{user.fullName}</p>
                    <p className="text-xs text-light-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-dark-200">
                    {user.createdAt
                      ? dayjs(user.createdAt).format("MMM DD, YYYY")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-dark-200">{user.universityId}</td>
                  <td className="px-4 py-3">
                    <AccountRequestActions userId={user.id} />
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

export default AccountRequestsPage;

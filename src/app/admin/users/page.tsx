import { desc } from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import UserRowActions from "@/components/admin/UserRowActions";

const UsersPage = async () => {
  let allUsers: Array<typeof users.$inferSelect> = [];

  try {
    if (process.env.DATABASE_URL) {
      allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    }
  } catch {
    allUsers = [];
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold text-dark-400">All Users</h1>

      <div className="mt-6 overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-light-300 text-light-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Date Joined</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">University ID</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-light-500">
                  No users found. Connect your database and seed data.
                </td>
              </tr>
            ) : (
              allUsers.map((user) => (
                <tr key={user.id} className="border-t border-admin-border">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-dark-400">{user.fullName}</p>
                      <p className="text-xs text-light-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-dark-200">
                    {user.createdAt
                      ? dayjs(user.createdAt).format("MMM DD, YYYY")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-blue-light text-blue"
                          : "bg-light-300 text-dark-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "APPROVED"
                          ? "bg-green-light text-green"
                          : user.status === "REJECTED"
                            ? "bg-red-light text-red"
                            : "bg-light-300 text-dark-200"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-200">{user.universityId}</td>
                  <td className="px-4 py-3">
                    <UserRowActions
                      userId={user.id}
                      role={user.role || "USER"}
                    />
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

export default UsersPage;

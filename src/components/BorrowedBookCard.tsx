import Image from "next/image";
import dayjs from "dayjs";
import { Book } from "@/types";

interface BorrowedBookCardProps {
  book: Book;
  borrowDate: string | Date;
  dueDate: string;
  status: string;
}

const BorrowedBookCard = ({
  book,
  borrowDate,
  dueDate,
  status,
}: BorrowedBookCardProps) => {
  const isOverdue =
    status === "BORROWED" && dayjs(dueDate).isBefore(dayjs(), "day");

  return (
    <div
      className="w-full max-w-[280px] rounded-2xl p-5"
      style={{ backgroundColor: book.coverColor }}
    >
      <div className="flex justify-center rounded-xl bg-dark-500/20 p-4">
        <Image
          src={book.coverUrl}
          alt={book.title}
          width={140}
          height={200}
          className="rounded-sm object-cover"
        />
      </div>
      <div className="mt-4 space-y-2 text-white">
        <p className="line-clamp-1 text-lg font-semibold">{book.title}</p>
        <p className="line-clamp-1 text-sm opacity-80">{book.genre}</p>
        <div className="flex items-center gap-2 text-sm">
          <Image src="/icons/book-2.svg" alt="book" width={16} height={16} />
          <span>Borrowed on {dayjs(borrowDate).format("MMM DD")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Image
            src={isOverdue ? "/icons/warning.svg" : "/icons/calendar.svg"}
            alt="due"
            width={16}
            height={16}
          />
          <span className={isOverdue ? "text-red" : ""}>
            {isOverdue
              ? "Overdue Return"
              : status === "RETURNED"
                ? `Returned ${dayjs(dueDate).format("MMM DD")}`
                : `${dayjs(dueDate).diff(dayjs(), "day")} days left to return`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BorrowedBookCard;

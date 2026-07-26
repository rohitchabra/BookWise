"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Book } from "@/types";
import { borrowBook } from "@/lib/actions/book";

interface BookOverviewProps {
  book: Book;
  userId: string;
  userStatus?: string;
}

const BookOverview = ({ book, userId, userStatus }: BookOverviewProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [borrowing, setBorrowing] = useState(false);

  const handleBorrow = () => {
    if (userStatus !== "APPROVED") {
      toast.error(
        "Your account is pending approval. You cannot borrow books yet.",
      );
      return;
    }

    if (book.availableCopies <= 0) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setBorrowing(true);
    startTransition(async () => {
      const result = await borrowBook({ bookId: book.id, userId });
      setBorrowing(false);

      if (result.success) {
        toast.success("Book borrowed successfully!");
        router.push("/my-profile");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to borrow book.");
      }
    });
  };

  return (
    <section className="book-overview animate-fade-up">
      <div className="flex flex-1 flex-col gap-5">
        <h1 className="book-title">{book.title}</h1>

        <div className="book-info space-y-2 text-xl text-light-100">
          <p>
            By{" "}
            <span className="font-semibold text-light-200">{book.author}</span>
          </p>
          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{book.genre}</span>
          </p>
          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p className="text-light-100">{book.rating}</p>
          </div>
        </div>

        <div className="book-copies mt-1 space-y-1 text-xl text-light-100">
          <p>
            Total Books: <span className="font-semibold text-light-200">{book.totalCopies}</span>
          </p>
          <p>
            Available Books:{" "}
            <span className="font-semibold text-light-200">
              {book.availableCopies}
            </span>
          </p>
        </div>

        <p className="book-description mt-2 max-w-2xl text-justify text-xl text-light-100">
          {book.description}
        </p>

        <button
          onClick={handleBorrow}
          disabled={isPending || borrowing || book.availableCopies <= 0}
          className="form-btn mt-2 max-w-xs gap-2"
        >
          <Image src="/icons/book.svg" alt="book" width={20} height={20} />
          <span>
            {book.availableCopies > 0 ? "Borrow Book" : "Unavailable"}
          </span>
        </button>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={280}
            height={420}
            className="relative z-10 rounded-sm object-cover shadow-2xl"
            priority
          />
          <div
            className="absolute left-16 top-10 h-full w-full rotate-12 rounded-sm opacity-40 blur-sm"
            style={{ backgroundColor: book.coverColor }}
          />
        </div>
      </div>
    </section>
  );
};

export default BookOverview;

"use server";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import type { ActionResult, BookParams, BorrowBookParams } from "@/types";

export async function createBook(
  params: BookParams,
): Promise<ActionResult<{ bookId: string }>> {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: { bookId: newBook[0].id },
    };
  } catch {
    return {
      success: false,
      error: "Failed to create book. Please try again.",
    };
  }
}

export async function updateBook(
  id: string,
  params: BookParams,
): Promise<ActionResult<{ bookId: string }>> {
  try {
    const existing = await db
      .select()
      .from(books)
      .where(eq(books.id, id))
      .limit(1);

    if (!existing.length) {
      return { success: false, error: "Book not found." };
    }

    const borrowed =
      existing[0].totalCopies - existing[0].availableCopies;
    const availableCopies = Math.max(params.totalCopies - borrowed, 0);

    await db
      .update(books)
      .set({
        ...params,
        availableCopies,
      })
      .where(eq(books.id, id));

    return { success: true, data: { bookId: id } };
  } catch {
    return {
      success: false,
      error: "Failed to update book. Please try again.",
    };
  }
}

export async function borrowBook(
  params: BorrowBookParams,
): Promise<ActionResult<{ borrowId: string }>> {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return { success: false, error: "Book is not available for borrowing." };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db
      .insert(borrowRecords)
      .values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      })
      .returning();

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: { borrowId: record[0].id },
    };
  } catch {
    return {
      success: false,
      error: "Failed to borrow book. Please try again.",
    };
  }
}

export async function returnBook(
  borrowId: string,
  bookId: string,
): Promise<ActionResult> {
  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length) {
      return { success: false, error: "Book not found." };
    }

    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: dayjs().format("YYYY-MM-DD"),
      })
      .where(eq(borrowRecords.id, borrowId));

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies + 1 })
      .where(eq(books.id, bookId));

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to return book. Please try again.",
    };
  }
}

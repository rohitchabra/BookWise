"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { bookSchema, BookValues } from "@/lib/validations";
import { createBook, updateBook } from "@/lib/actions/book";
import FileUpload from "@/components/FileUpload";
import { Book } from "@/types";

interface BookFormProps {
  type?: "create" | "update";
  book?: Book;
}

const BookForm = ({ type = "create", book }: BookFormProps) => {
  const router = useRouter();
  const form = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      genre: book?.genre || "",
      rating: book?.rating || 1,
      totalCopies: book?.totalCopies || 1,
      coverUrl: book?.coverUrl || "",
      coverColor: book?.coverColor || "#1c1f40",
      description: book?.description || "",
      videoUrl: book?.videoUrl || "",
      summary: book?.summary || "",
    },
  });

  const onSubmit = async (values: BookValues) => {
    const result =
      type === "update" && book
        ? await updateBook(book.id, values)
        : await createBook(values);

    if (result.success) {
      toast.success(type === "update" ? "Book updated" : "Book created");
      router.push(`/admin/books`);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const fields: Array<{
    name: keyof BookValues;
    label: string;
    as?: "textarea" | "input";
    type?: string;
  }> = [
    { name: "title", label: "Book Title" },
    { name: "author", label: "Author" },
    { name: "genre", label: "Genre" },
    { name: "rating", label: "Rating", type: "number" },
    { name: "totalCopies", label: "Total Copies", type: "number" },
    { name: "coverColor", label: "Book Color", type: "color" },
    { name: "description", label: "Book Description", as: "textarea" },
    { name: "summary", label: "Book Summary", as: "textarea" },
  ];

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex max-w-2xl flex-col gap-5"
    >
      {fields.map((field) => (
        <div key={field.name}>
          <label className="mb-2 block text-sm font-semibold text-dark-400">
            {field.label}
          </label>
          {field.as === "textarea" ? (
            <textarea
              rows={4}
              {...form.register(field.name)}
              className="w-full rounded-md border border-admin-border bg-light-300 px-4 py-3 text-dark-400 outline-none focus:ring-2 focus:ring-blue"
            />
          ) : (
            <input
              type={field.type || "text"}
              {...form.register(field.name, {
                valueAsNumber: field.type === "number",
              })}
              className="w-full rounded-md border border-admin-border bg-light-300 px-4 py-3 text-dark-400 outline-none focus:ring-2 focus:ring-blue"
            />
          )}
          {form.formState.errors[field.name] && (
            <p className="mt-1 text-sm text-red">
              {form.formState.errors[field.name]?.message}
            </p>
          )}
        </div>
      ))}

      <div>
        <label className="mb-2 block text-sm font-semibold text-dark-400">
          Book Image
        </label>
        <FileUpload
          type="image"
          accept="image/*"
          placeholder="Upload book cover"
          folder="books/covers"
          variant="light"
          value={form.watch("coverUrl")}
          onFileChange={(path) => form.setValue("coverUrl", path)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-dark-400">
          Book Trailer
        </label>
        <FileUpload
          type="video"
          accept="video/*"
          placeholder="Upload book trailer"
          folder="books/videos"
          variant="light"
          value={form.watch("videoUrl")}
          onFileChange={(path) => form.setValue("videoUrl", path)}
        />
        <input
          type="url"
          placeholder="Or paste a video URL (YouTube embed)"
          className="mt-2 w-full rounded-md border border-admin-border bg-light-300 px-4 py-3 text-dark-400 outline-none focus:ring-2 focus:ring-blue"
          value={form.watch("videoUrl")}
          onChange={(e) => form.setValue("videoUrl", e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-blue px-6 font-semibold text-white transition hover:bg-blue/90 disabled:opacity-60"
      >
        {form.formState.isSubmitting
          ? "Saving..."
          : type === "update"
            ? "Update Book"
            : "Create Book"}
      </button>
    </form>
  );
};

export default BookForm;

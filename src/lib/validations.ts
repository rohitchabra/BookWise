import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Enter a valid email address"),
  universityId: z.number().int().positive("Enter a valid university ID"),
  universityCard: z.string().nonempty("University card is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const bookSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(100),
  description: z.string().trim().min(10, "Description is required").max(1000),
  author: z.string().trim().min(2, "Author is required").max(100),
  genre: z.string().trim().min(2, "Genre is required").max(50),
  rating: z.number().min(1).max(5),
  totalCopies: z.number().int().positive().lte(10000),
  coverUrl: z.string().nonempty("Cover image is required"),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i, "Enter a valid hex color"),
  videoUrl: z.string().nonempty("Trailer video is required"),
  summary: z.string().trim().min(10, "Summary is required"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;
export type BookValues = z.infer<typeof bookSchema>;

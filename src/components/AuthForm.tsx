"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "@/components/FileUpload";
import type { ActionResult } from "@/types";

interface AuthFormProps<T extends FieldValues> {
  type: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResult>;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN";

  const form = useForm<T>({
    resolver: zodResolver(schema as never),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      toast.success(
        isSignIn
          ? "Signed in successfully!"
          : "Account created! Waiting for admin approval.",
      );
      router.push("/");
      router.refresh();
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="auth-form mt-4"
      >
        {Object.keys(defaultValues).map((field) => (
          <div key={field} className="flex flex-col gap-1">
            <label htmlFor={field} className="form-label">
              {FIELD_NAMES[field as keyof typeof FIELD_NAMES]}
            </label>

            {field === "universityCard" ? (
              <FileUpload
                type="image"
                accept="image/*"
                placeholder="Upload your ID"
                folder="ids"
                variant="dark"
                onFileChange={(filePath) =>
                  form.setValue(field as Path<T>, filePath as never)
                }
              />
            ) : (
              <input
                id={field}
                type={
                  FIELD_TYPES[field as keyof typeof FIELD_TYPES] || "text"
                }
                {...form.register(field as Path<T>, {
                  valueAsNumber:
                    FIELD_TYPES[field as keyof typeof FIELD_TYPES] === "number",
                })}
                className="form-input"
              />
            )}

            {form.formState.errors[field as Path<T>] && (
              <p className="text-sm text-red">
                {
                  (
                    form.formState.errors[field as Path<T>] as {
                      message?: string;
                    }
                  )?.message
                }
              </p>
            )}
          </div>
        ))}

        <button type="submit" className="form-btn" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Please wait..."
            : isSignIn
              ? "Sign In"
              : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;

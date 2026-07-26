"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Image from "next/image";

const SearchInput = ({ initialQuery = "" }: { initialQuery?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("query", value.trim());
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.push(`/search?${params.toString()}`);
    });
  };

  return (
    <div className="relative mx-auto mt-10 w-full max-w-xl">
      <Image
        src="/icons/search-fill.svg"
        alt="search"
        width={24}
        height={24}
        className="absolute left-4 top-1/2 -translate-y-1/2"
      />
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search for books by title, author, or genre..."
        className="w-full rounded-xl border-0 bg-dark-300 py-4 pl-14 pr-4 text-base text-white outline-none ring-1 ring-inset ring-dark-100 focus:ring-2 focus:ring-primary"
      />
      {isPending && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-light-100">
          Searching...
        </span>
      )}
    </div>
  );
};

export default SearchInput;

import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  className?: string;
}

const BookCard = ({ book, className }: BookCardProps) => {
  return (
    <li className={cn("animate-float-in", className)}>
      <Link href={`/books/${book.id}`} className="group block w-[140px] xs:w-[160px]">
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-sm shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
          style={{ backgroundColor: book.coverColor }}
        >
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
        <div className="mt-3">
          <p className="line-clamp-1 text-sm font-semibold text-white xs:text-base">
            {book.title}
          </p>
          <p className="mt-1 line-clamp-1 text-xs font-light text-light-100 xs:text-sm">
            {book.genre}
          </p>
        </div>
      </Link>
    </li>
  );
};

export default BookCard;

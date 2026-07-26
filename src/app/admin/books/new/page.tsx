import BookForm from "@/components/admin/BookForm";

const NewBookPage = () => {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold text-dark-400">
        Create a New Book
      </h1>
      <BookForm type="create" />
    </section>
  );
};

export default NewBookPage;

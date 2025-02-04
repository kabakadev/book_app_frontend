const BookInfo = ({ book }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      <img
        src={book.image_url || "/placeholder.svg"}
        alt={book.title}
        className="max-w-[300px] h-auto rounded-lg shadow-md"
      />
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-primary mb-2">{book.title}</h1>
        <h2 className="text-2xl text-accent mb-2">{book.author}</h2>
        <p className="text-text-secondary mb-2">{book.genre}</p>
        <p className="text-text-secondary mb-2">{book.publication_year}</p>
        <p className="text-text-secondary">{book.page_count} pages</p>
      </div>
    </div>
  );
};

export default BookInfo;

import { Book, Edit, Trash2 } from "lucide-react";

const ReadingListGrid = ({ readingList, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {readingList.map((list) => (
        <div
          key={list.id}
          className="bg-card rounded-lg p-6 flex flex-col h-full"
        >
          <h2 className="text-xl font-bold text-primary mb-2">{list.name}</h2>
          <p className="text-text-secondary mb-2 flex items-center">
            <Book size={16} className="mr-2" />
            {list.books?.length || 0} books
          </p>
          <ul className="list-none p-0 mb-4">
            {list.books?.slice(0, 3).map((book) => (
              <li key={book.id} className="text-text-secondary">
                {book.title}
              </li>
            ))}
          </ul>
          {list.books?.length > 3 && (
            <p className="text-text-secondary">
              ...and {list.books.length - 3} more
            </p>
          )}
          <div className="mt-auto flex justify-end">
            <button
              className="bg-transparent border-none cursor-pointer p-2 text-secondary transition-colors duration-300 hover:text-primary"
              onClick={() => onEdit(list)}
            >
              <Edit size={18} />
            </button>
            <button
              className="bg-transparent border-none cursor-pointer p-2 text-accent transition-colors duration-300 hover:text-primary"
              onClick={() => onDelete(list.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadingListGrid;

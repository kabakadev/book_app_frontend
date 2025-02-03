import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditListDialog = ({ list, availableBooks, onClose, onUpdate }) => {
  const [newListName, setNewListName] = useState(list.name);
  const [selectedBookIds, setSelectedBookIds] = useState(list.book_ids || []);

  useEffect(() => {
    setNewListName(list.name);
    setSelectedBookIds(list.book_ids || []);
  }, [list]);

  const handleUpdate = () => {
    if (!newListName.trim()) {
      toast.error("Reading list name cannot be empty.");
      return;
    }

    if (selectedBookIds.length === 0) {
      toast.error("Please select at least one book.");
      return;
    }
    onUpdate(list.id, newListName, selectedBookIds);
  };

  const toggleBookSelection = (bookId) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter((id) => id !== bookId));
    } else {
      setSelectedBookIds([...selectedBookIds, bookId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Edit Reading List
        </h2>
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="List Name"
          className="w-full p-2 mb-4 bg-background border border-secondary rounded text-text-primary text-base"
        />
        <h3 className="text-xl font-bold text-primary mt-4 mb-2">
          Select Books:
        </h3>
        <div className="max-h-48 overflow-y-auto mb-4">
          {availableBooks.map((book) => (
            <div key={book.id} className="mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBookIds.includes(book.id)}
                  onChange={() => toggleBookSelection(book.id)}
                  className="mr-2"
                />
                <span className="text-text-secondary">
                  {book.title} - {book.author}
                </span>
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-card text-text-primary border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 hover:bg-opacity-80"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 hover:bg-opacity-80"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListDialog;

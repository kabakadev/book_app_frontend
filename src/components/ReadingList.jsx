import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { Book, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReadingList = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [readingList, setReadingLists] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [selectedBookIds, setSelectedBookIds] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (user && user.id) {
      fetchReadingLists();
    }
  }, [isAuthenticated, loading, navigate, user]);

  useEffect(() => {
    fetch(`${API_URL}/books`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setAvailableBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const fetchReadingLists = () => {
    fetch(`${API_URL}/reading-lists?user_id=${user.id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setReadingLists(data);
        setIsFetching(false);
      })
      .catch((error) => {
        console.error("Error fetching reading lists:", error);
        setIsFetching(false);
      });
  };

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error("List name cannot be empty.");
      return;
    }
    if (selectedBooks.length === 0) {
      toast.error("You must select at least one book.");
      return;
    }
    fetch(`${API_URL}/reading-lists?user_id=${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: newListName,
        user_id: user.id,
        book_ids: selectedBooks,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadingLists((prevLists) => [...prevLists, data]);
        setIsCreateDialogOpen(false);
        setNewListName("");
        setSelectedBooks([]);
        toast.success("List created!");
      })
      .catch((error) => {
        console.error("Error creating reading list:", error);
      });
  };

  const handleUpdateList = () => {
    if (!newListName.trim()) {
      toast.error("Reading list name cannot be empty.");
      return;
    }

    if (selectedBookIds.length === 0) {
      toast.error("Please select at least one book.");
      return;
    }
    fetch(`${API_URL}/reading-lists/${currentList.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: newListName,
        book_ids: selectedBookIds,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setReadingLists(
          readingList.map((list) => (list.id === currentList.id ? data : list))
        );
        setIsEditDialogOpen(false);
        setNewListName("");
        toast.success("List updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating reading list:", error);
      });
  };

  const handleDeleteList = (id) => {
    fetch(`${API_URL}/reading-lists/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setReadingLists(readingList.filter((list) => list.id !== id));
        toast.success("List deleted!");
      })
      .catch((error) => {
        console.error("Error deleting reading list:", error);
      });
  };

  const toggleBookSelection = (bookId) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter((id) => id !== bookId));
    } else {
      setSelectedBookIds([...selectedBookIds, bookId]);
    }
  };

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-12 h-12 border-4 border-card border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-text-primary font-serif">
      <NavBar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">My Reading Lists</h1>
          <button
            className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer flex items-center transition-colors duration-300 hover:bg-opacity-80"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus size={18} className="mr-2" />
            Create New List
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {readingList.map((list) => (
            <div
              key={list.id}
              className="bg-card rounded-lg p-6 flex flex-col h-full"
            >
              <h2 className="text-xl font-bold text-primary mb-2">
                {list.name}
              </h2>
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
                  onClick={() => {
                    setCurrentList(list);
                    setNewListName(list.name);
                    setSelectedBookIds(list.book_ids || []);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit size={18} />
                </button>
                <button
                  className="bg-transparent border-none cursor-pointer p-2 text-accent transition-colors duration-300 hover:text-primary"
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCreateDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-card p-8 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Create New Reading List
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
                        checked={selectedBooks.includes(book.id)}
                        onChange={() => {
                          if (selectedBooks.includes(book.id)) {
                            setSelectedBooks(
                              selectedBooks.filter((id) => id !== book.id)
                            );
                          } else {
                            setSelectedBooks([...selectedBooks, book.id]);
                          }
                        }}
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
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 hover:bg-opacity-80"
                  onClick={handleCreateList}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditDialogOpen && (
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
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-secondary text-background border-none py-2 px-4 text-base font-serif cursor-pointer transition-colors duration-300 hover:bg-opacity-80"
                  onClick={handleUpdateList}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;

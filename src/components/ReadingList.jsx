import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import ReadingListGrid from "../Readinglistlogic/ReadingListGrid.jsx";
import CreateListDialog from "../Readinglistlogic/CreateListDialog.jsx";
import EditListDialog from "../Readinglistlogic/EditListDialog.jsx";
import { toast } from "react-toastify";

const API_URL =
  import.meta.env.VITE_API_URL || "https://book-app-backend-mp22.onrender.com";

const ReadingList = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [readingList, setReadingLists] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentList, setCurrentList] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (user && user.id) {
      fetchReadingLists();
      fetchAvailableBooks();
    }
  }, [isAuthenticated, loading, navigate, user]);

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

  const fetchAvailableBooks = () => {
    fetch(`${API_URL}/books`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setAvailableBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  };

  const handleCreateList = (newListName, selectedBooks) => {
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
        toast.success("List created!");
      })
      .catch((error) => {
        console.error("Error creating reading list:", error);
      });
  };

  const handleUpdateList = (listId, newListName, selectedBookIds) => {
    fetch(`${API_URL}/reading-lists/${listId}`, {
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
          readingList.map((list) => (list.id === listId ? data : list))
        );
        setIsEditDialogOpen(false);
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
            Create New List
          </button>
        </div>

        <ReadingListGrid
          readingList={readingList}
          onEdit={(list) => {
            setCurrentList(list);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteList}
        />

        {isCreateDialogOpen && (
          <CreateListDialog
            availableBooks={availableBooks}
            onClose={() => setIsCreateDialogOpen(false)}
            onCreate={handleCreateList}
          />
        )}

        {isEditDialogOpen && (
          <EditListDialog
            list={currentList}
            availableBooks={availableBooks}
            onClose={() => setIsEditDialogOpen(false)}
            onUpdate={handleUpdateList}
          />
        )}
      </div>
    </div>
  );
};

export default ReadingList;

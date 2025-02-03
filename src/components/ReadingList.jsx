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

  const containerStyle = {
    backgroundColor: "#1a1a1a",
    minHeight: "100vh",
    color: "#e0e0e0",
    fontFamily: "Georgia, serif",
  };

  const contentStyle = {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#c19a6b",
  };

  const buttonStyle = {
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    fontFamily: "Georgia, serif",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background-color 0.3s ease",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#2c2c2c",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  const cardTitleStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "0.5rem",
  };

  const cardTextStyle = {
    color: "#b0bec5",
    marginBottom: "0.5rem",
  };

  const cardActionsStyle = {
    marginTop: "auto",
    display: "flex",
    justifyContent: "flex-end",
  };

  const iconButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    color: "#8f7e4f",
    transition: "color 0.3s ease",
  };

  const modalStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#2c2c2c",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    backgroundColor: "#1a1a1a",
    border: "1px solid #8f7e4f",
    borderRadius: "4px",
    color: "#e0e0e0",
    fontSize: "1rem",
  };

  if (loading || isFetching) {
    return (
      <div
        style={{
          ...containerStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #2c2c2c",
            borderTop: "4px solid #c19a6b",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavBar />
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={headingStyle}>My Reading Lists</h1>
          <button
            style={buttonStyle}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus size={18} style={{ marginRight: "0.5rem" }} />
            Create New List
          </button>
        </div>

        <div style={gridStyle}>
          {readingList.map((list) => (
            <div key={list.id} style={cardStyle}>
              <h2 style={cardTitleStyle}>{list.name}</h2>
              <p style={cardTextStyle}>
                <Book
                  size={16}
                  style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                />
                {list.books?.length || 0} books
              </p>
              <ul
                style={{ listStyle: "none", padding: 0, marginBottom: "1rem" }}
              >
                {list.books?.slice(0, 3).map((book) => (
                  <li key={book.id} style={cardTextStyle}>
                    {book.title}
                  </li>
                ))}
              </ul>
              {list.books?.length > 3 && (
                <p style={cardTextStyle}>...and {list.books.length - 3} more</p>
              )}
              <div style={cardActionsStyle}>
                <button
                  style={iconButtonStyle}
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
                  style={{ ...iconButtonStyle, color: "#d8b384" }}
                  onClick={() => handleDeleteList(list.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isCreateDialogOpen && (
          <div style={modalStyle}>
            <h2
              style={{
                ...headingStyle,
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Create New Reading List
            </h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List Name"
              style={inputStyle}
            />
            <h3 style={{ ...cardTitleStyle, marginTop: "1rem" }}>
              Select Books:
            </h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "1rem",
              }}
            >
              {availableBooks.map((book) => (
                <div key={book.id} style={{ marginBottom: "0.5rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
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
                      style={{ marginRight: "0.5rem" }}
                    />
                    <span style={cardTextStyle}>
                      {book.title} - {book.author}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#2c2c2c",
                  color: "#e0e0e0",
                }}
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </button>
              <button style={buttonStyle} onClick={handleCreateList}>
                Create
              </button>
            </div>
          </div>
        )}

        {isEditDialogOpen && (
          <div style={modalStyle}>
            <h2
              style={{
                ...headingStyle,
                fontSize: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              Edit Reading List
            </h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List Name"
              style={inputStyle}
            />
            <h3 style={{ ...cardTitleStyle, marginTop: "1rem" }}>
              Select Books:
            </h3>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                marginBottom: "1rem",
              }}
            >
              {availableBooks.map((book) => (
                <div key={book.id} style={{ marginBottom: "0.5rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBookIds.includes(book.id)}
                      onChange={() => toggleBookSelection(book.id)}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <span style={cardTextStyle}>
                      {book.title} - {book.author}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "#2c2c2c",
                  color: "#e0e0e0",
                }}
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </button>
              <button style={buttonStyle} onClick={handleUpdateList}>
                Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingList;

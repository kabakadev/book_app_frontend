import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { Book, Edit, Delete, Plus } from "lucide-react";
import NavBar from "./NavBar.jsx";

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else if (user && user.id) {
      fetchReadingLists();
    }
  }, [isAuthenticated, loading, navigate, user]);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/books`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => setAvailableBooks(data))
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  const fetchReadingLists = () => {
    fetch(`http://127.0.0.1:5000/reading-lists?user_id=${user.id}`, {
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
    fetch(`http://127.0.0.1:5000/reading-lists?user_id=${user.id}`, {
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
      })
      .catch((error) => {
        console.error("Error creating reading list:", error);
      });
  };

  const handleUpdateList = () => {
    fetch(`http://127.0.0.1:5000/reading-lists/${currentList.id}`, {
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
      })
      .catch((error) => {
        console.error("Error updating reading list:", error);
      });
  };

  const handleDeleteList = (id) => {
    fetch(`http://127.0.0.1:5000/reading-lists/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        setReadingLists(readingList.filter((list) => list.id !== id));
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
    padding: "2rem",
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
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    backgroundColor: "#2c2c2c",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
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

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    backgroundColor: "#8f7e4f",
    color: "#1a1a1a",
    padding: "0.25rem 0.5rem",
    borderRadius: "16px",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  };

  const bookListStyle = {
    listStyle: "none",
    padding: 0,
    margin: 0,
  };

  const bookItemStyle = {
    marginBottom: "0.5rem",
  };

  const bookTitleStyle = {
    color: "#e0e0e0",
  };

  const bookAuthorStyle = {
    color: "#b0bec5",
    fontSize: "0.875rem",
  };

  const cardActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "auto",
    paddingTop: "1rem",
  };

  const iconButtonStyle = {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0.5rem",
    marginLeft: "0.5rem",
    transition: "color 0.3s ease",
  };

  const dialogStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#2c2c2c",
    padding: "2rem",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "100%",
  };

  const dialogTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#c19a6b",
    marginBottom: "1rem",
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

  const selectStyle = {
    ...inputStyle,
    height: "auto",
    minHeight: "100px",
  };

  const dialogActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
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
      <div style={headerStyle}>
        <h1 style={headingStyle}>My Reading Lists</h1>
        <button onClick={() => setIsCreateDialogOpen(true)} style={buttonStyle}>
          <Plus style={{ marginRight: "0.5rem" }} />
          Create New List
        </button>
      </div>
      <div style={gridStyle}>
        {readingList.map((list) => (
          <div key={list.id} style={cardStyle}>
            <h2 style={cardTitleStyle}>{list.name}</h2>
            <div style={chipStyle}>
              <Book
                style={{ marginRight: "0.5rem", width: "16px", height: "16px" }}
              />
              {list.books?.length || 0} books
            </div>
            <ul style={bookListStyle}>
              {list.books?.slice(0, 3).map((book) => (
                <li key={book.id} style={bookItemStyle}>
                  <div style={bookTitleStyle}>{book.title}</div>
                  <div style={bookAuthorStyle}>{book.author}</div>
                </li>
              ))}
            </ul>
            {list.books?.length > 3 && (
              <p style={{ color: "#b0bec5", fontSize: "0.875rem" }}>
                ...and {list.books.length - 3} more
              </p>
            )}
            <div style={cardActionsStyle}>
              <button
                onClick={() => {
                  setCurrentList(list);
                  setNewListName(list.name);
                  setSelectedBookIds(list.book_ids || []);
                  setIsEditDialogOpen(true);
                }}
                style={{ ...iconButtonStyle, color: "#c19a6b" }}
              >
                <Edit />
              </button>
              <button
                onClick={() => handleDeleteList(list.id)}
                style={{ ...iconButtonStyle, color: "#d8b384" }}
              >
                <Delete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isCreateDialogOpen && (
        <div style={dialogStyle}>
          <h2 style={dialogTitleStyle}>Create New Reading List</h2>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List Name"
            style={inputStyle}
          />
          <select
            multiple
            value={selectedBooks}
            onChange={(e) =>
              setSelectedBooks(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            style={selectStyle}
          >
            {availableBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.title} - {book.author}
              </option>
            ))}
          </select>
          <div style={dialogActionsStyle}>
            <button
              onClick={() => setIsCreateDialogOpen(false)}
              style={{
                ...buttonStyle,
                backgroundColor: "#2c2c2c",
                color: "#e0e0e0",
                marginRight: "1rem",
              }}
            >
              Cancel
            </button>
            <button onClick={handleCreateList} style={buttonStyle}>
              Create
            </button>
          </div>
        </div>
      )}

      {isEditDialogOpen && (
        <div style={dialogStyle}>
          <h2 style={dialogTitleStyle}>Edit Reading List</h2>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List Name"
            style={inputStyle}
          />
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "#c19a6b", marginBottom: "0.5rem" }}>
              Select Books:
            </h3>
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
                  <span
                    style={{
                      color: selectedBookIds.includes(book.id)
                        ? "#c19a6b"
                        : "#e0e0e0",
                    }}
                  >
                    {book.title} by {book.author}
                  </span>
                </label>
              </div>
            ))}
          </div>
          <div style={dialogActionsStyle}>
            <button
              onClick={() => setIsEditDialogOpen(false)}
              style={{
                ...buttonStyle,
                backgroundColor: "#2c2c2c",
                color: "#e0e0e0",
                marginRight: "1rem",
              }}
            >
              Cancel
            </button>
            <button onClick={handleUpdateList} style={buttonStyle}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingList;

import { useUser } from "../context/UserContext.js";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Container,
  Grid,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Book, Edit, Delete, Add } from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

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

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Reading Lists
          </Typography>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Create New List
          </Button>
        </Box>
        <Grid container spacing={3}>
          {readingList.map((list) => (
            <Grid item xs={12} sm={6} md={4} key={list.id}>
              <StyledCard>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div" gutterBottom>
                    {list.name}
                  </Typography>
                  <Chip
                    icon={<Book />}
                    label={`${list.books?.length || 0} books`}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <List dense>
                    {list.books?.slice(0, 3).map((book) => (
                      <ListItem key={book.id}>
                        <ListItemText
                          primary={book.title}
                          secondary={book.author}
                        />
                      </ListItem>
                    ))}
                  </List>
                  {list.books?.length > 3 && (
                    <Typography variant="body2" color="text.secondary">
                      ...and {list.books.length - 3} more
                    </Typography>
                  )}
                </CardContent>
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    onClick={() => {
                      console.log(list);
                      setCurrentList(list);
                      setNewListName(list.name);
                      setSelectedBookIds(list.book_ids || []); //Added this line
                      setIsEditDialogOpen(true);
                    }}
                    color="primary"
                    aria-label="edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteList(list.id)}
                    color="error"
                    aria-label="delete"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <DialogTitle>Create New Reading List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Select Books:
          </Typography>
          <Select
            multiple
            value={selectedBooks}
            onChange={(e) => setSelectedBooks(e.target.value)}
            fullWidth
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={
                      availableBooks.find((book) => book.id === value)?.title
                    }
                  />
                ))}
              </Box>
            )}
          >
            {availableBooks.map((book) => (
              <MenuItem key={book.id} value={book.id}>
                {book.title} - {book.author}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateList}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DialogTitle>Edit Reading List</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="List Name"
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Select Books:
          </Typography>
          <List dense>
            {availableBooks.map((book) => (
              <ListItem
                key={book.id}
                dense
                component="button"
                onClick={() => toggleBookSelection(book.id)}
              >
                <Chip
                  label={`${book.title} by ${book.author}`}
                  color={
                    selectedBookIds.includes(book.id) ? "primary" : "default"
                  }
                  onClick={() => toggleBookSelection(book.id)}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateList}
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReadingList;

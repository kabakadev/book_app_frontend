import { useUser } from '../context/UserContext.js';
import NavBar from './NavBar.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from '@mui/material';

const ReadingList = () => {
    const {user,isAuthenticated, loading } = useUser();
    const navigate = useNavigate();
    const [readingList,setReadingLists] = useState([]);
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
        } else if ( (user && user.id)){
            fetchReadingLists();
        }   
    },[isAuthenticated,loading,navigate]);

    if(!user || !user.id){
        console.error("User Id is missing");
        return;
    }
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/books`, { credentials: "include" })
            .then((response) => response.json())
            .then((data) => setAvailableBooks(data))
            .catch((error) => console.error("Error fetching books:", error));
    }, []);
    const toggleBookSelection = (bookId) => {
        setSelectedBookIds((prevSelected) =>
            prevSelected.includes(bookId)
                ? prevSelected.filter((id) => id !== bookId)
                : [...prevSelected, bookId]
        );
    };

  


    const fetchReadingLists = () => {
        fetch(`http://127.0.0.1:5000/reading-lists?user_id=${user.id}`, {
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            setReadingLists(data);
            console.log("Reading lists fetched:", data);
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
                book_ids: selectedBooks
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            setReadingLists((prevLists) => [...prevLists, data]);
            setIsCreateDialogOpen(false);
            setNewListName("");
            setSelectedBooks([])
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
            //update the reading lists state with the updated list
            setReadingLists(readingList.map((list) => (list.id === currentList.id ? data : list)));
            setIsEditDialogOpen(false); //close the edit dialog
            setNewListName(""); //clear the input field
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
            //remove the deleted list from the readingLists state
            setReadingLists(readingList.filter((list) => list.id !== id));  
       }).catch((error) => {
        console.error("Error deleting reading list:", error);
    });
  }
    return(
        <div className="p-6 bg-gray-400 min-h-screen">
            <NavBar />
            <h1 className="text-3xl font-bold mb-6">Reading List</h1>
            <Button
             onClick={() => setIsCreateDialogOpen(true)}
             variant="contained"
             className='mb-6'>
                Create New List
                </Button>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {readingList.map((list) => {
               console.log("List ID:", list.id);
               return (
                <Card key={list.id} className='flex flex-col h-full'>
                <CardContent className='flex-grow'>
                    <Typography variant='h5' component='div'>
                        {list.name}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {list.books?.length || 0} books
                    </Typography>
                </CardContent>
                <div className='p-4'>
                    <Button
                    onClick={() => {
                        setCurrentList(list);
                        setNewListName(list.name);
                        setIsEditDialogOpen(true);
                    }}
                    variant='contained'
                    className='mr-2'
                    color='primary'>
                        Edit
                    </Button>
                    <Button
                    onClick={() => handleDeleteList(list.id)}
                    variant='contained'
                    color='secondary'>
                        Delete
                    </Button>
                    </div>
                    </Card>
               )
            }
               
            )}
            </div>
            <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
                <DialogTitle>Create New List</DialogTitle>
                <DialogContent>
                    <TextField
                    autoFocus
                    margin='dense'
                    label='List Name'
                    type='text'
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    fullWidth
                    />
                    <Select multiple value={selectedBooks} onChange={(e) => setSelectedBooks(e.target.value)} fullWidth>
                        {availableBooks.map((book) => (
                            <MenuItem key={book.id} value={book.id}>{book.title} - {book.author}</MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateList} color='primary'>Create</Button>
                </DialogActions>

                </Dialog>
                <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
                    <DialogTitle>Edit Reading List</DialogTitle>
                    {availableBooks.map((book) => ( 
                      <div key={book.id}>
                        <input
                        type='checkbox'
                        checked={selectedBookIds.includes(book.id)}  
                        onChange={()=> toggleBookSelection(book.id)}  
                        />{book.title} by {book.author}
                        </div>
                    ))
                    }
                    <DialogContent>
                        <TextField
                        autoFocus
                        margin='dense'
                        label='List Name'
                        type='text'
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateList} color='primary'>Update</Button>
                    </DialogActions>  
                </Dialog>
        </div>
    
    
    );
  
} 

export default ReadingList

import { useUser } from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {Card, CardContent, Typography, Button,TextField, Dialog,DialogActions,DialogContent, DialogTitle} from '@mui/material';

const ReadingList = () => {
    const {user,isAuthenticated, loading } = useUser();
    const navigate = useNavigate();
    const [readingList,setReadingLists] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [newListName, setNewListName] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentList, setCurrentList] = useState(null);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        } else {
            fetchReadingLists();
        }
    },[isAuthenticated,loading,navigate]);

    if(!user || !user.id){
        console.error("User Id is missing");
        return;
    }

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


}
export default ReadingList
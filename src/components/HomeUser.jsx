import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Card, CardContent, CardMedia, Typography, Button,Grid} from '@mui/material'

const HomeUser = () => {
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();
    const [books,setBooks] = useState([]);
    const [isFetching, setIsFetching] = useState(true); 

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        } else {
            fetch("http:///127.0.0.1:5000/books",{
                credentials: "include",
            })
            .then((response) => response.json())
            .then((data) => {
                setBooks(data.books);
                setIsFetching(false);
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
                setIsFetching(false);
            });
        }
    }, [isAuthenticated, loading, navigate]);
    if (loading || isFetching) {
        return <p>Loading...</p>
    }
    if (!isAuthenticated) return null;
    

}

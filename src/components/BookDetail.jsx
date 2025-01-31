import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Grid } from '@mui/material';

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book,setBook] = useState(null);
    const [review,setReviews] = useState("");

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/books/${id}`, {
            credentials: "include",
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            setBook(data);
            setReviews(data.reviews || []);
        })
        .catch((error) => {
            console.error("Error fetching book details:", error);
        });
    },[id]);
    
}
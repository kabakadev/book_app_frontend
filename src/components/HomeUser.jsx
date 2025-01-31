import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Card, CardContent, CardMedia, Typography, Button,Grid} from '@mui/material'
import NavBar from './NavBar.jsx'
const HomeUser = () => {
    const { user, isAuthenticated, loading } = useUser();
    const navigate = useNavigate();
    const [books,setBooks] = useState([]);
    const [isFetching, setIsFetching] = useState(true); 
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        } else {
            fetch("http:///127.0.0.1:5000/books",{
                credentials: "include",
            })
            .then((response) => response.json())
            .then((data) => {
                setBooks(data);
                console.log("Books fetched:", data);
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

    const filteredBooks = books.filter((book) => 
    
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="p-6 bg-gray-400 min-h-screen">
            <NavBar />
            <h1 className="text-3xl font-bold mb-6">Home</h1>

            <div className="mb-8">
                <input type="text" placeholder="Search..." className="w-full p-2 border rounded" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Grid container spacing={4}>
                {filteredBooks.map((book) => (
                    <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                        <Card className="h-full flex flex-col">
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.image_url}
                                alt={book.title}
                                />
                            <CardContent className="flex-grow">
                                <Typography gutterBottom variant="h5" component="div">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.author} ({book.publication_year})
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.genre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {book.pages_count} pages 
                                </Typography>
                                </CardContent>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate(`/books/${book.id}`)}
                                    >
                                    View Details
                                </Button>
                        </Card>
                        </Grid>
                ))}
            </Grid>    
                <div className="mt-8 text-center">
                    <Button variant="outlined" color="primary">
                        Load More
                    </Button>

                </div>
        </div>
    )


}
export default HomeUser
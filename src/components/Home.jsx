import {useState, useEffect} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Card,
    CardContent,
    Rating,
    Container,
    Grid,
    Box,
    IconButton,
    useMediaQuery,
  } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { LibraryBooks, RateReview, Bookmark, Recommend, DarkMode, LightMode } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

//define theme
// Define themes
const getTheme = (mode) =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: mode === "dark" ? "#8f7e4f" : "#5c4d32", // Warm brown
        },
        secondary: {
          main: mode === "dark" ? "#c19a6b" : "#9c7a4a", // Muted gold
        },
        background: {
          default: mode === "dark" ? "#1a1a1a" : "#f8f5e4", // Dark charcoal / Light parchment
          paper: mode === "dark" ? "#2c2c2c" : "#ffffff",
        },
        text: {
          primary: mode === "dark" ? "#e0e0e0" : "#333333",
          secondary: mode === "dark" ? "#b0bec5" : "#666666",
        },
      },
      typography: {
        fontFamily: "'Merriweather', serif",
        h1: {
          fontFamily: "'Playfair Display', serif",
        },
        h2: {
          fontFamily: "'Playfair Display', serif",
        },
        h3: {
          fontFamily: "'Playfair Display', serif",
        },
        h4: {
          fontFamily: "'Playfair Display', serif",
        },
        h5: {
          fontFamily: "'Playfair Display', serif",
        },
        h6: {
          fontFamily: "'Playfair Display', serif",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              textTransform: "none",
              fontWeight: 600,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              boxShadow: mode === "dark" ? "0 4px 6px rgba(255, 255, 255, 0.1)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          },
        },
      },
    })

const Home = () => {
  const [reviews, setReviews] = useState([])
  const [darkMode, setDarkMode] = useState(false) /
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const navigate = useNavigate();

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);
  const theme = getTheme(darkMode ? "dark" : "light")
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", fontSize: "1.5rem" }}>
              BookNook
            </Typography>
            <IconButton onClick={() => setDarkMode((prev) => !prev)} color="inherit">
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button color="inherit" variant="outlined" sx={{ ml: 2 }} onClick={() => navigate("/login")}>
              Login
            </Button>
          </Toolbar>
        </AppBar>

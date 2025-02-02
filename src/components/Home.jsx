import { useState, useEffect } from "react";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LibraryBooks,
  RateReview,
  Bookmark,
  Recommend,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
            boxShadow:
              mode === "dark"
                ? "0 4px 6px rgba(255, 255, 255, 0.1)"
                : "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  });

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  useEffect(() => {
    fetch(`${API_URL}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);
  const theme = getTheme(darkMode ? "dark" : "light");
  const shuffledReviews = [...reviews]
    .sort(() => Math.random() - 0.5) // Shuffle array
    .slice(0, 9); // Take first 9 elements
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
              }}
            >
              BookNook
            </Typography>
            <IconButton
              onClick={() => setDarkMode((prev) => !prev)}
              color="inherit"
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
            <Button
              color="inherit"
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ textAlign: "center", py: 12 }}>
          <Typography
            variant="h1"
            gutterBottom
            sx={{ fontSize: { xs: "3rem", md: "4.5rem" }, fontWeight: 700 }}
          >
            Discover Your Next Great Read
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: "text.secondary", mb: 6, fontWeight: 400 }}
          >
            Explore, review, and connect with a community of book lovers.
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            sx={{ py: 1.5, px: 4 }}
            onClick={() => navigate("/signup")}
          >
            Start Your Journey
          </Button>
        </Container>
        <Box sx={{ bgcolor: "background.paper", py: 10 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Feature
                icon={<LibraryBooks fontSize="large" color="primary" />}
                title="Curated Collections"
                description="Discover handpicked book selections across various genres."
              />
              <Feature
                icon={<RateReview fontSize="large" color="primary" />}
                title="Thoughtful Reviews"
                description="Share your insights and read authentic opinions from fellow readers."
              />
              <Feature
                icon={<Bookmark fontSize="large" color="primary" />}
                title="Personal Bookshelf"
                description="Organize your reading list and track your literary journey."
              />
              <Feature
                icon={<Recommend fontSize="large" color="primary" />}
                title="Smart Recommendations"
                description="Get personalized book suggestions based on your reading preferences."
              />
            </Grid>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textAlign: "center", mb: 6 }}
          >
            Reader Insights
          </Typography>
          <Grid container spacing={4}>
            {shuffledReviews.map((review, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom>
                      {review.book.title}
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 2 }}>
                      by {review.book.author}
                    </Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2">
                      "{review.review_text}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Box sx={{ bgcolor: "background.paper", py: 10 }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h3" gutterBottom>
              Join Our Literary Community
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "text.secondary", mb: 4, fontWeight: 400 }}
            >
              Connect with fellow book enthusiasts and embark on countless
              literary adventures.
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{ py: 1.5, px: 4 }}
              onClick={() => navigate("/signup")}
            >
              Sign Up Now
            </Button>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
const Feature = ({ icon, title, description }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Box sx={{ textAlign: "center" }}>
      {icon}
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {description}
      </Typography>
    </Box>
  </Grid>
);

export default Home;

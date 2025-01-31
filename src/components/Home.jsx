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
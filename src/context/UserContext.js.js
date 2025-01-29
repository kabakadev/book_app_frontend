import React, { createContext, useState, useContext, useEffect } from 'react';
const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        fetch('http://127.0.0.1:5000/check-auth', {
            credentials: 'include', 
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAuthenticated) {
                setIsAuthenticated(true);
                fetchUserData(); 
        })
        .catch(error => console.error('Error checking auth:', error));
    }, []);
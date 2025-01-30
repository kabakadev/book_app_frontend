import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BookOpen, List, Star } from "lucide-react"

const Dashboard = () => {
    const { user, isAuthenticated, loading } = useUser()
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [isFetching, setIsFetching] = useState(true)

    useEffect(() => {
        if (!loading && !isAuthenticated) {
          navigate("/login")
        } else if (user && user.id) {
          fetch(`http://127.0.0.1:5000/users/${user.id}`, {
            credentials: "include",
          })
            .then((response) => response.json())
            .then((data) => {
              setUserData(data)
              setIsFetching(false)
            })
            .catch((error) => {
              console.error("Error fetching user data:", error)
              setIsFetching(false)
            })
        }
      }, [isAuthenticated, loading, navigate, user])
      if (loading || isFetching) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )
      }
    
      if (!isAuthenticated) return null 
    
  
}

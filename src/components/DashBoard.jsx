import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BookOpen, List, Star } from "lucide-react"

const Dashboard = () => {
    const { user, isAuthenticated, loading } = useUser()
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [isFetching, setIsFetching] = useState(true)
  
}

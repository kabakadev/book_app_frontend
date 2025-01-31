import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BookOpen, List, Star } from "lucide-react"
import NavBar from "./NavBar.jsx";

const Dashboard = () => {
    const { user, isAuthenticated, loading,logout } = useUser()
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
      const handleLogout = async () => {
        await logout();
        navigate("/login"); // Redirect to login after logout
      };

      
      return(
        <div className="bg-gray-400 min-h-screen">
            <NavBar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome, {user.username}!</h1>
           
            
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            Recent Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.reviews?.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{review.book.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{review.review_text}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? "fill-current" : "stroke-current"}`} />
                      ))}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">{review.rating}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <List className="mr-2 text-blue-500" />
            My Reading Lists
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData?.reading_lists?.map((list) => (
              <div
                key={list.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{list.name}</h3>
                  <ul className="space-y-2">
                    {list.books.map((book) => (
                      <li key={book.id} className="flex items-start">
                        <BookOpen className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-1" />
                        <span className="text-gray-700">
                          {book.book.title} by {book.book.author}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <BookOpen className="mr-2 text-green-500" />
            Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example recommendation */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">You Don't Know JS Yet</h3>
                <div className="flex items-center">
                  <span className="text-yellow-500 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">5/5</span>
                </div>
              </div>
            </div>
          </div>
        </section>  
        </div>
    </div>
        
      )
    
  
}
export default Dashboard

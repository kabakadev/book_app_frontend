import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.js";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { Plus, Search } from "lucide-react";

const HomeUser = () => {
  const { user, isAuthenticated, loading } = useUser();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://book-app-backend-mp22.onrender.com";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    } else {
      fetch(`${API_URL}/books`, {
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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="w-12 h-12 border-4 border-[#2c2c2c] border-t-[#c19a6b] rounded-full animate-spin"></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#1a1a1a] min-h-screen text-[#e0e0e0] font-['Georgia',serif]">
      <NavBar />
      <div className="p-8">
        <h1 className="text-[2.5rem] font-bold text-[#c19a6b] mb-8">Home</h1>

        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-3 pl-10 pr-4 bg-[#2c2c2c] border border-[#8f7e4f] rounded text-[#e0e0e0] text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8f7e4f]"
            size={20}
          />
        </div>

        <button
          className="bg-[#8f7e4f] text-[#1a1a1a] border-none py-2 px-4 text-base font-['Georgia',serif] cursor-pointer flex items-center mb-8"
          onClick={() => navigate("/addbook")}
        >
          <Plus className="mr-2" />
          Add New Book
        </button>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-[#2c2c2c] rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={book.image_url || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-[200px] object-cover"
              />
              <div className="p-4 flex-grow">
                <h2 className="text-[1.2rem] font-bold text-[#c19a6b] mb-2">
                  {book.title}
                </h2>
                <p className="text-[#b0bec5] mb-2">
                  {book.author} ({book.publication_year})
                </p>
                <p className="text-[#b0bec5] mb-2">{book.genre}</p>
                <p className="text-[#b0bec5]">{book.pages_count} pages</p>
              </div>
              <button
                className="bg-[#8f7e4f] text-[#1a1a1a] border-none py-2 w-full text-base font-['Georgia',serif] cursor-pointer"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-transparent border border-[#8f7e4f] text-[#8f7e4f] py-2 px-4 text-base font-['Georgia',serif] cursor-pointer">
            Load More
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;

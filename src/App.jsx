import './App.css'
import Login from './components/Authentication/Login'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext.js'
import Home from './components/Home'
import DashBoard from './components/DashBoard'
import SignUp from './components/Authentication/SignUp.jsx'
import HomeUser from './components/HomeUser.jsx'
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");  // Debugging
      return <Navigate to="/login" />;
  }
  return element;
};

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<ProtectedRoute element={ <DashBoard />} />} />
        <Route path='/home' element={<ProtectedRoute element={ <HomeUser />} />} />
      </Routes>
    </Router>
  )
}

export default App

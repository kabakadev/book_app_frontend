import './App.css'
import Login from './components/Authentication/Login'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import { useUser } from './context/UserContext.js'
import Home from './components/Home'
import DashBoard from './components/DashBoard'
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute element={ <DashBoard />} />} />
      </Routes>
    </Router>
  )
}

export default App

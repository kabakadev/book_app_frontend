
import './App.css'
import Login from './components/Authentication/Login'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Home from './components/Home'
import DashBoard from './components/DashBoard'

function App() {


  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='/dashboard' element={<DashBoard />} />
      </Routes>
    </Router>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Lander from "./pages/Lander";
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Category from "./pages/Category";
import Events from './pages/Events';
import Booking from './pages/Booking';
import Availability from './pages/Availability';
import Settings from './pages/Settings';
import { Toaster } from "react-hot-toast";
import PublicRoutes from './services/ProtectedRoutes/PublicRoutes';
import ProtectedRoutes from './services/ProtectedRoutes/ProtectedRoutes';
import UsernameProtectedRoute from './services/ProtectedRoutes/UsernameProtectedRoute';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoutes>
          <Lander />
          </PublicRoutes>
        } />
        <Route path="/sign-up" element={
          <PublicRoutes>
          <SignUp />
          </PublicRoutes>
        } />
        <Route path='/sign-in' element={
          <PublicRoutes>
          <SignIn />
          </PublicRoutes>
        } />
        <Route path='/category' element={
          <UsernameProtectedRoute>
          <Category />
          </UsernameProtectedRoute>
        } />
        <Route path='/events' element={
          <ProtectedRoutes>
          <Events />
          </ProtectedRoutes>
        } />
        <Route path='/booking' element={
          <ProtectedRoutes>
          <Booking />
          </ProtectedRoutes>
        } />
        <Route path='/availability' element={
          <ProtectedRoutes>
          <Availability />
          </ProtectedRoutes>
        } />
        <Route path='/settings' element={
          <ProtectedRoutes>
          <Settings />
          </ProtectedRoutes>
        } />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

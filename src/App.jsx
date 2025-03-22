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

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Lander />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/category' element={<Category />} />
        <Route path='/events' element={<Events />} />
        <Route path='/booking' element={<Booking />} />
        <Route path='/availability' element={<Availability />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      {/* <Toaster /> */}
    </Router>
  )
}

export default App

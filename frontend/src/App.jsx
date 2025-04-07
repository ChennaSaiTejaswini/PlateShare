import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import CharityDashboard from "./pages/CharityDashboard";
import DonationForm from "./components/DonationForm";
import HomePage from "./pages/HomePage";
import CharityRequest from "./components/CharityRequestForm";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/charity-dashboard" element={<CharityDashboard />} />
        <Route path="/schedule-donation" element={<DonationForm />} />
        <Route path="/charity-request" element={<CharityRequest />} />
      </Routes>
    </Router>
  );
}

export default App;

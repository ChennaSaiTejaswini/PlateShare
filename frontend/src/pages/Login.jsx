import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);
      console.log("Login Response:", res.data); // Log full response
      alert(res.data.message);
      localStorage.setItem("token", res.data.token); // ✅ Important
  
      if (res.data.userType === "donor") {
        console.log("Saving Donor Email:", res.data.donorEmail);
        localStorage.setItem("donorEmail", res.data.donorEmail);
        navigate("/donor-dashboard");
      } else if (res.data.userType === "charity") {
        navigate("/charity-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed!");
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center text-primary mb-3">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          
          <button className="btn btn-success login-btn" type="submit">
            Login
          </button>
          
        </form>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <button className="btn btn-link" onClick={() => navigate("/signup")}>
            Signup here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

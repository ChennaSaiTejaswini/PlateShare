import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import "../styles/Signup.css"; // Importing CSS file

const Signup = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("donor"); // Default: Donor
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    charityName: "",
    registrationNumber: "",
    cause: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://plateshare-backend.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userType }),
      });

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login"); // Redirect to login page
      } else {
        alert("Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="text-center text-primary mb-3">Signup</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Register as:</Form.Label>
            <Form.Select value={userType} onChange={(e) => setUserType(e.target.value)}>
              <option value="donor">Donor</option>
              <option value="charity">Charity</option>
              
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
          </Form.Group>

          {userType === "charity" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Charity Name</Form.Label>
                <Form.Control type="text" name="charityName" value={formData.charityName} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Registration Number</Form.Label>
                <Form.Control type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cause</Form.Label>
                <Form.Control type="text" name="cause" value={formData.cause} onChange={handleChange} required />
              </Form.Group>
            </>
          )}

          <Button variant="primary" type="submit" className="w-100">
            Signup
          </Button>
        </Form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
            Login here
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Signup;

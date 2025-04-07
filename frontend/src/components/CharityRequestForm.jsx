import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";

const CharityRequestForm = () => {
  const [requestData, setRequestData] = useState({
    charityName: "",
    charityEmail: "",
    requestedFoodType: "",
    quantity: "",
    urgency: "",
  });

  const handleChange = (e) => {
    setRequestData({ ...requestData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/food-requests", requestData);
      alert("Food request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5">Request Food Donation</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Charity Name" name="charityName" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Email" name="charityEmail" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Food Type" name="requestedFoodType" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Quantity (kg)" name="quantity" type="number" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="Urgency" name="urgency" fullWidth margin="normal" required onChange={handleChange} />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Request
        </Button>
      </form>
    </Container>
  );
};

export default CharityRequestForm;

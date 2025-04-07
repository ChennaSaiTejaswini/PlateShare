import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/DonorDashboard.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import ScaleIcon from '@mui/icons-material/Scale'; // Quantity Icon
import { CheckCircle } from "@mui/icons-material";
const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
 
  const navigate = useNavigate();
  
  


  useEffect(() => {
    const donorEmail = localStorage.getItem("donorEmail"); // Ensure email is retrieved
  
    if (!donorEmail) {
      console.error("No donor email found.");
      return;
    }
  
    const fetchDonations = async () => {
      try {
        console.log("Fetching donations for donor:", donorEmail);
        const response = await axios.get(`https://plateshare-backend.onrender.com/api/donations-by-donor?email=${donorEmail}`);
  
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };
  
    fetchDonations();
    if (location.state?.refresh) {
      fetchDonations();
      navigate("/donor-dashboard", { replace: true, state: {} }); // Clear refresh flag
    }
  }, [location.state]); // Dependency array is empty, ensuring it only runs once
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircleIcon className="status-icon completed" />;
      case 'Pending':
        return <PendingActionsIcon className="status-icon pending" />;
      case 'Cancelled':
        return <CancelIcon className="status-icon cancelled" />;
      case "Collected":
        return <CheckCircle color="success" />;  
      default:
        return null;
    }
  };

 
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <Typography variant="h3" className="dashboard-title">
          Donor Dashboard
        </Typography>
      </header>

      <div className="dashboard-content">
        <Button 
          className="donation-button" 
          onClick={() => navigate("/schedule-donation")} 
          startIcon={<AddCircleOutlineIcon className="add-icon" />}
        >
          Schedule a Donation
        </Button>

        {/* ✅ Past Donations Section (Unchanged) */}
        <Typography variant="h4" className="section-title">
          <HistoryIcon className="section-icon" /> Past Donations
        </Typography>

        {donations.length === 0 ? (
          <Typography className="no-donations">No donations made yet.</Typography>
        ) : (
          <Grid container spacing={3} className="donations-grid">
            {donations.map((donation, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card className="donation-card">
                  <CardContent>
                    <Typography>
                      <LocalDiningIcon className="icon" style={{ color: "#d32f2f", verticalAlign: 'middle', marginRight: '5px' }}/> 
                      <strong>Food Type:</strong> {donation.foodType}
                    </Typography>
                    <Typography>
                      <ScaleIcon className="icon" style={{ color: "#1976d2", verticalAlign: 'middle', marginRight: '5px' }}/> 
                      <strong>Meals Provided:</strong> {donation.quantity} people
                    </Typography>
                    <Typography>
                      {getStatusIcon(donation.status)} <strong>Status:</strong> {donation.status}
                    </Typography>
                    <Typography>
                      <LocationOnIcon className="icon" style={{ color: "#9c27b0", verticalAlign: 'middle', marginRight: '5px' }} /> 
                      <strong>Pickup Location:</strong> {donation.pickupLocation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        
      </div>
    </div>
  );
};

export default DonorDashboard;

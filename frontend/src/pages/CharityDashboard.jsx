import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, Typography, Card, CardContent, Button, Box, Grid, Paper, Divider
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CheckCircle, LocationOn } from "@mui/icons-material";
import bgImage from '../images/charity_pg.png';

const CharityDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [view, setView] = useState("Pending");

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/donations");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };
    fetchDonations();
  }, []);

  const acceptDonation = async (donationId) => {
    try {
      await axios.put(`http://localhost:5000/api/donations/${donationId}/accept`, { 
        charityEmail: localStorage.getItem("charityEmail") 
      });
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === donationId 
            ? { ...donation, status: "Accepted", acceptedBy: localStorage.getItem("charityEmail") } 
            : donation
        )
      );
      alert("Donation accepted!");
    } catch (error) {
      console.error("Error accepting donation:", error);
    }
  };

  const markAsCollected = async (donationId) => {
    try {
      await axios.put(`http://localhost:5000/api/donations/${donationId}/collect`);
      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === donationId ? { ...donation, status: "Collected" } : donation
        )
      );
      alert("Donation marked as collected!");
    } catch (error) {
      console.error("Error updating donation status:", error);
    }
  };

  const charityEmail = localStorage.getItem("charityEmail");
  const pendingDonations = donations.filter((donation) => donation.status === "Pending");
  const acceptedDonations = donations.filter(
    (donation) => donation.status === "Accepted" && donation.acceptedBy === charityEmail
  );
  const collectedDonations = donations.filter((donation) => donation.status === "Collected");

  return (
    <Container maxWidth={false} sx={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflow: "auto", padding: "20px", position: "relative", background: "lightBlue", backgroundSize: "cover", backgroundPosition: "center", "::before": { content: '""', position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.5)", zIndex: -1 } }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "bold", color: "#2c3e50", mb: 3 }}>
          Charity Dashboard
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box display="flex" justifyContent="center" gap={2} mb={4}>
          <Button variant={view === "Pending" ? "contained" : "outlined"} color="primary" sx={{ fontWeight: "bold", textTransform: "none", px: 3, py: 1 }} onClick={() => setView("Pending")}> View Pending Donations </Button>
          <Button variant={view === "Accepted" ? "contained" : "outlined"} color="secondary" sx={{ fontWeight: "bold", textTransform: "none", px: 3, py: 1 }} onClick={() => setView("Accepted")}> View Accepted Donations </Button>
          <Button variant={view === "Collected" ? "contained" : "outlined"} color="success" sx={{ fontWeight: "bold", textTransform: "none", px: 3, py: 1 }} onClick={() => setView("Collected")}> View Collected Donations </Button>
        </Box>
        <Grid container spacing={3}>
          {(view === "Pending" ? pendingDonations : view === "Accepted" ? acceptedDonations : collectedDonations).map((donation) => (
            <Grid item xs={12} sm={6} md={4} key={donation._id}>
              <Card sx={{ p: 2, background: view === "Pending" ? "#fff3e0" : view === "Accepted" ? "#e8f5e9" : "#d1c4e9", boxShadow: 3, borderRadius: 3, transition: "0.3s", "&:hover": { transform: "scale(1.03)" } }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="#2c3e50"> {donation.foodType} </Typography>
                  <Typography variant="body1">Donor: {donation.donorName}</Typography>
                  <Typography variant="body1">Meals Provided: {donation.quantity} people</Typography>
                  <Typography variant="body1">Location: {donation.pickupLocation}</Typography>
                  <Typography variant="body1">Donor phone no.: {donation.donorPhone}</Typography>
                  <Box mt={2} display="flex" gap={2}>
                    {view === "Pending" && (
                      <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => acceptDonation(donation._id)}> Accept </Button>
                    )}
                    {view === "Accepted" && (
                      <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => markAsCollected(donation._id)}> Mark as Collected </Button>
                    )}
                    <Button variant="outlined" color="info" startIcon={<LocationOn />} onClick={() => setSelectedLocation({ lat: donation.gpsCoordinates?.lat || 20.5937, lon: donation.gpsCoordinates?.lon || 78.9629, address: donation.pickupLocation })}> View Map </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      {selectedLocation && (
        <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: "#f9f9f9", borderRadius: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#37474f" }}> Pickup Location </Typography>
          <MapContainer center={[selectedLocation.lat, selectedLocation.lon]} zoom={13} style={{ height: "350px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[selectedLocation.lat, selectedLocation.lon]}>
              <Popup>{selectedLocation.address}</Popup>
            </Marker>
          </MapContainer>
        </Paper>
      )}
    </Container>
  );
};

export default CharityDashboard;

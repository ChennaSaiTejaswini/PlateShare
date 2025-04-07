import React, { useState, useEffect } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/DonationForm.css";
import { useNavigate } from "react-router-dom";

const DonationForm = () => {
  const navigate = useNavigate();
  const defaultLocation = { lat: 16.5062, lng: 80.6480 }; // Vijayawada
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    foodType: "",
    quantity: "",
    expiryDate: "",
    pickupLocation: "Fetching location...",
    gpsCoordinates: defaultLocation,
  });

  useEffect(() => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              gpsCoordinates: { lat: latitude, lng: longitude },
            }));
            fetchAddress(latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setFormData((prev) => ({
              ...prev,
              pickupLocation: "Location access denied. Enter manually.",
            }));
          }
        );
      }
    });
  }, []);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        pickupLocation: data.display_name || "Address not found",
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting donation with data:", formData); // ✅ Debugging Step
    try {
      await axios.post("https://plateshare-backend.onrender.com/api/donations", formData);
      alert("Your donation has been scheduled successfully!");
    } catch (error) {
      console.error("Error submitting donation:", error);
    }
  };

  const handleCloseForm = () => {
    navigate("/donor-dashboard", { state: { refresh: true } });
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          gpsCoordinates: { lat, lng },
        }));
        fetchAddress(lat, lng);
      },
    });
    return null;
  };

  const MapUpdater = ({ gpsCoordinates }) => {
    const map = useMap();
    useEffect(() => {
      if (gpsCoordinates.lat && gpsCoordinates.lng) {
        map.flyTo([gpsCoordinates.lat, gpsCoordinates.lng], 15);
      }
    }, [gpsCoordinates, map]);

    return null;
  };

  return (
    <div className="donation-form-container">
      <Container maxWidth="sm" className="donation-form">
        <Typography variant="h5" gutterBottom>
          Schedule a Donation
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Donor Name" name="donorName" value={formData.donorName} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Donor Email" name="donorEmail" value={formData.donorEmail} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Donor Phone Number" name="donorPhone" value={formData.donorPhone} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Food Type" name="foodType" value={formData.foodType} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Meals Provided (people)" name="quantity" type="number" value={formData.quantity} onChange={handleChange} fullWidth margin="normal" required />
          <label>Expiry Date:</label>
          <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required />
          <TextField label="Pickup Location" name="pickupLocation" value={formData.pickupLocation} onChange={handleChange} fullWidth margin="normal" required />

          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Select Pickup Location on Map:
          </Typography>
          <MapContainer center={[formData.gpsCoordinates.lat, formData.gpsCoordinates.lng]} zoom={15} className="map-container">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater gpsCoordinates={formData.gpsCoordinates} />
            <LocationPicker />
            <Marker position={[formData.gpsCoordinates.lat, formData.gpsCoordinates.lng]}>
              <Popup>Selected Location</Popup>
            </Marker>
          </MapContainer>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Donation
          </Button>
        </form>
        <Button variant="contained" color="secondary" fullWidth onClick={handleCloseForm} style={{ marginTop: "10px" }}>
          Close Form
        </Button>
      </Container>
    </div>
  );
};

export default DonationForm;

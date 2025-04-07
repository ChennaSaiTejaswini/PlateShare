import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider
} from "@mui/material";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [groupedDonations, setGroupedDonations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchDonations();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get("https://plateshare-backend.onrender.com/api/admin/users", config);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
    }
  };

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.get("http://localhost:5000/api/admin/donations", config);
      setDonations(response.data);
      groupDonationsByUser(response.data);
    } catch (error) {
      console.error("Error fetching donations", error);
      setDonations([]);
    }
  };

  const groupDonationsByUser = (donationList) => {
    const grouped = {};
    donationList.forEach((donation) => {
      const donorName = donation.donorName || "Unknown Donor";
      if (!grouped[donorName]) {
        grouped[donorName] = [];
      }
      grouped[donorName].push(donation);
    });
    setGroupedDonations(grouped);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType ? user.userType === filterType : true;

    return matchesSearch && matchesType;
  });

  const totalUsers = users.length;
  const totalDonations = donations.length;
  const pendingDonations = donations.filter(d => d.status === "Pending").length;
  const acceptedDonations = donations.filter(d => d.status === "Accepted").length;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>🌟 Admin Dashboard</Typography>

      {/* Quick Stats */}
      <Grid container spacing={3} marginBottom={4}>
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Total Donations", value: totalDonations },
          { label: "Pending Donations", value: pendingDonations },
          { label: "Accepted Donations", value: acceptedDonations }
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {stat.label}
                </Typography>
                <Typography variant="h5">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search & Filter */}
      <Grid container spacing={2} marginBottom={4}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Search by name or email"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Filter by User Type"
            variant="outlined"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="donor">Donor</MenuItem>
            <MenuItem value="charity">Charity</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* User List */}
      <Typography variant="h6">👥 Users</Typography>
      {filteredUsers.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <List sx={{ maxHeight: 300, overflow: 'auto', marginBottom: 4 }}>
          {filteredUsers.map(user => (
            <ListItem key={user._id} divider>
              <ListItemText primary={user.name} secondary={`${user.email} - ${user.userType}`} />
            </ListItem>
          ))}
        </List>
      )}

      {/* Donations Grouped by Donor */}
      <Typography variant="h6">🎁 Donations Grouped by Donor</Typography>
      {Object.keys(groupedDonations).length === 0 ? (
        <Typography>No donations found.</Typography>
      ) : (
        Object.entries(groupedDonations).map(([donor, donations]) => (
          <Box key={donor} marginBottom={3}>
            <Typography variant="subtitle1" fontWeight="bold">{donor}</Typography>
            <List dense>
              {donations.map((donation) => (
                <ListItem key={donation._id}>
                  <ListItemText primary={`${donation.foodType} - ${donation.status}`} />
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        ))
      )}
    </Container>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement update profile API call
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile' });
    }
  };

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 20px',
                fontSize: '2.5rem',
                bgcolor: 'primary.main'
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{profile.name}</Typography>
            <Typography color="textSecondary">{profile.email}</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Role: {profile.role.replace('_', ' ')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Member since: {new Date(profile.createdAt).toLocaleDateString()}
              </Typography>
              {profile.lastLogin && (
                <Typography variant="body2" color="textSecondary">
                  Last login: {new Date(profile.lastLogin).toLocaleString()}
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Account Settings</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Change Password" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Notification Settings" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Two-Factor Authentication" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Profile Information</Typography>
              {/* <Button
                variant={editMode ? "outlined" : "contained"}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button> */}
            </Box>

            {message.text && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Full Name
                  </Typography>
                  <Typography variant="body1">{profile.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Email Address
                  </Typography>
                  <Typography variant="body1">{profile.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Role
                  </Typography>
                  <Typography variant="body1" textTransform="capitalize">
                    {profile.role.replace('_', ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Account Status
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color={profile.isActive ? 'success.main' : 'error.main'}
                  >
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <Typography variant="body2" color="textSecondary">
              Activity log will appear here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
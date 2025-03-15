'use client';

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { db } from '../../../../firebase'; // Your Firebase initialization file

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
  { value: 'new-south-wales', label: 'New South Wales' },
  { value: 'victoria', label: 'Victoria' },
  { value: 'queensland', label: 'Queensland' },
  { value: 'western-australia', label: 'Western Australia' },
  { value: 'south-australia', label: 'South Australia' },
  { value: 'tasmania', label: 'Tasmania' },
  { value: 'northern-territory', label: 'Northern Territory' },
  { value: 'australian-capital-territory', label: 'Australian Capital Territory' },
];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function AccountDetailsForm({ userData }) {
  const { name, email: userEmail, phone, state, city } = userData || {};

  const [newPhone, setNewPhone] = React.useState(phone || '');
  const [newState, setNewState] = React.useState(state || '');
  const [newCity, setNewCity] = React.useState(city || '');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [loading, setLoading] = React.useState(false);

  const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
  const email = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;

  const updateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = doc(db, 'users', querySnapshot.docs[0].id);

        await updateDoc(userDocRef, {
          phone: newPhone,
          state: newState,
          city: newCity,
        });

        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
      } else {
        setSnackbarMessage('User not found!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Error updating profile: ' + error.message);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <form onSubmit={updateProfile}>
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Full name</InputLabel>
                  <OutlinedInput value={name || ''} label="Full name" name="fullName" readOnly />
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput value={userEmail || ''} label="Email address" name="email" readOnly />
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Phone number</InputLabel>
                  <OutlinedInput
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    label="Phone number"
                    name="phone"
                    type="tel"
                  />
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    label="State"
                    name="state"
                    variant="outlined"
                  >
                    {states.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <OutlinedInput
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    label="City"
                    name="city"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save details'}
            </Button>
          </CardActions>
        </Card>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Top center position
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

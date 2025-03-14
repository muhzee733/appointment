import React from 'react';
import Link from 'next/link';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

const BookingConfirmed = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card sx={{ maxWidth: 400, textAlign: 'center', p: 3, boxShadow: 3 }}>
        <CardContent>
          <EventAvailableIcon color="primary" sx={{ fontSize: 50 }} />
          <Typography variant="h6" fontWeight="bold" mt={2}>
            You are scheduled
          </Typography>
          <Typography variant="body1" mt={1}>
            A calendar invitation has been sent to your email address.
          </Typography>
          <Typography variant="body2" fontWeight="bold" mt={2}>
            Hamza Naeem
          </Typography>
          <Typography variant="body2">Dubai Time</Typography>
          <Typography variant="body2" mt={1}>
            Web conferencing details to follow.
          </Typography>
          <Box mt={3}>
            <Link href={'/auth/sign-in'}>
              <Button variant="contained" color="primary" sx={{ mr: 1 }}>
                Login with your email
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingConfirmed;

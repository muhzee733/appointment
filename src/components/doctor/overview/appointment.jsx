'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

// Function to check if the appointment is today
function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function Appointment({ sx, appointments }) {
  // Filter appointments for today and with 'active' status
  const todayAppointments = appointments?.filter(({ status, eventDetails }) => {
    const startDate = new Date(eventDetails.startTime); // Assuming startTime is a timestamp
    return isToday(startDate) && status === 'active'; // Only include active appointments today
  }) || [];

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Today Appointments
              </Typography>
              <Typography variant="h6">
                {todayAppointments.length > 0 ? todayAppointments.length : 'No appointments today'}
              </Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
              <CurrencyDollarIcon fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default Appointment;

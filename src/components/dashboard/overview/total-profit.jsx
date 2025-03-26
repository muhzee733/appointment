import React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react/dist/ssr/Receipt';

// Function to format the Firebase timestamp
function formatTimestamp(timestamp) {
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  const date = new Date(milliseconds);
  return date.toLocaleString(); // Full date and time
}

export function TotalProfit({ value, sx, meetings }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

  // Filter meetings for the current month
  const totalAppointmentsThisMonth = meetings?.filter(({ eventDetails }) => {
    const startDate = new Date(formatTimestamp(eventDetails.startTime));
    return startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth;
  }) || [];

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Total Appointments This Month
            </Typography>
            <Typography variant="h4">{totalAppointmentsThisMonth.length}</Typography>
          </Stack>
          <Avatar sx={{ backgroundColor: 'var(--mui-palette-primary-main)', height: '56px', width: '56px' }}>
            <ReceiptIcon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const statusMap = {
  active: { label: 'Active', color: 'success' },
  cancel: { label: 'Cancel', color: 'error' },
  expire: { label: 'Expired', color: 'default' }, // New expire status
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date.toLocaleString();
}

function Appointments({ meetings, loading, error }) {
  // Get the current date and time
  const currentDate = new Date();

  // Update meetings to assign the correct status based on their date
  const updatedMeetings = meetings.map((meeting) => {
    const meetingDate = new Date(meeting.createdAt.seconds * 1000 + meeting.createdAt.nanoseconds / 1000000);
    const status = meetingDate > currentDate ? 'active' : 'expire'; // If the meeting is in the future, it's 'active', otherwise 'expire'
    return { ...meeting, status }; // Add the calculated status to each meeting
  });

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader title="Upcoming Appointments" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                  <Typography color="error">Error loading meetings.</Typography>
                </TableCell>
              </TableRow>
            ) : updatedMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', height: '30vh' }}>
                  <Typography variant="h6" color="text.secondary">
                    No Appointment Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              updatedMeetings.map((meeting) => {
                const { label, color } = statusMap[meeting.status] ?? { label: 'Unknown', color: 'default' };
                const formattedTime = formatTimestamp(meeting.createdAt);

                return (
                  <TableRow hover key={meeting.id}>
                    <TableCell>{meeting.inviteeName}</TableCell>
                    <TableCell>{meeting.inviteeEmail}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" />
                    </TableCell>
                    <TableCell>{formattedTime}</TableCell>
                    <TableCell>
                      <Link href={`/doctor-dashboard/booking/${meeting.id}`} passHref>
                        <Button variant="outlined" disabled={loading}>
                          {loading ? <CircularProgress size={24} /> : 'View Details'}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default Appointments;

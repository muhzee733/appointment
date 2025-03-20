import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
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

const statusMap = {
  active: { label: 'Active', color: 'info' },
  canceled: { label: 'Canceled', color: 'error' },
  completed: { label: 'Completed', color: 'success' },
  expired: { label: 'Expired', color: 'warning' },
};

// Format timestamp for display
function formatTimestamp(timestamp) {
  if (timestamp && timestamp.seconds) {
    // Create a new Date object from Firestore timestamp (seconds + nanoseconds)
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleString(); // or use toISOString() if you prefer UTC format
  }
  return ''; // Return empty if it's not a valid timestamp
}


function LatestOrders({ meetings, loading, error }) {
  const [email, setEmail] = useState('');
  const [updatedMeetings, setUpdatedMeetings] = useState(meetings);

  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem('email');
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, []);

  // Update meeting status if the meeting time has passed and it's still active
  const checkMeetingStatus = () => {
    const now = new Date().getTime();
    const updated = meetings.map((meeting) => {
      const meetingTime = new Date(meeting.eventDetails.startTime).getTime();
      if (meeting.status === 'active' && now > meetingTime) {
        return { ...meeting, status: 'expired' }; // Mark as expired if time has passed
      }
      return meeting;
    });

    // Sort meetings by createdAt timestamp in descending order (latest first)
    const sortedMeetings = updated.sort((a, b) => {
      const aTime = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000).getTime();
      const bTime = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000).getTime();
      return bTime - aTime; // Sort descending (latest first)
    });

    setUpdatedMeetings(sortedMeetings); // Update state with sorted meetings
  };

  useEffect(() => {
    checkMeetingStatus(); // Initial check on component mount
    const interval = setInterval(checkMeetingStatus, 60000); // Check every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [meetings]); // Depend on meetings so it updates when meetings change

  // Memoize meetings to avoid unnecessary recalculations
  const renderedMeetings = useMemo(() => {
    return updatedMeetings.map((meeting) => {
      console.log(meeting.eventDetails.startTime);

      const { label, color } = statusMap[meeting.status] || { label: 'Unknown', color: 'default' };
      const formattedTime = formatTimestamp(meeting.createdAt);
      const formattedStartTime = formatTimestamp(meeting.eventDetails.startTime);
      return (
        <TableRow hover key={meeting.id}>
          <TableCell>{formattedTime}</TableCell>
          <TableCell>{meeting.inviteeName}</TableCell>
          <TableCell>{meeting.inviteeEmail}</TableCell>
          <TableCell>
            <Chip color={color} label={label} size="small" />
          </TableCell>
          <TableCell>{formattedStartTime}</TableCell>
          {email === 'doctor@promed.com' && meeting.status === 'expired' ? (
            <TableCell>
              <Button variant="outlined" disabled>
                View Details
              </Button>
            </TableCell>
          ) : email === 'doctor@promed.com' ? (
            <TableCell>
              <Link href={`/doctor-dashboard/booking/${meeting.id}`}>
                <Button variant="outlined">View Details</Button>
              </Link>
            </TableCell>
          ) : meeting.status === 'expired' ? (
            <TableCell>
              <Button variant="outlined" disabled>
                View Details
              </Button>
            </TableCell>
          ) : (
            <TableCell>
              <Link href={`/dashboard/booking/${meeting.id}`}>
                <Button variant="outlined">View Details</Button>
              </Link>
            </TableCell>
          )}
        </TableRow>
      );
    });
  }, [updatedMeetings, email]);

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader title="Appointments" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Created Time</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Patient Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Meeting Time</TableCell>
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
                  <p>Error loading meetings.</p>
                </TableCell>
              </TableRow>
            ) : updatedMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                  <p>You don't have any appointments. First, book an appointment.</p>
                </TableCell>
              </TableRow>
            ) : (
              renderedMeetings
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default LatestOrders;

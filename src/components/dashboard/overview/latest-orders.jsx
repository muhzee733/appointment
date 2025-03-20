import * as React from 'react';
import { useEffect, useState } from 'react';
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
import { isAfter, parseISO } from 'date-fns';

const statusMap = {
  active: { label: 'Active', color: 'info' },
  canceled: { label: 'Canceled', color: 'error' },
  completed: { label: 'Completed', color: 'success' },
  expired: { label: 'Expired', color: 'warning' },
};

// Format timestamp for display
function formatTimestamp(timestamp) {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date.toLocaleString();
}

function LatestOrders({ meetings, loading, error }) {
  // State to store email
  const [email, setEmail] = useState('');
  const [updatedMeetings, setUpdatedMeetings] = useState(meetings); // Track updated meetings

  // Fetch email from sessionStorage when component mounts
  useEffect(() => {
    const emailFromStorage = sessionStorage.getItem('email');
    if (emailFromStorage) {
      setEmail(emailFromStorage);
    }
  }, []);

  useEffect(() => {
    const checkMeetingStatus = () => {
      const now = new Date();

      const updated = meetings.map((meeting) => {
        const meetingTime = parseISO(meeting.createdAt.toDate().toISOString());
        console.log(meetingTime, now)

        if (meeting.status === 'active' && isAfter(now, meetingTime)) {
          return { ...meeting, status: 'expired' };
        }

        return meeting;
      });

      const sortedMeetings = updated.sort((a, b) => {
        const aTime = parseISO(a.createdAt.toDate().toISOString());
        const bTime = parseISO(b.createdAt.toDate().toISOString());
        return bTime - aTime;
      });

      setUpdatedMeetings(sortedMeetings);
    };

    checkMeetingStatus();

    const interval = setInterval(checkMeetingStatus, 60000);

    return () => clearInterval(interval);
  }, [meetings]);

  return (
    <Card sx={{ padding: 2 }}>
      <CardHeader title="Appointments" />
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
              updatedMeetings.map((meeting) => {
                const { label, color } = statusMap[meeting.status] || { label: 'Unknown', color: 'default' };
                const formattedTime = formatTimestamp(meeting.createdAt);
                return (
                  <TableRow hover key={meeting.id}>
                    <TableCell>{meeting.inviteeName}</TableCell>
                    <TableCell>{meeting.inviteeEmail}</TableCell>
                    <TableCell>
                      <Chip color={color} label={label} size="small" />
                    </TableCell>
                    <TableCell>{formattedTime}</TableCell>
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
              })
            )}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}

export default LatestOrders;

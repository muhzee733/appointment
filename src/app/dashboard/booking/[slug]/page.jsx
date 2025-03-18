'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

import { db } from '../../../../../firebase';

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  return date.toLocaleString();
};

const StyledButton = styled(Button)({
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
});

export default function Page({ params }) {
  const { slug } = params;
  const [meeting, setMeeting] = useState(null);
  const [userPreQuestions, setUserPreQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
        const userEmail = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;
        const meetingRef = doc(db, 'meetings', slug);
        const meetingDoc = await getDoc(meetingRef);

        if (!meetingDoc.exists()) {
          setError('Meeting not found.');
          return;
        }

        setMeeting({ id: meetingDoc.id, ...meetingDoc.data() });

        // Fetch user details using the logged-in email
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('email', '==', userEmail));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          console.log(userData);
          setUserPreQuestions(userData.preQuestion || []);
        } else {
          setError('User not found.');
        }
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={8} md={6}>
          <Card>
            <CardHeader title="Error" />
            <CardContent>
              <Typography variant="body1">{error}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      {/* Add dynamic title meta tag */}
      <Head>
        <title>{meeting ? `Meeting Details - ${meeting.inviteeName}` : 'Meeting Details'}</title>
        <meta
          name="description"
          content="Details of the scheduled meeting, including patient information, event times, and rescheduling options."
        />
        <meta name="keywords" content="meeting, patient, event, schedule, reschedule" />
      </Head>

      <Grid container spacing={3} justifyContent="center">
        {meeting ? (
          <Grid item xs={12} sm={10} md={12}>
            <Card>
              <CardHeader title="Meeting Details" sx={{ backgroundColor: '#121621', color: 'white' }} />
              <CardContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>{meeting.inviteeName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Patient Email</TableCell>
                        <TableCell>{meeting.inviteeEmail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>{meeting.status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Event Name</TableCell>
                        <TableCell>{meeting.eventDetails.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Event Start Time</TableCell>
                        <TableCell>{formatTimestamp(meeting.eventDetails.startTime)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Event End Time</TableCell>
                        <TableCell>{formatTimestamp(meeting.eventDetails.endTime)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Timezone</TableCell>
                        <TableCell>{meeting.timezone}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Location</TableCell>
                        <TableCell>{meeting.eventDetails.location.status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Reschedule URL</TableCell>
                        <TableCell>
                          <a href={meeting.rescheduleUrl} target="_blank" rel="noopener noreferrer">
                            Reschedule Meeting
                          </a>
                        </TableCell>
                      </TableRow>
                      {meeting.questionsAndAnswers.length > 0 ? (
                        meeting.questionsAndAnswers.map((qa, index) => (
                          <TableRow key={index}>
                            <TableCell>{`Q: ${qa.question}`}</TableCell>
                            <TableCell>{`A: ${qa.answer}`}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell>No questions answered yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* Render pre-questions */}
                {userPreQuestions.length > 0 && (
                  <Card sx={{ marginTop: '20px' }}>
                    <CardHeader title="Pre-Questions" sx={{ backgroundColor: '#f5f5f5' }} />
                    <CardContent>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Question</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {userPreQuestions.map((qa, index) => (
                              <TableRow key={index}>
                                <TableCell>{`Q: ${qa.question}`}</TableCell>
                                <TableCell>{`A: ${qa.answer}`}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Grid item xs={12} sm={10} md={8}>
            <Card>
              <CardHeader title="Meeting Not Found" sx={{ backgroundColor: '#f5f5f5' }} />
              <CardContent>
                <Typography>No meeting found with the provided ID.</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
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
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingRef = doc(db, 'meetings', slug);
        const docSnap = await getDoc(meetingRef);

        if (docSnap.exists()) {
          const meetingData = { id: docSnap.id, ...docSnap.data() };
          setMeeting(meetingData);

          // Fetch user answers using inviteeEmail
          if (meetingData.inviteeEmail) {
            fetchUserAnswers(meetingData.inviteeEmail);
          } else {
            setError('Invitee email not found.');
          }
        } else {
          setError('Meeting not found.');
        }
      } catch (error) {
        setError('Error fetching meeting data.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserAnswers = async (email) => {
      try {
        const userAnswersRef = collection(db, 'users');
        const q = query(userAnswersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserAnswers(userData.userAnswers || []);
        } else {
          setUserAnswers([]);
        }
      } catch (error) {
        console.error('Error fetching user answers:', error);
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
      <Head>
        <title>{meeting ? `Meeting Details - ${meeting.inviteeName}` : 'Meeting Details'}</title>
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

                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />

                <Typography variant="h6" sx={{ marginTop: 2 }}>
                  User Answers:
                </Typography>
                {userAnswers.length > 0 ? (
                  <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Question</TableCell>
                          <TableCell>Answer</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userAnswers.map((answer, index) => (
                          <TableRow key={index}>
                            <TableCell>{answer.question}</TableCell>
                            <TableCell>{answer.answer}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>No user answers found.</Typography>
                )}

                <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  {meeting.status === 'active' ? (
                    <Link
                      href={{
                        pathname: `/chat/${meeting.id}`,
                        query: { name: meeting.inviteeName, email: meeting.inviteeEmail },
                      }}
                      passHref
                    >
                      <StyledButton variant="contained" sx={{ marginTop: 2 }}>
                        Chat Now
                      </StyledButton>
                    </Link>
                  ) : (
                    <Typography variant="body1" sx={{ color: 'red' }}>
                      This meeting is not active.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <Typography>No meeting found.</Typography>
        )}
      </Grid>
    </>
  );
}

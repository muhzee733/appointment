'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

import LatestOrders from '@/components/dashboard/overview/latest-orders';
import Notifications from '@/components/Notification';

import { db } from '../../../firebase';

function Page() {
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    setLoading(true)
    const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
    const email = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;

    if (!email) return;

    const meetingsRef = collection(db, 'meetings');
    const usersRef = collection(db, 'users');

    const meetingsQuery = query(meetingsRef);
    const unsubscribeMeetings = onSnapshot(meetingsQuery, (snapshot) => {
      const meetingsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((meeting) => meeting.inviteeEmail === email)
        .sort((a, b) => new Date(a.time) - new Date(b.time));

      setMeetings(meetingsData);

      // Check if userAnswers exists in sessionStorage and update the user if needed
      const userAnswers = sessionStorage.getItem('userAnswers');
      if (userAnswers) {
        const answers = JSON.parse(userAnswers);

        // Query the users collection to find the user by email
        const userQuery = query(usersRef, where('email', '==', email));
        const unsubscribeUser = onSnapshot(userQuery, (userSnapshot) => {
          userSnapshot.forEach(async (userDoc) => {
            const userDocRef = doc(db, 'users', userDoc.id);

            try {
              // Update the user document with the userAnswers
              await updateDoc(userDocRef, {
                userAnswers: answers,
              });
            } catch (error) {
              console.error(`Error updating user with email ${email}: `, error);
            }
          });
        });

        // Cleanup listener for users collection
        return () => {
          unsubscribeUser();
        };
      }
    });

    setLoading(false);

    return () => {
      unsubscribeMeetings();
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid lg={12} md={12} xs={12}>
        <Notifications />
        <LatestOrders meetings={meetings} loading={loading} />
      </Grid>
    </Grid>
  );
}

export default Page;

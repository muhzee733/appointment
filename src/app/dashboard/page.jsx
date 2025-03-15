'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { collection, getDocs, query } from 'firebase/firestore'; // Correct Firebase imports

import { Budget } from '@/components/dashboard/overview/budget';
import LatestOrders from '@/components/dashboard/overview/latest-orders';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';

import { db } from '../../../firebase'; // Correct path for Firebase config

function Page() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]); // State for storing meetings data
  const [error, setError] = useState('');

  useEffect(() => {
    const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
    const email = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;

    const fetchMeetings = async () => {
      try {
        if (email) {
          const meetingsRef = collection(db, 'meetings');
          const q = query(meetingsRef);
          const querySnapshot = await getDocs(q);

          // Filter meetings based on the inviteeEmail matching the user's email
          const meetingsData = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((meeting) => meeting.inviteeEmail === email); // Compare inviteeEmail with the user's email

          setMeetings(meetingsData); // Update state with filtered meetings data
        }
      } catch (err) {
        setError('Error fetching meetings data: ' + err.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchMeetings();
  }, []);

  return (
    <Grid container spacing={3}>
      {/* <Grid lg={3} sm={6} xs={12}>
        <Budget diff={12} trend="up" sx={{ height: '100%' }} value="$24k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" />
      </Grid> */}
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders meetings={meetings} error={error} loading={loading} />
      </Grid>
    </Grid>
  );
}

export default Page;

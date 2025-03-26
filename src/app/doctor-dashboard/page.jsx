'use client';

import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { collection, getDocs, query } from 'firebase/firestore';

import LatestOrders from '@/components/dashboard/overview/latest-orders';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import Appointment from '@/components/doctor/overview/appointment';

import { db } from '../../../firebase';

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
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
          const meetingsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMeetings(meetingsData);
        }
      } catch (err) {
        setError('Error fetching meetings data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);


  return (
    <Grid container spacing={2}>
      <Grid lg={4} sm={6} xs={12}>
        <Appointment diff={12} trend="up" sx={{ height: '100%' }} value={meetings} />
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TasksProgress sx={{ height: '100%' }} value={75.5} meetings={meetings}/>
      </Grid>
      <Grid lg={4} sm={6} xs={12}>
        <TotalProfit sx={{ height: '100%' }} value="$15k" meetings={meetings}/>
      </Grid>
      <Grid lg={12} sm={12} xs={12}>
        <LatestOrders meetings={meetings} loading={loading} error={error} />
      </Grid>
    </Grid>
  );
};

export default Page;

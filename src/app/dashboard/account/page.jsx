'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

import { db } from '../../../../firebase';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const email = sessionStorage.getItem('email')
      try {
        if (email) {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            setUserData({ id: userDoc.id, ...userDoc.data() });
          } else {
            setError('User not found');
          }
        } else {
          setError('Contact to Admin...');
        }
      } catch (err) {
        setError('Error fetching user data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <AccountInfo userData={userData} error={error} loading={loading} />
        </Grid>
        <Grid lg={8} md={6} xs={12}>
          <AccountDetailsForm userData={userData} error={error} loading={loading} />
        </Grid>
      </Grid>
    </Stack>
  );
}

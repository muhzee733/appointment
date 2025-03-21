'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Grid from '@mui/material/Unstable_Grid2';
import { collection, onSnapshot, query } from 'firebase/firestore';
import LatestOrders from '@/components/dashboard/overview/latest-orders';

import { db } from '../../../firebase';

function Page() {
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(null);
  const [openNotification, setOpenNotification] = useState(true);

  useEffect(() => {
    const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
    const email = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;

    if (!email) return;

    const meetingsRef = collection(db, 'meetings');
    const notificationsRef = collection(db, 'notifications');

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
    });

    const notificationQuery = query(notificationsRef);
    const unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
      const notifications = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((notification) => notification.receiverEmail === email)
        .sort((a, b) => b.timestamp - a.timestamp);
      const latestNotification = notifications.length > 0 ? notifications[0] : null;

      setUnreadNotifications(latestNotification);
    });

    setLoading(false);

    const autoCloseTimer = setTimeout(() => {
      setOpenNotification(false);
    }, 10000);

    return () => {
      unsubscribeMeetings();
      unsubscribeNotifications();
      clearTimeout(autoCloseTimer); 
    };
  }, []);

  const handleCloseNotification = () => {
    setOpenNotification(false);
  };


  return (
    <Grid container spacing={3}>
      <Grid lg={12} md={12} xs={12}>
        {unreadNotifications && openNotification && (
          <Alert
            severity="info"
            sx={{ mb: 2 }}
            onClose={handleCloseNotification} // Close button functionality
          >
            <AlertTitle>New Notification</AlertTitle>
            You have a new unread Message.
            <br />
            <Link
              href={`/chat/${unreadNotifications.appointment_id}`}
              style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}
            >
              View On Chat
            </Link>
          </Alert>
        )}
        <LatestOrders meetings={meetings} loading={loading} />
      </Grid>
    </Grid>
  );
}

export default Page;

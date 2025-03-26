'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const Notification = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(null);
  const [openNotification, setOpenNotification] = useState(true);
  const [email, setEmail] = useState(null);
  const [meetings, setMeetings] = useState([]);

  // ✅ Extract email from cookies
  useEffect(() => {
    const isAuth = document.cookie.split('; ').find((row) => row.startsWith('isAuth='));
    const userEmail = isAuth ? decodeURIComponent(isAuth.split('=')[1]) : null;
    console.log('User Email:', userEmail); // ✅ Debugging
    setEmail(userEmail);
  }, []);

  useEffect(() => {
    if (!email) return;
  
    const meetingsRef = collection(db, 'meetings');
    const unsubscribeMeetings = onSnapshot(meetingsRef, (snapshot) => {
      const fetchedMeetings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Meetings Updated:", fetchedMeetings); // Debug log
      setMeetings(fetchedMeetings);
    });
  
    return () => unsubscribeMeetings();
  }, [email]);

  useEffect(() => {
    if (!email || meetings.length === 0) return;
  
    const notificationsRef = collection(db, 'notifications');
    const notificationQuery = query(notificationsRef);
    const unsubscribeNotifications = onSnapshot(notificationQuery, (snapshot) => {
      const notifications = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((notification) => notification.receiverEmail === email)
        .sort((a, b) => b.timestamp - a.timestamp)

      const activeNotification = notifications.find(notification => {
        const meeting = meetings.find(m => m.id === notification.appointment_id);
        return meeting && meeting.status === 'active';
      });

      // Set the unread notification
      setUnreadNotifications(prev => activeNotification || prev);
    });
  
    return () => unsubscribeNotifications();
  }, [email, meetings]);

  const handleCloseNotification = () => {
    if (unreadNotifications) {
      setOpenNotification(false);
      setUnreadNotifications(null);  // Clear the notification once closed
    }
  };

  // Effect to re-check notifications after closing the alert
  useEffect(() => {
    if (!unreadNotifications) {
      setOpenNotification(true);  // Reopen notification when there's a new one
    }
  }, [unreadNotifications]);

  return (
    <>
      {unreadNotifications && openNotification && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={handleCloseNotification}>
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
    </>
  );
};

export default Notification;

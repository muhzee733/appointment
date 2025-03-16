'use client';

import { useEffect, useState, useRef } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';

import { db } from '../../../../firebase';

const ChatPage = ({ params }) => {
  const { slug } = params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const userEmail = sessionStorage.getItem('email');
    if (userEmail) {
      setUser(userEmail);
    }
  }, []);

  // Fetch messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, 'chats', slug, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = querySnapshot.docs.map(doc => doc.data());
      setMessages(messageList);
      setMessagesLoading(false);

      // Scroll to the bottom when new messages arrive
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [slug]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      setLoading(true);
      await addDoc(collection(db, 'chats', slug, 'messages'), {
        text: newMessage,
        sender: user.includes('doctor') ? 'Doctor' : 'Patient',
        senderEmail: user,
        timestamp: new Date(),
      });
      setNewMessage('');
      setLoading(false);
    }
  };

  // Function to send video meeting link
  const sendVideoLink = async () => {
    setVideoLoading(true);

    try {
      const meetingRef = doc(db, 'meetings', slug);
      const meetingSnap = await getDoc(meetingRef);

      if (meetingSnap.exists()) {
        const meetingData = meetingSnap.data();
        const meetingLink = meetingData.eventDetails?.location?.join_url;

        if (meetingLink) {
          // Send meeting link as a message
          await addDoc(collection(db, 'chats', slug, 'messages'), {
            text: `Click here to join the meeting: ${meetingLink}`,
            isLink: true, // Custom flag to detect links in UI
            linkUrl: meetingLink, // Store link separately for JSX rendering
            sender: user.includes('doctor') ? 'Doctor' : 'System',
            senderEmail: user,
            timestamp: new Date(),
          });
        } else {
          console.log('Meeting URL not found.');
        }
      } else {
        console.log('Meeting not found.');
      }
    } catch (error) {
      console.error('Error fetching meeting:', error);
    }

    setVideoLoading(false);
  };

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Typography variant="h5">Chat Room</Typography>

      {/* Chat Messages Display */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          marginBottom: 2,
          maxHeight: '70vh',
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        {messagesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Typography variant="body2" sx={{ textAlign: 'center', marginTop: '20px' }}>
            No messages found.
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                margin: '10px 0',
                textAlign: msg.senderEmail === user ? 'right' : 'left',
                backgroundColor: msg.senderEmail === user ? '#DCF8C6' : '#EAEAEA',
                padding: '10px',
                borderRadius: '8px',
                maxWidth: '70%',
                alignSelf: msg.senderEmail === user ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.isLink ? (
                <Typography variant="body2">
                  <strong>{msg.sender}:</strong>{' '}
                  <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer">
                    Click here to join the meeting
                  </a>
                </Typography>
              ) : (
                <Typography variant="body2">
                  <strong>{msg.sender}:</strong> {msg.text}
                </Typography>
              )}
            </Box>
          ))
        )}
        {/* Auto-scroll to bottom */}
        <div ref={scrollRef}></div>
      </Box>

      {/* Message Input */}
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <Box sx={{ display: 'flex', marginTop: 2 }}>
        <Button variant="contained" onClick={sendMessage} sx={{ marginRight: 1 }} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
        </Button>
        <Button
          variant="contained"
          onClick={sendVideoLink}
          sx={{ marginTop: 2 }}
          disabled={videoLoading}
        >
          {videoLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Video Link'}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;

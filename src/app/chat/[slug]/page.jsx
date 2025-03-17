'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useSearchParams } from 'next/navigation';
import { db } from '../../../../firebase';

const ChatPage = ({ params }) => {
  const { slug } = params;
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const scrollRef = useRef(null);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleEndChatClick = () => {
    setOpenConfirmationDialog(true);
  };

  const handleConfirmEndChat = () => {
    setIsChatEnded(true);
    setOpenConfirmationDialog(false);

    const messageData = {
      text: `${user.includes('doctor') ? 'Doctor' : 'Patient'} has ended the chat.`,
      sender: 'System',
      senderEmail: user,
      timestamp: new Date(),
    };

    addDoc(collection(db, 'chats', slug, 'messages'), messageData)
      .then(() => {
        console.log('Chat end message added');
      })
      .catch((error) => {
        console.error('Error adding chat end message:', error);
      });
  };

  const handleCancelEndChat = () => {
    setOpenConfirmationDialog(false);
  };

  useEffect(() => {
    const userEmail = sessionStorage.getItem('email');
    if (userEmail) {
      setUser(userEmail);
    } else {
      console.log('No user logged in');
    }
  }, []);

  useEffect(() => {
    const messagesRef = collection(db, 'chats', slug, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
        messageList.push(doc.data());
      });

      setMessages(messageList);
      setMessagesLoading(false);

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [slug]);

  const sendMessage = async () => {
    if (newMessage.trim() && !isChatEnded) {
      setLoading(true);
      const messageData = {
        text: newMessage,
        sender: user.includes('doctor') ? 'Doctor' : 'Patient',
        senderEmail: user,
        patientEmail: email,
        timestamp: new Date(),
      };

      try {
        await addDoc(collection(db, 'chats', slug, 'messages'), messageData);

        await addDoc(collection(db, 'notifications'), {
          type: 'new_message',
          appointment_id: slug,
          senderEmail: user,
          receiverEmail: user.includes('doctor') ? email : slug,
          timestamp: new Date(),
          seen: false,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setNewMessage('');
      setLoading(false);
    }
  };

  const sendVideoLink = async () => {
    setVideoLoading(true);

    try {
      const meetingRef = doc(db, 'meetings', slug);
      const meetingSnap = await getDoc(meetingRef);

      if (meetingSnap.exists()) {
        const meetingData = meetingSnap.data();
        const meetingLink = meetingData.eventDetails?.location?.join_url;

        if (meetingLink) {
          await addDoc(collection(db, 'chats', slug, 'messages'), {
            text: `Click here to join the meeting: ${meetingLink}`,
            isLink: true,
            linkUrl: meetingLink,
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

  function formatTimestamp(timestamp) {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toLocaleTimeString();
  }

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Chat Room</Typography>
        {user === 'doctor@promed.com' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '20px' }}>
            <div>
              <b>Patient Name:</b> <span>{name}</span>
            </div>
            <div>
              <b>Patient Email:</b> <span>{email}</span>
            </div>
          </div>
        ) : null}
      </Box>

      <Box
        ref={scrollRef}
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
                display: 'flex',
                flexDirection: msg.senderEmail === user ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Box
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
                    <a href={msg.linkUrl} target="_blank" rel="noopener noreferrer">
                      Click here to join the meeting
                    </a>
                  </Typography>
                ) : (
                  <Typography variant="body2">{msg.text}</Typography>
                )}
              </Box>

              <Typography variant="caption" sx={{ marginTop: '5px', textAlign: msg.senderEmail === user ? 'right' : 'left' }}>
                {formatTimestamp(msg.timestamp)}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TextField
          label="Type a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{
            width: user === 'doctor@promed.com' ? '75%' : '100%',
          }}
          disabled={isChatEnded}
        />
        {user === 'doctor@promed.com' && !isChatEnded && (
          <Button variant="contained" color="secondary" onClick={sendVideoLink} disabled={videoLoading || isChatEnded}>
            {videoLoading ? <CircularProgress size={24} /> : 'Send Video Link'}
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={sendMessage} disabled={loading || isChatEnded}>
          {loading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
        <Button variant="contained" color="error" onClick={handleEndChatClick} disabled={isChatEnded}>
          End Chat
        </Button>
      </div>

      <Dialog open={openConfirmationDialog} onClose={handleCancelEndChat}>
        <DialogTitle>Are you sure you want to end the chat?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Ending the chat will notify both parties and no further messages can be sent.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEndChat} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmEndChat} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatPage;

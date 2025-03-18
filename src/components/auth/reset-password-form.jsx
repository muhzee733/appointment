'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import emailjs from 'emailjs-com';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Controller, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate reset tokens
import { z } from 'zod';

import { db } from '../../../firebase'; // Make sure this is your Firebase configuration

const schema = z.object({ email: z.string().min(1, { message: 'Email is required' }).email() });

const defaultValues = { email: '' };

export function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    setIsPending(true);
    try {
      // Check if email exists in the Firestore users collection
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', values.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Email not found
        console.log('Email not found in the users collection');
        setError('root', { type: 'server', message: 'Email not found' });
      } else {
        // Email exists, proceed to generate reset token and update Firestore
        const userDoc = querySnapshot.docs[0]; // Get the first document from the query
        const userEmail = userDoc.data().email; // Get the email from the document data

        // Ensure the email from Firestore matches the input email
        if (userEmail === values.email) {
          const resetToken = uuidv4(); // Generate a reset token using uuid
          const userRef = doc(db, 'users', userDoc.id); // Get the user document reference

          // Update the user document with reset token and expiration time
          await updateDoc(userRef, {
            resetToken: resetToken,
            resetTokenExpiration: Date.now() + 3600000, // 1 hour expiration
          });

          console.log('Email found in the users collection');
          setSuccess('A reset link has been sent to your email if it exists in our records.');

          // Send the reset token email using EmailJS
          const result = await emailjs.send(
            'service_736gl5l', // Replace with your EmailJS service ID
            'service_736gl5l', // Replace with your EmailJS template ID
            {
              email: values.email,
              resetToken: resetToken,
            },
            'XFFIi19Yw_G3o84R1' // Replace with your EmailJS user ID
          );
          console.log('Email sent successfully:', result);
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
      setFormError('Failed to check email');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h5">Reset Password</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {formError && <Alert color="error">{formError}</Alert>}
          {success && <Alert color="success">{success}</Alert>}
          <Button disabled={isPending} type="submit" variant="contained">
            Send recovery link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Button, TextField } from '@mui/material';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';

import { Layout } from '@/components/auth/layout';

import { db } from '../../../../../firebase';

const ResetPasswordPage = () => {
  const { slug } = useParams(); // Get token from URL
  const router = useRouter();

  const [userId, setUserId] = useState(null); // Store the user ID from Firestore
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!slug) {
        setError('Invalid or missing token.');
        return;
      }

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('resetToken', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            console.log('✅ Match Found! User:', doc.id, doc.data());
            setUserId(doc.id); // Set the user ID
            setEmail(doc.data().email); // Set the user's email (or any field you want)
            setIsValidToken(true); // Token is valid now
          });
        } else {
          console.log('❌ No user found with resetToken:', slug);
          setError('Invalid or expired token.');
        }
      } catch (err) {
        console.error('Error validating token:', err);
        setError('Something went wrong. Please try again.');
      }
    };

    validateToken();
  }, [slug]);

  const handleResetPassword = async () => {
    if (!isValidToken) return;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const userRef = doc(db, 'users', userId);

      // Update the user's password directly (no hashing)
      await updateDoc(userRef, {
        password: newPassword, // Update the password
        resetToken: null, // Clear the reset token after password is reset
        resetTokenExpiration: null, // Clear any expiration field, if you have it
      });

      setSuccess('Password successfully reset! Redirecting...');
      setTimeout(() => router.push('/auth/sign-in'), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <h2>Reset Your Password</h2>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {isValidToken && (
          <>
            <p>Email: {email}</p>

            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Button variant="contained" color="primary" disabled={isLoading} onClick={handleResetPassword}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;

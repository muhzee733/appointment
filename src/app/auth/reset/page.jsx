'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase'; // Your Firebase config
import { Button, TextField, Alert } from '@mui/material';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null); // State to store the token

  const [isMounted, setIsMounted] = useState(false); // To ensure component is mounted
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true); // Set mounted to true once the component is mounted
  }, []);


  useEffect(() => {
    if (!token) {
      setError('Invalid reset token');
    }
  }, [token]);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // Check if the reset token exists in Firestore
      const userRef = doc(db, 'users', token);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setError('Invalid or expired reset token');
        setIsLoading(false);
        return;
      }

      // Check if the token has expired
      const userData = userDoc.data();
      const currentTime = Date.now();

      if (userData.resetTokenExpiration < currentTime) {
        setError('The reset token has expired');
        setIsLoading(false);
        return;
      }

      // Update the password in Firestore (make sure to hash the password before storing it in production)
      await updateDoc(userRef, {
        password: newPassword, // Store the new password
        resetToken: null, // Reset the token after password change
        resetTokenExpiration: null, // Reset the expiration time
      });

      setSuccess('Password has been reset successfully');
      setIsLoading(false);

      // Redirect to login page after password reset
      router.push('/login');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset the password');
      setIsLoading(false);
    }
  };

  // Only render the component when it is mounted and token is available
  if (!isMounted || !token) return null;

  return (
    <div>
      <h2>Reset Your Password</h2>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <div>
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
      </div>

      <Button
        onClick={handlePasswordReset}
        variant="contained"
        color="primary"
        disabled={isLoading}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </div>
  );
};

export default ResetPasswordPage;

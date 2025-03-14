'use client';

import React, { useState } from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { paths } from '@/paths';

import { auth } from '../../../firebase';

const emailSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
});

const passwordSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
});

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({
    defaultValues: { email: '' },
    resolver: zodResolver(emailSchema),
  });

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  // Function to check if the email exists in Firebase
  const checkEmailExists = async ({ email }) => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, 'randompassword');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Email not found. Please sign up first.');
        setIsPending(false);
        return;
      }

      if (error.code === 'auth/wrong-password') {
        // Email exists but wrong password, so we proceed to the password step
        setIsEmailVerified(true);
        setEmail(email);
        setErrorMessage(null);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  // Function to handle password submission
  const handleSignIn = async ({ password }) => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      sessionStorage.setItem('firebaseToken', token);
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">Sign in</Typography>

      {!isEmailVerified ? (
        // Email Input Step
        <form onSubmit={handleEmailSubmit(checkEmailExists)}>
          <Stack spacing={2}>
            <Controller
              control={emailControl}
              name="email"
              render={({ field }) => (
                <FormControl error={Boolean(emailErrors.email)}>
                  <InputLabel>Email address</InputLabel>
                  <OutlinedInput {...field} label="Email address" type="email" />
                  {emailErrors.email && <FormHelperText>{emailErrors.email.message}</FormHelperText>}
                </FormControl>
              )}
            />
            {errorMessage && <Alert color="error">{errorMessage}</Alert>}
            <Button disabled={isPending} type="submit" variant="contained">
              Next
            </Button>
          </Stack>
        </form>
      ) : (
        // Password Input Step
        <form onSubmit={handlePasswordSubmit(handleSignIn)}>
          <Stack spacing={2}>
            <Typography variant="h6">Enter your password</Typography>
            <Controller
              control={passwordControl}
              name="password"
              render={({ field }) => (
                <FormControl error={Boolean(passwordErrors.password)}>
                  <InputLabel>Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    endAdornment={
                      showPassword ? (
                        <EyeIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeSlashIcon
                          cursor="pointer"
                          fontSize="var(--icon-fontSize-md)"
                          onClick={() => setShowPassword(true)}
                        />
                      )
                    }
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  {passwordErrors.password && <FormHelperText>{passwordErrors.password.message}</FormHelperText>}
                </FormControl>
              )}
            />
            <div>
              <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
                Forgot password?
              </Link>
            </div>
            {errorMessage && <Alert color="error">{errorMessage}</Alert>}
            <Button disabled={isPending} type="submit" variant="contained">
              Sign in
            </Button>
          </Stack>
        </form>
      )}
    </Stack>
  );
}

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { paths } from '@/paths';

import { db } from '../../../firebase';

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().optional(),
});

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [emailExists, setEmailExists] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (values) => {
      setIsPending(true);
      setErrorMessage(null);

      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', values.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          setEmailExists(true);
          setIsPasswordEmpty(!userData.password);

          if (!userData.password && values.password) {
            await updateDoc(doc(db, 'users', userDoc.id), {
              password: values.password,
            });

            setErrorMessage('Password updated successfully!');
            setIsPasswordEmpty(false);
            setOpenSnackbar(true);
            sessionStorage.setItem('isAuth', true);
            Cookies.set('isAuth', values.email, { expires: 1, path: '/', secure: true, sameSite: 'Strict' });
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
          } else if (userData.password && values.password) {
            if (userData.password === values.password) {
              setOpenSnackbar(true);
              sessionStorage.setItem('isAuth', true);
              Cookies.set('isAuth', values.email, { expires: 1, path: '/', secure: true, sameSite: 'Strict' });
              if (values.email === 'doctor@promed.com') {
                setTimeout(() => {
                  router.push('/doctor-dashboard');
                }, 3000);
              } else {
                setTimeout(() => {
                  router.push('/dashboard');
                }, 3000);
              }
            } else {
              setErrorMessage('Incorrect password. Please try again.');
            }
          }
        } else {
          setErrorMessage('Email does not exist. Schedule an appointment and then log in. Thank you.');
          setEmailExists(false);
          setIsPasswordEmpty(false);
        }
      } catch (error) {
        setError('root', { type: 'server', message: error.message });
        setErrorMessage(error.message);
      } finally {
        setIsPending(false);
      }
    },
    [router, setError]
  );

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const errorCookie = cookies.find((row) => row.startsWith('authError='));

    if (errorCookie) {
      setErrorMessage(decodeURIComponent(errorCookie.split('=')[1]));
      document.cookie = 'authError=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, []);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Email Field */}
          <Controller
            control={control}
            name="email"
            defaultValue=""
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {/* Password Field - Conditionally Displayed */}
          {emailExists && (
            <Controller
              control={control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                <FormControl error={Boolean(errors.password)}>
                  <InputLabel>{isPasswordEmpty ? 'Enter your new password' : 'Enter your password'}</InputLabel>
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
                    label={isPasswordEmpty ? 'Enter your new password' : 'Enter your password'}
                    type={showPassword ? 'text' : 'password'}
                  />
                  {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                </FormControl>
              )}
            />
          )}

          {/* Forgot Password Link */}
          <div>
            <Link component={RouterLink} href={paths.auth.resetPassword} variant="subtitle2">
              Forgot password?
            </Link>
          </div>

          {/* Error Message */}
          {errors.root || errorMessage ? <Alert color="error">{errors.root?.message || errorMessage}</Alert> : null}

          {/* Submit Button */}
          <Button disabled={isPending} type="submit" variant="contained">
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : emailExists && isPasswordEmpty ? (
              'Set Password'
            ) : (
              'Sign in'
            )}
          </Button>
        </Stack>
      </form>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Stack>
  );
}

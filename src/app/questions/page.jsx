'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation'; // ✅ Correct import
import {
  Alert,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Typography,
} from '@mui/material';

import questionsData from './question.json';

const SIX_HOURS = 6 * 60 * 60 * 1000;

export default function Page() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(Array(questionsData.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const currentQuestion = currentQuestionIndex !== null ? questionsData[currentQuestionIndex] : null;
  const isLastQuestion = currentQuestionIndex === questionsData.length - 1;

  const checkSessionExpiry = () => {
    const sessionTime = sessionStorage.getItem('sessionTime');
    if (sessionTime) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(sessionTime, 10) > SIX_HOURS) {
        sessionStorage.removeItem('userAnswers');
        sessionStorage.removeItem('sessionTime');
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (checkSessionExpiry()) {
      setSnackbar({ open: true, message: 'Your session has expired. Please start over.', severity: 'warning' });
      setTimeout(() => {
        router.push('/questions');
      }, 2000);
    }
  }, [router]);

  const nextQuestion = () => {
    if (currentQuestionIndex === null) {
      setCurrentQuestionIndex(0);
    } else if (selectedOptions[currentQuestionIndex] === null) {
      setSnackbar({ open: true, message: 'Please select an answer before proceeding.', severity: 'warning' });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex !== null && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAnswers = async () => {
    if (selectedOptions.includes(null)) {
      setSnackbar({ open: true, message: 'Please answer all questions before submitting.', severity: 'warning' });
      return;
    }
    setIsSubmitting(true);

    const answersWithQuestions = questionsData.map((question, index) => ({
      question: question.question,
      answer: selectedOptions[index],
    }));

    sessionStorage.setItem('userAnswers', JSON.stringify(answersWithQuestions));
    sessionStorage.setItem('sessionTime', new Date().getTime().toString());

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSnackbar({ open: true, message: 'Your answers have been submitted successfully.', severity: 'success' });
    setTimeout(() => router.push('https://calendly.com/geeklies-agency/test'), 2000);
    setIsSubmitting(false);
  };

  return (
    <>
      <Head>
        <title>{`Overview | Dashboard  `}</title>
      </Head>
      <Container
        maxWidth="md"
        sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
      >
        {currentQuestionIndex === null ? (
          <>
            <Typography variant="h4" gutterBottom>
              Great, and how have you tried treating your condition?
            </Typography>
            <Typography variant="body1" paragraph>
              Let's start with a 30-second pre-screening. Tell us about your condition and any previous treatment to
              determine if plant alternatives are right for you.
            </Typography>
            <Button variant="contained" color="primary" onClick={nextQuestion}>
              Sound Good
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" gutterBottom>
              {currentQuestion?.question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={selectedOptions[currentQuestionIndex] || ''}
                onChange={(e) => {
                  const newSelectedOptions = [...selectedOptions];
                  newSelectedOptions[currentQuestionIndex] = e.target.value;
                  setSelectedOptions(newSelectedOptions);
                }}
              >
                {currentQuestion?.options?.map((option, index) => (
                  <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
            <div style={{ marginTop: '20px' }}>
              <Button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outlined"
                color="secondary"
              >
                Back
              </Button>
              <Button
                onClick={isLastQuestion ? submitAnswers : nextQuestion}
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ marginLeft: '10px' }}
              >
                {isSubmitting ? 'Loading...' : isLastQuestion ? 'Submit' : 'Next'}
              </Button>
            </div>
          </>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

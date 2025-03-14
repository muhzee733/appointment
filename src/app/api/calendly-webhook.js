import { addDoc, collection } from 'firebase/firestore';

import { db } from '../../../firebase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body;

    if (event === 'invitee.created') {
      const { email, name, questions_and_answers, scheduled_event, cancel_url, reschedule_url, timezone, status } =
        payload;

      const { created_at, start_time, end_time, location, name: eventName, uri: eventUri } = scheduled_event;

      await addDoc(collection(db, 'meetings'), {
        eventType: event,
        createdAt: new Date(created_at),
        inviteeEmail: email,
        inviteeName: name,
        questionsAndAnswers: questions_and_answers,
        eventDetails: {
          name: eventName,
          startTime: new Date(start_time),
          endTime: new Date(end_time),
          location: location,
        },
        cancelUrl: cancel_url,
        rescheduleUrl: reschedule_url,
        timezone: timezone,
        status: status,
        patientId: patientId,
      });
    }
  } catch (error) {
    console.error('Error saving webhook data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

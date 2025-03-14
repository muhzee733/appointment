// app/api/calendly-webhook/route.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

import { auth, db } from '../../../../firebase';

export async function POST(req) {
  const password = 'Abcd.@123456';
  try {
    const { event, payload } = await req.json();

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
    });
    const user = await createUserWithEmailAndPassword(auth, email, password);
    console.log(user, 'response')
    return new Response(JSON.stringify({ message: 'Webhook received successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ message: 'Error processing webhook.' }), { status: 500 });
  }
}

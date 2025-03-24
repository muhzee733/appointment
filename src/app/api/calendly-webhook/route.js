import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

import { db } from '../../../../firebase';

export async function POST(req) {
  try {
    const { event, payload } = await req.json();
    const { email, name, questions_and_answers, scheduled_event, cancel_url, reschedule_url, timezone, status } =
      payload;
    const { created_at, start_time, end_time, location, name: eventName } = scheduled_event;

    // Store meeting details
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
      endChat: false
    });

    // Check if user already exists in the 'users' collection
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(emailQuery);

    if (querySnapshot.empty) {
      await addDoc(usersRef, {
        email: email,
        password: '',
        createdAt: new Date(),
        name:name,
        timezone: timezone,
        country: "Australia",
      });
    }

    return new Response(JSON.stringify({ message: 'Webhook received successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ message: 'Error processing webhook.', error: error.message }), {
      status: 500,
    });
  }
}

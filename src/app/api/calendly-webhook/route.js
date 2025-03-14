// app/api/calendly-webhook/route.js

export async function POST(req) {
  try {
    const data = await req.json();  // Parse the request body

    // Handle the data (e.g., log it or process it)
    console.log("Received Calendly webhook data:", data);

    // Respond with a success status
    return new Response(JSON.stringify({ message: 'Webhook received successfully!' }), { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ message: 'Error processing webhook.' }), { status: 500 });
  }
}

/**
 * functions/api/booking.ts
 *
 * Cloudflare Pages Function — replaces src/app/api/booking/route.ts
 *
 * This runs on Cloudflare Workers runtime ONLY when a booking form is submitted.
 * Static pages never touch this function — they are served directly from CDN.
 *
 * Cloudflare Pages Functions automatically handle routing:
 * POST /api/booking → this file's onRequestPost handler
 */

interface Env {
  GOOGLE_SCRIPT_URL?: string;
}

interface BookingBody {
  tripType?: string;
  from?: string;
  to?: string;
  date?: string;
  carType?: string;
  name?: string;
  phone?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    let body: BookingBody;
    try {
      body = await request.json() as BookingBody;
    } catch {
      return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
    }

    const { tripType, from, to, date, carType, name, phone } = body;

    // Validate required fields
    if (!from || !date || !name || !phone) {
      return Response.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number (min 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return Response.json(
        { success: false, error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const GOOGLE_SCRIPT_URL = (env.GOOGLE_SCRIPT_URL || '').replace(/[\r\n]/g, '').trim();

    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SCRIPT_URL env variable is not set!');
      return Response.json(
        { success: false, error: 'Booking service not configured. Please call us directly.' },
        { status: 500 }
      );
    }

    const bookingPayload = {
      tripType: tripType || 'One-Way',
      pickupCity: from,
      dropCity: to || 'N/A',
      travelDate: date,
      carType: carType || 'Sedan',
      name,
      phone,
      timestamp: new Date().toISOString(),
      source: 'website',
    };

    try {
      const controller = new AbortController();
      // 25s timeout — accounts for Google Apps Script latency
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
        redirect: 'follow', // Google Apps Script uses 302 redirect — must follow
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const resText = await response.text().catch(() => '');
        console.log('Booking sent to Google Sheets. Status:', response.status, '| Response:', resText.substring(0, 200));
        return Response.json({
          success: true,
          message: 'Booking submitted successfully! We will call you shortly.',
        });
      } else {
        const errText = await response.text().catch(() => 'unknown');
        console.error('Google Script HTTP error:', response.status, errText.substring(0, 300));
        return Response.json(
          { success: false, error: 'Unable to submit booking. Please call us directly.' },
          { status: 502 }
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('Google Script timed out after 25s');
        return Response.json(
          { success: false, error: 'Request timed out. Please call us at +916204811752.' },
          { status: 504 }
        );
      }
      console.error('Google Script fetch error:', err);
      return Response.json(
        { success: false, error: 'Unable to submit booking. Please call us directly.' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Booking API error:', error);
    return Response.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
};

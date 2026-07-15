import { NextRequest, NextResponse } from 'next/server';

// Google Apps Script Web App URL — deployed as "Anyone can access"
const GOOGLE_SCRIPT_URL = (process.env.GOOGLE_SCRIPT_URL || '').replace(/[\r\n]/g, '').trim();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { tripType, from, to, date, carType, name, phone } = body;
    if (!from || !date || !name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate phone number (min 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Check env var configured
    if (!GOOGLE_SCRIPT_URL) {
      console.error('🚨 GOOGLE_SCRIPT_URL env variable is not set!');
      return NextResponse.json(
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

    // Send to Google Sheets via Apps Script
    try {
      const controller = new AbortController();
      // 25s timeout — accounts for Vercel cold start + Google Script latency
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
        // ANY 200 response = success (Script returns JSON or HTML — both are OK)
        const resText = await response.text().catch(() => '');
        console.log('✅ Booking sent to Google Sheets. Status:', response.status, '| Response:', resText.substring(0, 200));
        return NextResponse.json({
          success: true,
          message: 'Booking submitted successfully! We will call you shortly.',
        });
      } else {
        const errText = await response.text().catch(() => 'unknown');
        console.error('❌ Google Script HTTP error:', response.status, errText.substring(0, 300));
        return NextResponse.json(
          { success: false, error: 'Unable to submit booking. Please call us directly.' },
          { status: 502 }
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.error('❌ Google Script timed out after 25s');
        return NextResponse.json(
          { success: false, error: 'Request timed out. Please call us at +916204811752.' },
          { status: 504 }
        );
      }
      console.error('❌ Google Script fetch error:', err);
      return NextResponse.json(
        { success: false, error: 'Unable to submit booking. Please call us directly.' },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}

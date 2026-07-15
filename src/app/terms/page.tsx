import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import { BUSINESS } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  title: `Terms & Conditions | ${BUSINESS.name}`,
  description: `Terms and Conditions for booking cabs with ${BUSINESS.name}. Understand our booking, cancellation, payment, and service policies. Call ${BUSINESS.phone}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${BUSINESS.domain}/terms` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: BUSINESS.domain },
              { name: 'Terms & Conditions', url: `${BUSINESS.domain}/terms` },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Terms & Conditions', href: '/terms' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Please read these terms carefully before using {BUSINESS.name}&apos;s cab booking services.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-6">Last Updated: May 2026</p>

          <h2 className="text-xl font-bold text-secondary mb-3">1. Service Overview</h2>
          <p className="text-gray-600 mb-6">
            {BUSINESS.name} provides cab and car rental services across West Bengal, Jharkhand, and Odisha. Our services include local taxi, outstation cab, one-way taxi, round trip, airport transfer, wedding car rental, and corporate car rental. By booking a ride with us, you agree to the following terms.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">2. Booking & Confirmation</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Bookings can be made via phone call ({BUSINESS.phone}), WhatsApp, or the website booking form</li>
            <li>A booking is confirmed only after you receive a confirmation message on WhatsApp or via call</li>
            <li>We recommend booking at least 2-4 hours in advance for local trips and 12-24 hours for outstation trips</li>
            <li>For wedding car rental and group travel, we recommend booking 1-2 weeks in advance</li>
            <li>Advance payment of ₹500-1,000 may be required for outstation bookings to confirm the reservation</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">3. Pricing & Payment</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>All fares are quoted inclusive of fuel, driver charges, and AC</li>
            <li>Toll charges, parking fees, state permits, and night allowance (if applicable) are extra and communicated upfront</li>
            <li>We do NOT charge surge pricing — rates are fixed 24/7, 365 days</li>
            <li>Outstation minimum billing: 250 km per day. Local minimum: 4 hours / 40 km</li>
            <li>Payment can be made via Cash, UPI, Credit/Debit Card, or Bank Transfer</li>
            <li>For corporate clients, monthly billing with GST invoices is available</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">4. Cancellation & Refund Policy</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Free cancellation up to 4 hours before the scheduled pickup time</li>
            <li>Cancellations within 4 hours of pickup may attract a nominal charge of ₹200-500</li>
            <li>No-show: If you do not appear at the pickup location within 30 minutes of the scheduled time, the booking is considered a no-show, and a cancellation fee applies</li>
            <li>Refunds for prepaid bookings are processed within 3-5 business days</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">5. Passenger Responsibilities</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Passengers must provide accurate pickup location and contact details</li>
            <li>Passengers must be at the pickup location on time</li>
            <li>Carrying illegal substances, weapons, or hazardous materials is strictly prohibited</li>
            <li>Smoking and consumption of alcohol inside the vehicle is not allowed</li>
            <li>Any damage to the vehicle caused by the passenger will be charged to the passenger</li>
            <li>Maximum luggage as per vehicle capacity; excess luggage may require a larger vehicle</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">6. Driver & Vehicle</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>All drivers are police-verified with valid commercial licenses and minimum 5 years of experience</li>
            <li>We guarantee AC vehicles in the booked category (Sedan, SUV, or Tempo Traveller)</li>
            <li>While we ensure the vehicle category, the exact model may vary (e.g., Dzire or Amaze for Sedan)</li>
            <li>In rare cases of vehicle breakdown, we arrange a replacement vehicle at no additional charge</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">7. Safety & Insurance</h2>
          <p className="text-gray-600 mb-6">
            All our vehicles carry comprehensive insurance and valid fitness certificates. GPS tracking is available on all vehicles. In case of an accident or emergency, please call our helpline immediately at {BUSINESS.phone}. The driver will also follow our standard safety protocols.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">8. Limitation of Liability</h2>
          <p className="text-gray-600 mb-6">
            {BUSINESS.name} is not liable for delays caused by traffic, weather conditions, road closures, strikes, or any other circumstances beyond our control. We are not responsible for personal belongings left in the vehicle after the trip. We recommend passengers check for personal items before exiting.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">9. Route Changes</h2>
          <p className="text-gray-600 mb-6">
            You may change your destination or extend the trip during the journey. Additional distance will be charged at the same per-km rate. Please inform the driver or call us to make changes.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">10. Disputes</h2>
          <p className="text-gray-600 mb-6">
            Any disputes arising from our services will be subject to the jurisdiction of courts in Kolkata, West Bengal, India. We encourage resolving disputes amicably through our customer support team.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">11. Changes to Terms</h2>
          <p className="text-gray-600 mb-6">
            We reserve the right to modify these Terms & Conditions at any time. Updated terms will be posted on this page. Continued use of our services constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">12. Contact Us</h2>
          <div className="bg-accent rounded-xl p-4 text-sm text-gray-700">
            <p><strong>{BUSINESS.name}</strong></p>
            <p>Phone: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a></p>
            <p>Email: <a href={`mailto:${BUSINESS.email}`} className="text-primary hover:underline">{BUSINESS.email}</a></p>
            <p>Address: Park Street Area, Kolkata, West Bengal, India — 700001</p>
          </div>
        </div>
      </section>
    </>
  );
}

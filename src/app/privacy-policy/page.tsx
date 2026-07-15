import { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroBanner from '@/components/HeroBanner';
import { BUSINESS } from '@/lib/data';
import { generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = false;
export const metadata: Metadata = {
  title: `Privacy Policy | ${BUSINESS.name}`,
  description: `Privacy Policy for ${BUSINESS.name}. Learn how we collect, use, and protect your personal data when booking cabs in Kolkata and across East India.`,
  robots: { index: true, follow: true },
  alternates: { canonical: `${BUSINESS.domain}/privacy-policy` },
  other: {
    thumbnail: `${BUSINESS.domain}/navbanner.webp`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbSchema([
              { name: 'Home', url: BUSINESS.domain },
              { name: 'Privacy Policy', url: `${BUSINESS.domain}/privacy-policy` },
            ])
          ),
        }}
      />

      {/* Hero */}
      <section className="relative text-white py-12 lg:py-16 overflow-hidden">
        <HeroBanner hideDots />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <Breadcrumbs items={[{ name: 'Privacy Policy', href: '/privacy-policy' }]} />
          <h1 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Your privacy is important to us. This policy describes how {BUSINESS.name} collects, uses, and protects your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-gray max-w-none">
          <p className="text-sm text-gray-500 mb-6">Last Updated: May 2026</p>

          <h2 className="text-xl font-bold text-secondary mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            When you book a cab through {BUSINESS.name}, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Name and contact details (phone number, email address)</li>
            <li>Pickup and drop-off locations</li>
            <li>Travel dates and preferences</li>
            <li>Vehicle preferences and number of passengers</li>
            <li>Payment information (for online transactions)</li>
            <li>Communication records (WhatsApp messages, call logs for booking purposes)</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>To process and confirm your cab bookings</li>
            <li>To assign a driver and vehicle for your trip</li>
            <li>To communicate booking details, driver information, and trip updates</li>
            <li>To provide customer support and handle queries</li>
            <li>To improve our services and personalize your experience</li>
            <li>To send promotional offers (only with your consent)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">3. Data Sharing</h2>
          <p className="text-gray-600 mb-4">
            We do NOT sell, trade, or rent your personal information to third parties. We may share your data with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Our drivers — only essential details (name, pickup location, phone number) needed for the trip</li>
            <li>Payment processors — for secure transaction processing</li>
            <li>Law enforcement — if required by law or to protect safety</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">4. Data Security</h2>
          <p className="text-gray-600 mb-6">
            We implement reasonable security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">5. Cookies & Analytics</h2>
          <p className="text-gray-600 mb-6">
            Our website may use cookies and analytics tools (such as Google Analytics) to understand user behavior, improve our services, and enhance your browsing experience. You can disable cookies in your browser settings at any time.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">6. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-1">
            <li>Access, correct, or delete your personal data</li>
            <li>Opt out of promotional communications</li>
            <li>Request a copy of data we hold about you</li>
            <li>Withdraw consent for data processing</li>
          </ul>

          <h2 className="text-xl font-bold text-secondary mb-3">7. Data Retention</h2>
          <p className="text-gray-600 mb-6">
            We retain your booking data for a reasonable period to provide you with better service on future bookings and to comply with legal requirements. You may request deletion of your data at any time by contacting us.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">8. Changes to This Policy</h2>
          <p className="text-gray-600 mb-6">
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this page periodically.
          </p>

          <h2 className="text-xl font-bold text-secondary mb-3">9. Contact Us</h2>
          <p className="text-gray-600 mb-2">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
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

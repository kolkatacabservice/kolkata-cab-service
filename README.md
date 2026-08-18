# 🚖 Kolkata Cab Service — Official Platform & Technical Documentation

[![Website](https://img.shields.io/badge/Live_Site-kolkatacabservice.com-0052CC?style=for-the-badge&logo=google-chrome&logoColor=white)](https://kolkatacabservice.com)
[![Framework](https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Deployment](https://img.shields.io/badge/Cloudflare_Pages-Static_Export-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#-contact--official-info)

Official web platform repository for **[Kolkata Cab Service](https://kolkatacabservice.com)**, Eastern India's leading outstation cab booking and car rental service provider. 

This repository contains the Next.js static application source code powering 13,800+ programmatically generated, highly optimized outstation taxi route pages across West Bengal, Jharkhand, Odisha, Bihar, and Uttar Pradesh.

---

## 🌐 Official Links & Online Booking

- 🏡 **Official Website**: [https://kolkatacabservice.com](https://kolkatacabservice.com)
- 📞 **24/7 Booking Helpline**: [+91 62909 37579](tel:+916290937579)
- 💬 **WhatsApp Direct Booking**: [Book Cab on WhatsApp](https://wa.me/916290937579)
- 🗺️ **Sitemap Index**: [https://kolkatacabservice.com/sitemap.xml](https://kolkatacabservice.com/sitemap.xml)

---

## 🚕 Key Cab Services Offered

[Kolkata Cab Service](https://kolkatacabservice.com) provides fixed-rate, zero-surge outstation cabs with police-verified drivers and sanitised AC vehicles (Sedan, Ertiga, SUV, Innova Crysta, and Tempo Traveller).

1. **[Outstation One-Way Cabs](https://kolkatacabservice.com/services/one-way-cab)**: Pay only for one direction with flat pricing across 5 states.
2. **[Round-Trip Outstation Taxi](https://kolkatacabservice.com/services/round-trip)**: Cost-effective multi-day packages for family vacations and business trips.
3. **[Kolkata Airport Taxi Transfer](https://kolkatacabservice.com/services/airport-transfer)**: 24/7 pick and drop service for Netaji Subhash Chandra Bose International Airport (CCU).
4. **[Local Hourly Car Rentals](https://kolkatacabservice.com/services/local-rental)**: 8hr/80km and 12hr/120km packages for local Kolkata sightseeing.
5. **[Wedding & Luxury Car Rental](https://kolkatacabservice.com/services/wedding-car)**: Chauffeur-driven decorated Innova Crysta and luxury sedans.

---

## 🛣️ Top Intercity Route Directories

Access popular outstation travel routes directly on the live platform:

| Origin – Destination | Distance | Vehicle Types Available | Quick Booking Link |
| :--- | :---: | :---: | :--- |
| **Kolkata to Digha** | 185 km | Sedan, SUV, Tempo Traveller | [Book Kolkata to Digha Cab](https://kolkatacabservice.com/routes/kolkata-to-digha) |
| **Kolkata to Siliguri** | 560 km | Sedan, Innova Crysta, SUV | [Book Kolkata to Siliguri Taxi](https://kolkatacabservice.com/routes/kolkata-to-siliguri) |
| **Kolkata to Mandarmani** | 170 km | Dzire, Ertiga, Crysta | [Book Kolkata to Mandarmani Taxi](https://kolkatacabservice.com/routes/kolkata-to-mandarmani) |
| **Kolkata to Puri** | 500 km | AC Sedan, SUV, Tempo | [Book Kolkata to Puri Cab](https://kolkatacabservice.com/routes/kolkata-to-puri) |
| **Kolkata to Ranchi** | 410 km | Dzire, Ertiga, Crysta | [Book Kolkata to Ranchi Taxi](https://kolkatacabservice.com/routes/kolkata-to-ranchi) |
| **Kolkata to Mayapur** | 130 km | Sedan, SUV, Tempo | [Book Kolkata to Mayapur Cab](https://kolkatacabservice.com/routes/kolkata-to-mayapur) |
| **Kolkata to Deoghar** | 330 km | AC Sedan, Innova Crysta | [Book Kolkata to Deoghar Taxi](https://kolkatacabservice.com/routes/kolkata-to-deoghar) |
| **Kolkata to Jamshedpur** | 280 km | Dzire, Ertiga, SUV | [Book Kolkata to Jamshedpur Cab](https://kolkatacabservice.com/routes/kolkata-to-jamshedpur) |
| **Kolkata to Patna** | 580 km | SUV, Innova Crysta | [Book Kolkata to Patna Taxi](https://kolkatacabservice.com/routes/kolkata-to-patna) |

Explore all covered cities: [West Bengal Cabs](https://kolkatacabservice.com/west-bengal) \| [Jharkhand Cabs](https://kolkatacabservice.com/jharkhand) \| [Odisha Cabs](https://kolkatacabservice.com/odisha) \| [Bihar Cabs](https://kolkatacabservice.com/bihar) \| [Uttar Pradesh Cabs](https://kolkatacabservice.com/uttar-pradesh).

---

## ⚡ Technical Architecture & SEO Infrastructure

The application is engineered as a static export (`output: 'export'`) optimized for ultra-fast Global CDN delivery via **Cloudflare Pages**.

### Tech Stack
- **Core**: Next.js 15 (App Router, Static Site Generation - SSG)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS & Lucide React Icons
- **Edge CDN & Hosting**: Cloudflare Pages + Cloudflare CDN
- **Security & Headers**: Cloudflare `_headers` and custom Transform Rules

### SEO & Indexing Engineering Highlights
- **Dynamic Content Distribution Engine**: Implements a 32-bucket deterministic hash algorithm (`hash % 16` with direction offsets) to ensure zero duplicate content across 13,800+ programmatic route pages.
- **Canonical Hygiene**: Every page outputs a self-referencing canonical URL pointing to `https://kolkatacabservice.com`.
- **Structured Schema Markup**: Embedded JSON-LD for `TaxiService`, `FAQPage`, `BreadcrumbList`, and `Product` schemas on every page.
- **Noindex Protection**: Strict noindex directives on thin vehicle filter URLs (`/routes/[route]/[vehicle]`) to conserve crawl budget and protect core route pages.

---

## 💻 Local Development & Deployment

### Prerequisites
- Node.js 18.x or higher
- npm / pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/kolkatacabservice/kolkata-cab-service.git

# Navigate into project directory
cd kolkata-cab-service

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Static Build
```bash
npm run build
```
The static HTML export will be generated in the `out/` directory ready for deployment to Cloudflare Pages.

---

## 📞 Contact & Official Information

- **Brand Name**: Kolkata Cab Service
- **Website**: [kolkatacabservice.com](https://kolkatacabservice.com)
- **Phone**: [+91 62909 37579](tel:+916290937579)
- **Service Hours**: 24 Hours a day, 7 days a week
- **Coverage Region**: West Bengal, Jharkhand, Odisha, Bihar, Uttar Pradesh (India)

---
*© 2026 [Kolkata Cab Service](https://kolkatacabservice.com). All rights reserved.*

import citiesData from '@/data/cities.json';
import fleetData from '@/data/fleet.json';
import toursData from '@/data/tours.json';
import stateFaresData from '@/data/state-fares.json';

// ═══════════════════════════════════════════════
// STATE FARE TYPES
// ═══════════════════════════════════════════════
export interface VehicleRate {
  pricePerKm: number;           // per-km rate (outstation / short trip base)
  baseFare: number;             // base fare / local package price
  minKm: number;                // minimum km billing per day
  driverAllowance: number;      // daily driver / night allowance
  // Optional two-tier fields (Odisha-style)
  label?: string;
  shortDistanceThreshold?: number;
  longDistancePerKm?: number;
  longDistanceMinKm?: number;
  nightCharge?: number;
  // Optional WB-specific fields
  extraKmRate?: number;         // extra km rate beyond package
  extraHourRate?: number;       // extra hour rate beyond package
  cityTransfer?: number;        // city transfer flat rate (up to 60km)
  tollInclusive?: boolean;      // true = toll included in outstation fare
  notes?: string;               // vehicle-level note
}

export interface StateFares {
  sedan: VehicleRate;
  suv: VehicleRate;
  innova: VehicleRate;
  tempo: VehicleRate;
  luxury: VehicleRate;
  // Optional extended vehicle types
  crysta?: VehicleRate;
  tempo17?: VehicleRate;
  tempo25?: VehicleRate;
  tempo26?: VehicleRate;
  localPackages: { name: string; sedan: number; suv: number; innova: number; tempo: number; [key: string]: number | string }[];
  airportTransfer: { sedan: number; suv: number; innova: number };
  displayRate: string;
  notes?: string[];
}

// Returns state-specific fare rates. Falls back to 'default' for unknown states.
export function getStateFares(stateSlug: string): StateFares {
  const fares = stateFaresData as Record<string, StateFares>;
  return fares[stateSlug] ?? fares['default'];
}

// Returns just the per-km display string for a state (e.g. '₹12/km')
export function getStateDisplayRate(stateSlug: string): string {
  return getStateFares(stateSlug).displayRate;
}

// Returns display-ready price labels for a state — use this in all pages
export function getStatePriceLabels(stateSlug: string) {
  const f = getStateFares(stateSlug);
  return {
    sedanRate: f.sedan.pricePerKm,
    suvRate: f.suv.pricePerKm,
    innovaRate: f.innova.pricePerKm,
    crystaRate: f.crysta?.pricePerKm ?? f.innova.pricePerKm,
    tempoRate: f.tempo.pricePerKm,
    sedanPerKm: `₹${f.sedan.pricePerKm}/km`,
    suvPerKm: `₹${f.suv.pricePerKm}/km`,
    innovaPerKm: `₹${f.innova.pricePerKm}/km`,
    crystaPerKm: `₹${f.crysta?.pricePerKm ?? f.innova.pricePerKm}/km`,
    tempoPerKm: `₹${f.tempo.pricePerKm}/km`,
    airportSedan: `₹${f.airportTransfer.sedan}`,
    airportSuv: `₹${f.airportTransfer.suv}`,
    airportInnova: `₹${f.airportTransfer.innova}`,
    airportSedanNum: f.airportTransfer.sedan,
    airportSuvNum: f.airportTransfer.suv,
    airportInnovaNum: f.airportTransfer.innova,
    localPkgName: f.localPackages[0]?.name ?? '8 Hours / 80 KM',
    localPkgSedan: f.localPackages[0]?.sedan ?? 2200,
    localPkgSuv: f.localPackages[0]?.suv ?? 2700,
    localPkgInnova: f.localPackages[0]?.innova ?? 2900,
    localPkgTempo: f.localPackages[0]?.tempo ?? 3700,
    displayRate: f.displayRate,
    driverAllowance: f.sedan.driverAllowance,
    minKm: f.sedan.minKm,
    fares: f,  // full fares object for advanced usage
  };
}

export interface City {
  name: string;
  slug: string;
  alternateNames?: string[];
  lat: number;
  lng: number;
  type?: string;
  tourist: boolean;
  description: string;
  landmarks: string[];
  airport?: string;
  railway?: string;
}

export interface StateData {
  name: string;
  capital: string;
  slug: string;
  description: string;
  cities: City[];
}

export interface Route {
  from: string;
  fromName: string;
  fromState: string;
  to: string;
  toName: string;
  toState: string;
  distance: number;
  duration: string;
  slug: string;
  via: string[];
  priceSaloon: number;
  priceSuv: number;
  priceTempo: number;
}

const states = citiesData as Record<string, StateData>;

export function getAllStates(): StateData[] {
  return Object.values(states);
}

export function getState(slug: string): StateData | undefined {
  return states[slug];
}

export function getAllStateSlugs(): string[] {
  return Object.keys(states);
}

export function getAllCities(): (City & { state: string; stateName: string })[] {
  const cities: (City & { state: string; stateName: string })[] = [];
  for (const [stateSlug, stateData] of Object.entries(states)) {
    for (const city of stateData.cities) {
      cities.push({
        ...city,
        state: stateSlug,
        stateName: stateData.name,
      });
    }
  }
  return cities;
}

export function getCity(stateSlug: string, citySlug: string): City | undefined {
  return states[stateSlug]?.cities.find(c => c.slug === citySlug);
}

export function getCitiesByState(stateSlug: string): City[] {
  return states[stateSlug]?.cities || [];
}

export function getHubCities(): (City & { state: string; stateName: string })[] {
  return getAllCities().filter(c => c.type === 'hub');
}

export function getTouristCities(): (City & { state: string; stateName: string })[] {
  return getAllCities().filter(c => c.tourist);
}

export function getFleet() {
  return fleetData;
}

export const VEHICLE_SLUGS = ['sedan', 'suv', 'tempo', 'luxury'] as const;
export type VehicleSlug = typeof VEHICLE_SLUGS[number];

export function getVehicles() {
  return fleetData.vehicles;
}

export function getVehicle(slug: string) {
  return fleetData.vehicles.find(v => v.id === slug);
}

export function getVehicleSlugs(): string[] {
  return VEHICLE_SLUGS as unknown as string[];
}

export function getLocalPackages() {
  return fleetData.localPackages;
}

export function getServices() {
  return fleetData.services;
}

export const BUSINESS = {
  name: 'Kolkata Cab Service',
  phone: '+916204811752',
  phoneDisplay: '+91 620-481-1752',
  whatsapp: '916204811752',
  whatsappLink: 'https://wa.me/916204811752',
  email: 'kolkatacabtaxiservices@gmail.com',
  tagline: 'Your Trusted Cab Service in Kolkata & East India',
  hours: '24/7, 365 Days',
  payment: 'Cash, UPI, Card, Online Transfer',
  domain: 'https://www.kolkatacabservice.com',
  foundYear: 2020,
  gbpLink: 'https://g.page/r/CQpn2lOt9Y8QEBM',
  gbpReviewLink: 'https://g.page/r/CQpn2lOt9Y8QEBM/review',
  states: ['West Bengal', 'Jharkhand', 'Odisha', 'Bihar', 'Uttar Pradesh'],
  hubs: ['Kolkata', 'Ranchi', 'Bhubaneswar'],
};

export interface TourItinerary {
  day: number;
  title: string;
  details: string;
}

export interface Tour {
  id: string;
  name: string;
  slug: string;
  duration: string;
  days: number;
  fromCity: string;
  fromSlug: string;
  destination: string;
  state: string;
  distance: number;
  category: string;
  highlights: string[];
  description: string;
  itinerary: TourItinerary[];
  pricing: { sedan: number; suv: number; tempo: number };
  included: string[];
  excluded: string[];
}

const tours = toursData as Tour[];

export function getTours(): Tour[] {
  return tours;
}

export function getTour(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}

export function getTourSlugs(): string[] {
  return tours.map(t => t.slug);
}

export function getToursByCategory(category: string): Tour[] {
  return tours.filter(t => t.category === category);
}

export function getToursFromCity(citySlug: string): Tour[] {
  return tours.filter(t => t.fromSlug === citySlug);
}

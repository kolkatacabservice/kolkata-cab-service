'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calculator, MapPin, Car, Phone, ArrowRight, IndianRupee, Clock, Route as RouteIcon, ChevronDown, Sparkles } from 'lucide-react';
import { BUSINESS, getAllCities, getStateFares } from '@/lib/data';

interface FareCalculatorProps {
  defaultFrom?: string;
  defaultTo?: string;
}

interface FareResult {
  distance: number;
  duration: string;
  sedan: number;
  suv: number;
  tempo: number;
  luxury: number;
  routeExists: boolean;
  fromName: string;
  toName: string;
  rates: { sedan: number; suv: number; tempo: number; luxury: number };
}

export default function FareCalculator({ defaultFrom = '', defaultTo = '' }: FareCalculatorProps) {
  const allCities = useMemo(() => getAllCities(), []);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [result, setResult] = useState<FareResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');


  const findCitySlug = useCallback((input: string): string | null => {
    const normalized = input.toLowerCase().trim().split(',')[0].trim();
    const city = allCities.find(
      c => c.name.toLowerCase() === normalized || c.slug === normalized
    );
    return city?.slug || null;
  }, [allCities]);

  // Resolve source city's stateSlug for state-aware rates
  const getFromStateSlug = useCallback((input: string): string => {
    const normalized = input.toLowerCase().trim().split(',')[0].trim();
    const city = allCities.find(
      c => c.name.toLowerCase() === normalized || c.slug === normalized
    );
    return city?.state ?? 'west-bengal';
  }, [allCities]);

  const calculateFare = useCallback(() => {
    setError('');
    setResult(null);

    if (!from.trim() || !to.trim()) {
      setError('Please enter both pickup and drop city');
      return;
    }

    setCalculating(true);

    // Simulate a brief calculation animation
    setTimeout(() => {
      const fromSlug = findCitySlug(from);
      const toSlug = findCitySlug(to);
      // Get state-specific rates for the FROM city
      const fromStateSlug = getFromStateSlug(from);
      const stateFares = getStateFares(fromStateSlug);
      const RATES = {
        sedan: stateFares.sedan.pricePerKm,
        suv:   stateFares.suv.pricePerKm,
        tempo: stateFares.tempo.pricePerKm,
        luxury: stateFares.luxury.pricePerKm,
      };

      // Estimate based on straight-line distance + state-specific per-km rates
      const fromCity = allCities.find(c => c.slug === fromSlug || c.name.toLowerCase() === from.toLowerCase().trim().split(',')[0].trim());
      const toCity = allCities.find(c => c.slug === toSlug || c.name.toLowerCase() === to.toLowerCase().trim().split(',')[0].trim());

      if (fromCity && toCity) {
        // Haversine distance * 1.3 road factor
        const R = 6371;
        const dLat = (toCity.lat - fromCity.lat) * Math.PI / 180;
        const dLng = (toCity.lng - fromCity.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(fromCity.lat * Math.PI / 180) * Math.cos(toCity.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const straightLine = R * c;
        const roadDistance = Math.round(straightLine * 1.3);
        const hours = Math.round(roadDistance / 55);
        const duration = hours <= 1 ? '1-2' : `${hours}-${hours + 1}`;

        // Two-tier fare calculation (supports Odisha-style base+perKm / flat-longDistance)
        const calcFare = (rate: typeof stateFares.sedan): number => {
          const km = roadDistance;
          if (rate.shortDistanceThreshold && rate.longDistancePerKm) {
            if (km <= rate.shortDistanceThreshold) {
              // Short trip: base fare + per km (min km applies)
              const billedKm = Math.max(km, rate.minKm);
              return rate.baseFare + billedKm * rate.pricePerKm;
            } else {
              // Long trip: flat per-km, min km applies
              const billedKm = Math.max(km, rate.longDistanceMinKm ?? km);
              return billedKm * rate.longDistancePerKm;
            }
          }
          // Standard: max(km × perKm, baseFare)
          return Math.max(km * rate.pricePerKm, rate.baseFare);
        };

        setResult({
          distance: roadDistance,
          duration,
          sedan:  calcFare(stateFares.sedan),
          suv:    calcFare(stateFares.suv),
          tempo:  calcFare(stateFares.tempo),
          luxury: calcFare(stateFares.luxury),
          routeExists: false,
          fromName: fromCity.name,
          toName: toCity.name,
          rates: RATES,
        });
      } else {
        setError('City not found. Please select from the suggestions or call us for a quote.');
      }
      setCalculating(false);
    }, 600);
  }, [from, to, findCitySlug, getFromStateSlug, allCities]);

  const getWhatsAppUrl = () => {
    if (!result) return '#';
    const message = `Hi! I want to know the cab fare from ${result.fromName} to ${result.toName}.\n📍 Distance: ${result.distance} km\n💰 Estimated Fare: ₹${result.sedan} (Sedan)`;
    return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <section className="fare-calculator-section py-12 bg-white" id="fare-calculator">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-3">
            <Sparkles size={16} />
            Instant Results — No Registration Required
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-secondary">
            Instant <span className="text-gradient">Fare Calculator</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Get exact cab fare in seconds — transparent pricing with no hidden charges</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Calculator Input */}
          <div className="fare-calc-card bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary" />
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div>
                <label htmlFor="calcFrom" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Pickup City
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    id="calcFrom"
                    type="text"
                    placeholder="e.g. Kolkata"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    list="calc-cities-from"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors"
                  />
                  <datalist id="calc-cities-from">
                    {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
                  </datalist>
                </div>
              </div>

              <div>
                <label htmlFor="calcTo" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Drop City
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <input
                    id="calcTo"
                    type="text"
                    placeholder="e.g. Siliguri"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    list="calc-cities-to"
                    autoComplete="off"
                    className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors"
                  />
                  <datalist id="calc-cities-to">
                    {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
                  </datalist>
                </div>
              </div>

              <button
                onClick={calculateFare}
                disabled={calculating}
                className="py-3 px-6 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]"
              >
                {calculating ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</>
                ) : (
                  <><Calculator size={18} /> Calculate Fare</>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="mt-6 fare-calc-result animate-slideUp">
              {/* Route Summary */}
              <div className="bg-secondary rounded-2xl p-6 text-white mb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <RouteIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{result.fromName} → {result.toName}</p>
                      <div className="flex gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {result.distance} km</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {result.duration} hrs</span>
                      </div>
                    </div>
                  </div>
                  {!result.routeExists && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full font-medium">
                      ⚡ Estimated Fare
                    </span>
                  )}
                  {result.routeExists && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full font-medium">
                      ✅ Exact Fare
                    </span>
                  )}
                </div>
              </div>

              {/* Vehicle Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Sedan', emoji: '🚗', models: 'Swift Dzire, Amaze', capacity: '4 Passengers', fare: result.sedan, perKm: result.rates.sedan, popular: false },
                  { name: 'SUV', emoji: '🚙', models: 'Ertiga, Innova', capacity: '6 Passengers', fare: result.suv, perKm: result.rates.suv, popular: true },
                  { name: 'Tempo', emoji: '🚐', models: 'Tempo Traveller', capacity: '12 Passengers', fare: result.tempo, perKm: result.rates.tempo, popular: false },
                  { name: 'Luxury', emoji: '✨', models: 'Fortuner, Mercedes', capacity: '4 Passengers', fare: result.luxury, perKm: result.rates.luxury, popular: false },
                ].map((v) => (
                  <div
                    key={v.name}
                    className={`relative p-5 rounded-2xl border-2 transition-all hover:shadow-lg ${v.popular ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 bg-white hover:border-primary/30'}`}
                  >
                    {v.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div className="text-3xl mb-2">{v.emoji}</div>
                    <h3 className="font-bold text-secondary text-lg">{v.name}</h3>
                    <p className="text-xs text-gray-500 mb-1">{v.models}</p>
                    <p className="text-xs text-gray-400 mb-3">{v.capacity}</p>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400">Estimated Fare</p>
                      <p className="text-2xl font-extrabold text-primary">₹{v.fare.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-400 mt-1">₹{v.perKm}/km × {result.distance} km</p>
                    </div>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      <Phone size={14} /> Book {v.name}
                    </a>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  <Phone size={18} /> Book Now: {BUSINESS.phone}
                </a>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-green-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all"
                >
                  💬 Get Quote on WhatsApp
                </a>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-xs text-gray-400 mt-4">
                * Fares include fuel & driver. Toll, parking & night charges extra. Final fare confirmed at booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

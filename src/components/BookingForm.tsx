'use client';

import { useState, useCallback } from 'react';
import { MapPin, Calendar, Car, User, Phone, Send, ChevronDown, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { BUSINESS, getAllCities } from '@/lib/data';

// Evaluated once at module load — not on every render
const allCities = getAllCities();

interface BookingFormProps {
  defaultFrom?: string;
  defaultTo?: string;
  compact?: boolean;
  flat?: boolean;
}

type FormState = {
  from: string;
  to: string;
  tripType: string;
  date: string;
  carType: string;
  name: string;
  phone: string;
};

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function BookingForm({ defaultFrom = '', defaultTo = '', compact = false, flat = false }: BookingFormProps) {
  const getInitialForm = useCallback((): FormState => ({
    from: defaultFrom,
    to: defaultTo,
    tripType: 'one-way',
    date: '',
    carType: 'sedan',
    name: '',
    phone: '',
  }), [defaultFrom, defaultTo]);

  const [form, setForm] = useState<FormState>(getInitialForm);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // Store submitted data for the success screen
  const [submittedData, setSubmittedData] = useState<{ phone: string; whatsappUrl: string } | null>(null);

  const getCarLabel = (carType: string) => {
    switch (carType) {
      case 'sedan': return 'Sedan';
      case 'suv': return 'SUV';
      case 'tempo': return 'Tempo Traveller';
      case 'luxury': return 'Luxury';
      default: return 'Sedan';
    }
  };

  const getTripLabel = (tripType: string) => {
    switch (tripType) {
      case 'one-way': return 'One-Way';
      case 'round-trip': return 'Round Trip';
      case 'local': return 'Local';
      case 'airport': return 'Airport Transfer';
      case 'outstation': return 'Outstation';
      case 'wedding': return 'Wedding Car';
      case 'corporate': return 'Corporate Travel';
      default: return 'One-Way';
    }
  };

  const buildWhatsAppUrl = (formData: FormState) => {
    const carLabel = getCarLabel(formData.carType);
    const tripLabel = getTripLabel(formData.tripType);
    const message = `Hi! I want to book a cab.\n📍 From: ${formData.from}\n📍 To: ${formData.to}\n🔄 Trip: ${tripLabel}\n📅 Date: ${formData.date}\n🚗 Car: ${carLabel}\n👤 Name: ${formData.name}\n📞 Phone: ${formData.phone}`;
    return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const resetForm = () => {
    setForm(getInitialForm());
    setStatus('idle');
    setErrorMsg('');
    setSubmittedData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    // Client-side phone validation
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStatus('error');
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const carLabel = getCarLabel(form.carType);
    const tripLabel = getTripLabel(form.tripType);

    // Save data for success screen before resetting
    const whatsappUrl = buildWhatsAppUrl(form);
    const phoneForDisplay = form.phone;

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripType: tripLabel,
          from: form.from,
          to: form.to || 'N/A',
          date: form.date,
          carType: carLabel,
          name: form.name,
          phone: form.phone,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Store submitted data for success screen
        setSubmittedData({ phone: phoneForDisplay, whatsappUrl });
        setStatus('success');
        // Auto-reset form after 8 seconds so user can book again
        setTimeout(() => {
          resetForm();
        }, 8000);
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Submission failed. Please try again or call us directly.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again, or book directly via WhatsApp/Call.');
    }
  };

  // ─────────────────────────────────────────────
  // SUCCESS STATE
  // ─────────────────────────────────────────────
  const renderSuccess = (isCompact: boolean) => (
    <div className={`${isCompact ? 'mt-4 p-4' : 'p-6'} bg-green-50 border border-green-200 rounded-2xl text-center animate-fadeIn`}>
      <CheckCircle size={isCompact ? 28 : 40} className="text-green-500 mx-auto mb-2" />
      <p className={`text-green-700 font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>Booking Submitted Successfully!</p>
      <p className={`text-green-600 ${isCompact ? 'text-xs' : 'text-sm'} mt-1`}>
        We will call you shortly at <strong>{submittedData?.phone}</strong>
      </p>
      <div className={`flex flex-col sm:flex-row gap-3 justify-center ${isCompact ? 'mt-3' : 'mt-4'}`}>
        <a href={submittedData?.whatsappUrl} target="_blank" rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 ${isCompact ? 'px-4 py-2 text-xs' : 'px-6 py-2.5 text-sm'} bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors shadow-md`}>
          💬 Chat on WhatsApp
        </a>
        <button type="button" onClick={resetForm}
          className={`inline-flex items-center justify-center gap-2 ${isCompact ? 'px-4 py-2 text-xs' : 'px-6 py-2.5 text-sm'} bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-md`}>
          <RotateCcw size={isCompact ? 14 : 16} /> Book Another Cab
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-2">Form resets automatically in a few seconds...</p>
    </div>
  );

  // ─────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────
  const renderError = (isCompact: boolean) => (
    <div className={`${isCompact ? 'mt-3 p-3' : 'mt-4 p-4'} bg-red-50 border border-red-200 rounded-xl text-center`}>
      <AlertCircle size={isCompact ? 20 : 24} className="text-red-500 mx-auto mb-1" />
      <p className={`text-red-700 font-semibold ${isCompact ? 'text-xs' : 'text-sm'}`}>{errorMsg}</p>
      <div className={`mt-3 flex flex-col sm:flex-row gap-2 justify-center ${isCompact ? 'text-xs' : 'text-sm'}`}>
        <a href={buildWhatsAppUrl(form)} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors shadow-sm">
          💬 Book on WhatsApp
        </a>
        <a href={`tel:${BUSINESS.phone}`}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/95 transition-colors shadow-sm">
          📞 Call {BUSINESS.phoneDisplay}
        </a>
      </div>
    </div>
  );

  // ─────────────────────────────────────────────
  // SUBMIT BUTTON
  // ─────────────────────────────────────────────
  const renderSubmitButton = (isCompact: boolean) => (
    <>
      <button type="submit" disabled={status === 'submitting'}
        className={`w-full ${isCompact ? 'mt-4 py-3' : 'py-3.5'} bg-gradient-to-r from-primary to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isCompact ? '' : 'text-lg'} disabled:opacity-70 disabled:cursor-not-allowed`}>
        {status === 'submitting' ? (
          <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
        ) : (
          <><Send size={isCompact ? 18 : 20} /> Submit Booking</>
        )}
      </button>
      {status === 'error' && renderError(isCompact)}
      <p className={`text-center text-xs ${isCompact ? 'text-gray-600' : 'text-gray-600'} mt-2`}>
        Or call directly: <a href={`tel:${BUSINESS.phone}`} className="text-primary font-semibold hover:underline">{BUSINESS.phone}</a>
      </p>
    </>
  );

  // ═══════════════════════════════════════════════
  // COMPACT FORM
  // ═══════════════════════════════════════════════
  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={flat ? "w-full" : "bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-2xl border border-gray-100 relative"}>
        {!flat && (
          <>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary rounded-t-2xl" />
            <h2 className="text-lg font-bold text-secondary mb-1">Book Your Cab Now</h2>
            <p className="text-gray-600 text-xs mb-4">Fill all details for instant confirmation</p>
          </>
        )}

        <div className="space-y-3">
          {/* Trip Type */}
          <div className="relative">
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select aria-label="Trip Type" value={form.tripType} onChange={e => setForm({...form, tripType: e.target.value})}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors appearance-none cursor-pointer">
              <option value="one-way">➡️ One-Way</option>
              <option value="round-trip">🔄 Round Trip</option>
              <option value="local">📍 Local</option>
              <option value="airport">✈️ Airport Transfer</option>
              <option value="outstation">🏔️ Outstation</option>
              <option value="wedding">💒 Wedding Car</option>
              <option value="corporate">🏢 Corporate Travel</option>
            </select>
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input aria-label="Pickup City" type="text" placeholder="Pickup City" value={form.from} onChange={e => setForm({...form, from: e.target.value})} required
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" list="cities-from-compact" autoComplete="off" />
              <datalist id="cities-from-compact">
                {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
              </datalist>
            </div>
            {form.tripType !== 'local' && (
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                <input aria-label="Drop City" type="text" placeholder="Drop City" value={form.to} onChange={e => setForm({...form, to: e.target.value})} required
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" list="cities-to-compact" autoComplete="off" />
                <datalist id="cities-to-compact">
                  {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
                </datalist>
              </div>
            )}
          </div>

          {/* Date & Car Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input aria-label="Travel Date" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
            <div className="relative">
              <Car size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select aria-label="Car Type" value={form.carType} onChange={e => setForm({...form, carType: e.target.value})}
                className="w-full pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 appearance-none cursor-pointer">
                <option value="sedan">🚗 Sedan</option>
                <option value="suv">🚙 SUV</option>
                <option value="tempo">🚐 Tempo Traveller</option>
                <option value="luxury">✨ Luxury</option>
              </select>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input aria-label="Your Name" type="text" placeholder="Your Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input aria-label="Phone Number" type="tel" placeholder="10-digit Mobile" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required pattern="[0-9]{10}"
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
          </div>
        </div>

        {status === 'success' ? renderSuccess(true) : renderSubmitButton(true)}
      </form>
    );
  }

  // ═══════════════════════════════════════════════
  // FULL FORM
  // ═══════════════════════════════════════════════
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-400 to-primary" />
      
      <h2 className="text-xl md:text-2xl font-bold text-secondary mb-2">Book Your Ride</h2>
      <p className="text-gray-500 text-sm mb-6">Fill the form below and submit your booking</p>

      <div className="space-y-4">
        {/* Trip type — Dropdown */}
        <div>
          <label htmlFor="tripType" className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
          <div className="relative">
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select id="tripType" value={form.tripType} onChange={e => setForm({...form, tripType: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors appearance-none cursor-pointer">
              <option value="one-way">➡️ One-Way</option>
              <option value="round-trip">🔄 Round Trip</option>
              <option value="local">📍 Local</option>
              <option value="airport">✈️ Airport Transfer</option>
              <option value="outstation">🏔️ Outstation</option>
              <option value="wedding">💒 Wedding Car</option>
              <option value="corporate">🏢 Corporate Travel</option>
            </select>
          </div>
        </div>

        {/* From/To — Text input with autocomplete suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700 mb-1">Pickup City</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                id="pickupCity"
                type="text" 
                placeholder="Type pickup city name" 
                value={form.from} 
                onChange={e => setForm({...form, from: e.target.value})} 
                required
                list="cities-from"
                autoComplete="off"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors"
              />
              <datalist id="cities-from">
                {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
              </datalist>
            </div>
          </div>
          {form.tripType !== 'local' && (
            <div>
              <label htmlFor="dropCity" className="block text-sm font-medium text-gray-700 mb-1">Drop City</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                <input 
                  id="dropCity"
                  type="text" 
                  placeholder="Type drop city name" 
                  value={form.to} 
                  onChange={e => setForm({...form, to: e.target.value})} 
                  required
                  list="cities-to"
                  autoComplete="off"
                  className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors"
                />
                <datalist id="cities-to">
                  {allCities.map(c => <option key={c.slug} value={`${c.name}, ${c.stateName}`} />)}
                </datalist>
              </div>
            </div>
          )}
        </div>

        {/* Date & Car */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="travelDate" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
          </div>
          <div>
            <label htmlFor="carType" className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
            <div className="relative">
              <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select id="carType" value={form.carType} onChange={e => setForm({...form, carType: e.target.value})}
                className="w-full pl-9 pr-8 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50 hover:bg-white transition-colors appearance-none cursor-pointer">
                <option value="sedan">🚗 Sedan (Swift Dzire / Amaze)</option>
                <option value="suv">🚙 SUV (Ertiga / Innova)</option>
                <option value="tempo">🚐 Tempo Traveller (12-17 Seater)</option>
                <option value="luxury">✨ Luxury (Fortuner / Mercedes)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="fullName" type="text" placeholder="Enter your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input id="phoneNumber" type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required pattern="[0-9]{10}"
                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-gray-50" />
            </div>
          </div>
        </div>

        {/* Submit / Success / Error */}
        {status === 'success' ? renderSuccess(false) : renderSubmitButton(false)}
      </div>
    </form>
  );
}

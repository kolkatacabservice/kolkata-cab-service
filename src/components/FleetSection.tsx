import Image from 'next/image';
import Link from 'next/link';
import { Phone, Users, CheckCircle } from 'lucide-react';
import { BUSINESS, getVehicles } from '@/lib/data';
import { isHubRoute } from '@/lib/routeData';

interface FleetSectionProps {
  fromName?: string;
  toName?: string;
  routeSlug?: string;
  cityName?: string;
  priceSaloon?: number;
  priceSuv?: number;
  priceTempo?: number;
  distance?: number;
}

export default function FleetSection({ fromName, toName, routeSlug, cityName, priceSaloon, priceSuv, priceTempo, distance }: FleetSectionProps) {
  const vehicles = getVehicles().filter(v => v.id !== 'wedding');
  const isRoute = !!fromName && !!toName && !!routeSlug;
  const context = isRoute ? `${fromName} to ${toName}` : cityName ? `in ${cityName}` : 'in Kolkata';

  function getPrice(vehicleId: string): string {
    if (!isRoute || !distance) return '';
    if (vehicleId === 'sedan' && priceSaloon) return `₹${priceSaloon}`;
    if (vehicleId === 'suv' && priceSuv) return `₹${priceSuv}`;
    if (vehicleId === 'tempo' && priceTempo) return `₹${priceTempo}`;
    const v = vehicles.find(x => x.id === vehicleId);
    return v ? `₹${Math.round(distance * v.pricePerKm)}` : '';
  }

  return (
    <section className="py-12 lg:py-16 bg-white" id="fleet">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
            {isRoute ? <>Choose Your Vehicle — <span className="text-gradient">{fromName} to {toName}</span></> : <>Our <span className="text-gradient">Fleet</span> — Cars Available {context}</>}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm">
            {isRoute
              ? `Select from our AC, GPS-tracked fleet for your ${distance} km journey. All fares include fuel & driver.`
              : `Well-maintained AC vehicles available 24/7 ${context}. Sedan, SUV, Innova, Crysta & Tempo available.`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => {
            const price = getPrice(vehicle.id);
            const isHub = isRoute && isHubRoute(routeSlug);
            const linkHref = isHub ? `/routes/${routeSlug}/${vehicle.id}` : isRoute ? `/routes/${routeSlug}#booking-form` : '/fleet';
            return (
              <Link key={vehicle.id} href={linkHref} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all">
                <div className="relative h-44 bg-gradient-to-br from-accent to-orange-50">
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.name} - ${vehicle.models.slice(0, 2).join(', ')} ${isRoute ? `for ${fromName} to ${toName}` : context}`}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {price && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-primary text-white text-sm font-bold rounded-full shadow-lg">
                      {price}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-primary transition-colors">{vehicle.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{vehicle.models.slice(0, 2).join(', ')}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">👥 {vehicle.capacity} Pax</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">🧳 {vehicle.luggage} Bags</span>
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">❄️ AC</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-xs text-gray-500">{isRoute ? 'One-way fare' : 'Starting from'}</span>
                      <p className="text-xl font-bold text-primary">{price || `₹${vehicle.pricePerKm}`}<span className="text-sm text-gray-500 font-normal">{price ? '' : '/km'}</span></p>
                    </div>
                    <span className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-sm group-hover:bg-primary/90 transition-colors">
                      {isRoute ? 'View Details' : 'Book Now'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {!isRoute && (
          <div className="text-center mt-8">
            <Link href="/fleet" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-semibold rounded-full hover:bg-secondary/90 transition-colors">
              View Full Fleet →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

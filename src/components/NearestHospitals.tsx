import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Hospital, EMERGENCY_HOSPITALS_INDIA, calculateDistanceKm } from '../data/hospitalsData';
import {
  Building2,
  PhoneCall,
  Navigation,
  MapPin,
  LocateFixed,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  HeartPulse,
  Baby,
  Droplets,
  ExternalLink
} from 'lucide-react';

interface NearestHospitalsProps {
  onClose?: () => void;
}

export const NearestHospitals: React.FC<NearestHospitalsProps> = ({ onClose }) => {
  const { language } = useApp();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedFacilityFilter, setSelectedFacilityFilter] = useState<'all' | 'nicu' | 'govt' | 'maternity'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Default to Bengaluru coordinates if user clicks detect or we test
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsError(language === 'hi' ? 'आपके ब्राउज़र में जीपीएस उपलब्ध नहीं है' : 'Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      error => {
        console.warn('Geolocation error:', error.message);
        // Fallback to Bengaluru city center coordinates so distance math demonstrates cleanly
        setUserLocation({ lat: 12.9716, lng: 77.5946 });
        setGpsLoading(false);
        setGpsError(
          language === 'hi'
            ? 'जीपीएस अनुमति नहीं मिली। निकटतम अस्पताल शहर चयन से देखें।'
            : 'Location permission denied. Showing city center proximity.'
        );
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filter and sort hospitals
  const processedHospitals = EMERGENCY_HOSPITALS_INDIA.map(h => {
    let distanceKm: number | null = null;
    if (userLocation) {
      distanceKm = calculateDistanceKm(userLocation.lat, userLocation.lng, h.lat, h.lng);
    }
    return {
      ...h,
      distanceKm,
    };
  })
    .filter(h => {
      // City filter
      if (selectedCity !== 'All' && h.city !== selectedCity) return false;
      // Facility filter
      if (selectedFacilityFilter === 'nicu' && !h.hasNicuLevel3) return false;
      if (selectedFacilityFilter === 'govt' && !h.acceptsAyushmanBharat) return false;
      if (selectedFacilityFilter === 'maternity' && h.type !== 'dedicated_maternity') return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          h.name.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (a.distanceKm !== null && b.distanceKm !== null) {
        return a.distanceKm - b.distanceKm;
      }
      return 0;
    });

  const cities = ['All', 'Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {language === 'te' ? 'సమీప ప్రసూతి మరియు అత్యవసర ఆసుపత్రులు' : language === 'hi' ? 'निकटतम प्रसूति एवं आपातकालीन अस्पताल' : 'Nearest Maternity & Emergency Hospitals'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'te'
              ? '24/7 ధృవీకరించబడిన అత్యవసర లేబర్ వార్డులు, NICU మరియు ప్రత్యక్ష సంప్రదింపు నంబర్లు'
              : language === 'hi'
              ? '24x7 लेबर वार्ड, एनआईसीयू (NICU) और आपातकालीन संपर्क नंबर'
              : '24/7 Verified Emergency Labor Wards, NICU Level III, and direct casualty phone numbers'}
          </p>
        </div>

        {/* GPS Detect Location Button */}
        <button
          onClick={detectLocation}
          disabled={gpsLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <LocateFixed className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
          <span>
            {gpsLoading
              ? (language === 'te' ? 'వెతుకుతోంది...' : language === 'hi' ? 'खोज रहा है...' : 'Locating...')
              : userLocation
              ? (language === 'te' ? 'స్థానాన్ని అప్‌డేట్ చేయండి' : language === 'hi' ? 'स्थान अपडेट करें' : 'Update Location')
              : (language === 'te' ? 'నా ప్రస్తుత GPS స్థానాన్ని ఉపయోగించండి' : language === 'hi' ? 'मेरी वर्तमान लोकेशन से खोजें' : 'Use Current GPS Location')}
          </span>
        </button>
      </div>

      {/* GPS Notification Bar if active */}
      {userLocation && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'hi'
                ? `लोकेशन सक्रिय: निकटतम अस्पतालों को दूरी (किमी) के अनुसार क्रमबद्ध किया गया है।`
                : `Location active: Hospitals sorted by shortest road distance from your coordinates.`}
            </span>
          </div>
          <button
            onClick={() => setUserLocation(null)}
            className="text-[11px] underline text-emerald-700 hover:text-emerald-950 font-medium"
          >
            Clear GPS
          </button>
        </div>
      )}

      {/* Emergency Ambulance Hotlines Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-red-50/70 border border-red-200 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-800 block">
              National Emergency Ambulance
            </span>
            <span className="text-lg font-extrabold text-red-950 font-mono">108 (Toll-Free)</span>
          </div>
          <a
            href="tel:108"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 108</span>
          </a>
        </div>

        <div className="flex items-center justify-between border-t sm:border-t-0 sm:border-l border-red-200 pt-3 sm:pt-0 sm:pl-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 block">
              Janani Shishu Express (Govt)
            </span>
            <span className="text-lg font-extrabold text-rose-950 font-mono">102 (Toll-Free)</span>
          </div>
          <a
            href="tel:102"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Call 102</span>
          </a>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder={language === 'hi' ? 'अस्पताल का नाम या इलाका खोजें...' : 'Search hospital by name, area, or road...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* City selector dropdown */}
          <div className="sm:col-span-4">
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'All' ? (language === 'hi' ? 'सभी शहर (All Cities)' : 'All Cities') : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setSelectedFacilityFilter('all')}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
              selectedFacilityFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {language === 'hi' ? 'सभी अस्पताल' : 'All Facilities'}
          </button>
          <button
            onClick={() => setSelectedFacilityFilter('nicu')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
              selectedFacilityFilter === 'nicu'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>NICU Level III (Newborn ICU)</span>
          </button>
          <button
            onClick={() => setSelectedFacilityFilter('govt')}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
              selectedFacilityFilter === 'govt'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {language === 'hi' ? 'सरकारी / आयुष्मान भारत' : 'Govt / Ayushman Bharat'}
          </button>
          <button
            onClick={() => setSelectedFacilityFilter('maternity')}
            className={`px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${
              selectedFacilityFilter === 'maternity'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {language === 'hi' ? 'विशिष्ट मैटरनिटी' : 'Dedicated Maternity'}
          </button>
        </div>
      </div>

      {/* Hospital List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {language === 'hi'
              ? `${processedHospitals.length} अस्पताल उपलब्ध`
              : `Found ${processedHospitals.length} verified emergency centers`}
          </span>
          {userLocation && <span className="font-mono text-emerald-700">Sorted by proximity</span>}
        </div>

        {processedHospitals.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            {language === 'hi'
              ? 'चुने गए फ़िल्टर के अनुसार कोई अस्पताल नहीं मिला। कृपया फ़िल्टर बदलें।'
              : 'No hospitals match your search criteria. Try selecting "All Cities".'}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {processedHospitals.map(h => (
              <div
                key={h.id}
                className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 block">
                        {language === 'hi' ? h.typeLabelHi : h.typeLabelEn}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {h.name}
                      </h3>
                    </div>

                    {h.distanceKm !== null && (
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-mono font-bold text-xs rounded-lg shrink-0 border border-emerald-200">
                        {h.distanceKm} km
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-3 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{h.address}</span>
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {h.hasNicuLevel3 && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-100">
                        NICU Level III
                      </span>
                    )}
                    {h.hasBloodBank && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-semibold border border-rose-100">
                        24/7 Blood Bank
                      </span>
                    )}
                    {h.acceptsAyushmanBharat && (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded text-[10px] font-semibold border border-emerald-100">
                        Ayushman PM-JAY
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact and Navigation Action Strip */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5 font-mono tabular-nums">
                    <span className="text-[10px] text-slate-400 uppercase block font-sans">
                      {language === 'hi' ? 'लेबर रूम हेल्पलाइन:' : 'Labor Room / Casualty:'}
                    </span>
                    <span className="font-bold text-slate-900">{h.laborRoomPhone}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Google Maps Directions */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${h.name}, ${h.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold rounded-xl transition-colors"
                      title="Open Directions in Google Maps"
                    >
                      <Navigation className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">{language === 'hi' ? 'दिशा' : 'Directions'}</span>
                    </a>

                    {/* Direct 1-Tap Emergency Call */}
                    <a
                      href={`tel:${h.laborRoomPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-transform active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'कॉल करें' : 'Call 24/7'}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

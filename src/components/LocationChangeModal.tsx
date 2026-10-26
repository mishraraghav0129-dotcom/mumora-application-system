import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Search,
  Check,
  AlertCircle,
  Globe,
  Compass,
  Building,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GeoCountry, GeoSubdivision, GeoDistrict } from '../data/geoData';
import { detectDeviceCoordinates, resolveCoordinatesToLocation } from '../services/locationService';

interface LocationChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSaved?: () => void;
}

export const LocationChangeModal: React.FC<LocationChangeModalProps> = ({
  isOpen,
  onClose,
  onLocationSaved,
}) => {
  const { language, userProfile, updateUserProfile } = useApp();
  const isHi = language === 'hi';

  // Cascading lists
  const [countriesList, setCountriesList] = useState<GeoCountry[]>([]);
  const [statesList, setStatesList] = useState<GeoSubdivision[]>([]);
  const [districtsList, setDistrictsList] = useState<GeoDistrict[]>([]);

  // Selection states
  const [selectedCountryCode, setSelectedCountryCode] = useState(userProfile.country_code || 'IN');
  const [selectedCountryName, setSelectedCountryName] = useState(userProfile.country_name || userProfile.country || 'India');
  const [selectedStateCode, setSelectedStateCode] = useState(userProfile.state_region_code || '');
  const [selectedStateName, setSelectedStateName] = useState(userProfile.state_region_name || userProfile.state || '');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(userProfile.district_code || '');
  const [selectedDistrictName, setSelectedDistrictName] = useState(userProfile.district_name || userProfile.district || userProfile.city || '');
  const [cityInput, setCityInput] = useState(userProfile.city || '');

  // Search filter terms
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [districtSearch, setDistrictSearch] = useState('');

  // Dropdown open states
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsFeedback, setGpsFeedback] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Coordinates
  const [latitude, setLatitude] = useState<number | undefined>(userProfile.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(userProfile.longitude);

  // Initialize from user profile on modal open
  useEffect(() => {
    if (isOpen) {
      setSelectedCountryCode(userProfile.country_code || 'IN');
      setSelectedCountryName(userProfile.country_name || userProfile.country || 'India');
      setSelectedStateCode(userProfile.state_region_code || '');
      setSelectedStateName(userProfile.state_region_name || userProfile.state || '');
      setSelectedDistrictCode(userProfile.district_code || '');
      setSelectedDistrictName(userProfile.district_name || userProfile.district || userProfile.city || '');
      setCityInput(userProfile.city || '');
      setLatitude(userProfile.latitude);
      setLongitude(userProfile.longitude);
      setErrorNotice(null);
      setGpsFeedback(null);
    }
  }, [isOpen, userProfile]);

  // Fetch worldwide countries once
  useEffect(() => {
    let isMounted = true;
    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const res = await fetch('/api/geo/countries');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.countries) {
            setCountriesList(data.countries);
          }
        }
      } catch (err) {
        console.warn('Failed to load countries list:', err);
      } finally {
        if (isMounted) setLoadingCountries(false);
      }
    }
    loadCountries();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch states whenever selected country code changes
  useEffect(() => {
    if (!selectedCountryCode) {
      setStatesList([]);
      return;
    }
    let isMounted = true;
    async function loadStates() {
      setLoadingStates(true);
      try {
        const res = await fetch(`/api/geo/states?countryCode=${encodeURIComponent(selectedCountryCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.states) {
            setStatesList(data.states);
          }
        }
      } catch (err) {
        console.warn('Failed to load states:', err);
      } finally {
        if (isMounted) setLoadingStates(false);
      }
    }
    loadStates();
    return () => {
      isMounted = false;
    };
  }, [selectedCountryCode]);

  // Fetch districts / cities whenever state changes
  useEffect(() => {
    if (!selectedCountryCode || !selectedStateCode) {
      setDistrictsList([]);
      return;
    }
    let isMounted = true;
    async function loadDistricts() {
      setLoadingDistricts(true);
      try {
        const res = await fetch(
          `/api/geo/districts?countryCode=${encodeURIComponent(selectedCountryCode)}&stateCode=${encodeURIComponent(selectedStateCode)}&stateName=${encodeURIComponent(selectedStateName)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.districts) {
            setDistrictsList(data.districts);
          }
        }
      } catch (err) {
        console.warn('Failed to load districts:', err);
      } finally {
        if (isMounted) setLoadingDistricts(false);
      }
    }
    loadDistricts();
    return () => {
      isMounted = false;
    };
  }, [selectedCountryCode, selectedStateCode, selectedStateName]);

  // Filtered dropdown lists
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return countriesList;
    const q = countrySearch.toLowerCase();
    return countriesList.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [countriesList, countrySearch]);

  const filteredStates = useMemo(() => {
    if (!stateSearch.trim()) return statesList;
    const q = stateSearch.toLowerCase();
    return statesList.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }, [statesList, stateSearch]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return districtsList;
    const q = districtSearch.toLowerCase();
    return districtsList.filter(d => d.name.toLowerCase().includes(q));
  }, [districtsList, districtSearch]);

  // Country Change: MUST reset state and city
  const handleSelectCountry = (country: GeoCountry) => {
    setSelectedCountryCode(country.code);
    setSelectedCountryName(country.name);
    setSelectedStateCode('');
    setSelectedStateName('');
    setSelectedDistrictCode('');
    setSelectedDistrictName('');
    setCityInput('');
    setIsCountryOpen(false);
    setCountrySearch('');
  };

  // State Change: MUST reset city
  const handleSelectState = (state: GeoSubdivision) => {
    setSelectedStateCode(state.code);
    setSelectedStateName(state.name);
    setSelectedDistrictCode('');
    setSelectedDistrictName('');
    setCityInput('');
    setIsStateOpen(false);
    setStateSearch('');
  };

  // District / City Selection
  const handleSelectDistrict = (district: GeoDistrict) => {
    setSelectedDistrictCode(district.code);
    setSelectedDistrictName(district.name);
    setCityInput(district.name);
    setIsDistrictOpen(false);
    setDistrictSearch('');
  };

  // Transparent GPS Detection
  const handleGpsDetect = async () => {
    setGpsLoading(true);
    setGpsFeedback(null);
    setErrorNotice(null);
    try {
      const coords = await detectDeviceCoordinates();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);

      const resolved = await resolveCoordinatesToLocation(coords.latitude, coords.longitude);

      if (resolved.countryCode) {
        setSelectedCountryCode(resolved.countryCode);
        setSelectedCountryName(resolved.country);
      }
      if (resolved.state) {
        setSelectedStateCode(resolved.stateCode || '');
        setSelectedStateName(resolved.state);
      }
      if (resolved.district || resolved.city) {
        const foundCity = resolved.district || resolved.city || '';
        setSelectedDistrictCode(resolved.districtCode || '');
        setSelectedDistrictName(foundCity);
        setCityInput(foundCity);
      }

      setGpsFeedback(
        isHi
          ? `📍 सटीक स्थान प्राप्त: ${resolved.city || resolved.district}, ${resolved.state}, ${resolved.country}`
          : `📍 Verified Location: ${resolved.city || resolved.district}, ${resolved.state}, ${resolved.country}`
      );
    } catch (err: any) {
      setGpsFeedback(
        err.message ||
          (isHi
            ? 'GPS अनुमति अस्वीकृत या अनुपलब्ध। कृपया नीचे से देश, राज्य और शहर चुनें।'
            : 'GPS permission declined or unavailable. Please select your country, state, and city manually below.')
      );
    } finally {
      setGpsLoading(false);
    }
  };

  // Save changes
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCity = cityInput.trim() || selectedDistrictName.trim();

    if (!selectedCountryName) {
      setErrorNotice(isHi ? 'कृपया देश चुनें।' : 'Please select your country.');
      return;
    }
    if (!selectedStateName) {
      setErrorNotice(isHi ? 'कृपया राज्य या क्षेत्र चुनें।' : 'Please select your state/province.');
      return;
    }
    if (!finalCity) {
      setErrorNotice(isHi ? 'कृपया जिला या शहर दर्ज करें।' : 'Please specify your district or city.');
      return;
    }

    updateUserProfile({
      country: selectedCountryName,
      country_code: selectedCountryCode,
      country_name: selectedCountryName,
      state: selectedStateName,
      state_region_code: selectedStateCode,
      state_region_name: selectedStateName,
      district: finalCity,
      district_code: selectedDistrictCode,
      district_name: finalCity,
      city: finalCity,
      latitude,
      longitude,
    });

    if (onLocationSaved) {
      onLocationSaved();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-xl bg-[#FDFBF7] border border-[#E2DBD0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#244230] via-[#2D5A3C] to-[#1E3A2B] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 text-xs font-semibold text-emerald-100">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'अंतरराष्ट्रीय स्थान चयन' : 'Global Location Settings'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isHi ? 'अपना स्थान बदलें (Change Location)' : 'Update My Location'}
            </h2>
            <p className="text-xs text-emerald-100 font-medium">
              {isHi
                ? 'स्थानीय मौसम, वायु गुणवत्ता और WHO दिशानिर्देशों से स्वास्थ्य सलाह को जोड़ने के लिए अपना क्षेत्र चुनें।'
                : 'Connects your maternal and infant guidance with live micro-climate and air quality conditions.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-7 space-y-5 overflow-y-auto">
          {/* Transparent GPS Option */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Navigation className="w-4 h-4 text-emerald-700" />
                <span>{isHi ? 'त्वरित स्वचालित GPS पहचान' : 'Auto-Detect via GPS'}</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {isHi
                  ? 'सटीक उपग्रह मौसम व वायु गुणवत्ता डेटा के लिए अक्षांश-देशांतर प्राप्त करें।'
                  : 'Retrieves verified coordinates for real-time atmospheric and micro-climate precision.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGpsDetect}
              disabled={gpsLoading}
              className="px-4 py-2 bg-[#2D5A3C] hover:bg-[#244730] text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <Compass className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
              <span>{gpsLoading ? (isHi ? 'स्थान खोज रहे हैं...' : 'Detecting...') : (isHi ? 'GPS से खोजें' : 'Use Current GPS')}</span>
            </button>
          </div>

          {gpsFeedback && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{gpsFeedback}</span>
            </div>
          )}

          {errorNotice && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* 1. Country Selector */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? '१. देश (Country) *' : '1. Country *'}
            </label>
            <div
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="w-full p-3 bg-white border border-slate-300 rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#2D5A3C] transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Globe className="w-4 h-4 text-emerald-700" />
                <span>{selectedCountryName || (isHi ? 'देश चुनें...' : 'Select Country...')}</span>
              </div>
              <span className="text-xs text-slate-400">▼</span>
            </div>

            {isCountryOpen && (
              <div className="absolute z-30 top-full mt-1 w-full bg-white border border-slate-300 rounded-2xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    placeholder={isHi ? 'देश खोजें...' : 'Search countries...'}
                    className="w-full text-xs bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-48 divide-y divide-slate-100">
                  {filteredCountries.map(c => (
                    <div
                      key={c.code}
                      onClick={() => handleSelectCountry(c)}
                      className={`p-2.5 text-xs font-medium cursor-pointer hover:bg-emerald-50 flex items-center justify-between ${
                        selectedCountryCode === c.code ? 'bg-emerald-100/60 font-bold text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag || '🌐'}</span>
                        <span>{c.name}</span>
                      </span>
                      {selectedCountryCode === c.code && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="p-3 text-xs text-slate-400 text-center">No matching country</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. State / Province Selector */}
          <div className="space-y-1.5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {isHi ? '२. राज्य / प्रांत (State / Province) *' : '2. State / Province / Region *'}
            </label>
            <div
              onClick={() => {
                if (statesList.length > 0) setIsStateOpen(!isStateOpen);
              }}
              className={`w-full p-3 bg-white border rounded-2xl flex items-center justify-between transition-colors ${
                statesList.length === 0
                  ? 'opacity-60 cursor-not-allowed border-slate-200'
                  : 'cursor-pointer hover:border-[#2D5A3C] border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Building className="w-4 h-4 text-emerald-700" />
                <span>
                  {loadingStates
                    ? (isHi ? 'लोड हो रहा है...' : 'Loading states...')
                    : selectedStateName || (isHi ? 'राज्य / प्रांत चुनें...' : 'Select State / Region...')}
                </span>
              </div>
              <span className="text-xs text-slate-400">▼</span>
            </div>

            {isStateOpen && statesList.length > 0 && (
              <div className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-300 rounded-2xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={e => setStateSearch(e.target.value)}
                    placeholder={isHi ? 'राज्य खोजें...' : 'Search states...'}
                    className="w-full text-xs bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-48 divide-y divide-slate-100">
                  {filteredStates.map(s => (
                    <div
                      key={s.code}
                      onClick={() => handleSelectState(s)}
                      className={`p-2.5 text-xs font-medium cursor-pointer hover:bg-emerald-50 flex items-center justify-between ${
                        selectedStateCode === s.code ? 'bg-emerald-100/60 font-bold text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      <span>{s.name}</span>
                      {selectedStateCode === s.code && <Check className="w-4 h-4 text-emerald-700" />}
                    </div>
                  ))}
                  {filteredStates.length === 0 && (
                    <div className="p-3 text-xs text-slate-400 text-center">No matching state</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. District / City Selector or Manual Entry */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {isHi ? '३. जिला / शहर (District / City) *' : '3. District / City *'}
              </label>
              {districtsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDistrictOpen(!isDistrictOpen)}
                  className="text-[11px] text-emerald-700 hover:underline font-semibold"
                >
                  {isDistrictOpen ? (isHi ? 'सूची छिपाएं' : 'Close List') : (isHi ? 'सूची से चुनें' : 'Select from List')}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={cityInput}
                onChange={e => {
                  setCityInput(e.target.value);
                  setSelectedDistrictName(e.target.value);
                }}
                placeholder={isHi ? 'उदा. Bengaluru Urban, Mumbai, Lucknow' : 'e.g., Bengaluru Urban, Austin, Manchester'}
                className="w-full p-3 pl-9 bg-white border border-slate-300 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#2D5A3C]"
              />
              <MapPin className="w-4 h-4 text-emerald-700 absolute left-3 top-3.5" />
            </div>

            {isDistrictOpen && districtsList.length > 0 && (
              <div className="absolute z-10 top-full mt-1 w-full bg-white border border-slate-300 rounded-2xl shadow-xl max-h-52 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={districtSearch}
                    onChange={e => setDistrictSearch(e.target.value)}
                    placeholder={isHi ? 'जिला खोजें...' : 'Search districts...'}
                    className="w-full text-xs bg-transparent focus:outline-none"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-40 divide-y divide-slate-100">
                  {filteredDistricts.map(d => (
                    <div
                      key={d.code}
                      onClick={() => handleSelectDistrict(d)}
                      className={`p-2.5 text-xs font-medium cursor-pointer hover:bg-emerald-50 flex items-center justify-between ${
                        selectedDistrictName.toLowerCase() === d.name.toLowerCase()
                          ? 'bg-emerald-100/60 font-bold text-emerald-900'
                          : 'text-slate-800'
                      }`}
                    >
                      <span>{d.name}</span>
                      {selectedDistrictName.toLowerCase() === d.name.toLowerCase() && (
                        <Check className="w-4 h-4 text-emerald-700" />
                      )}
                    </div>
                  ))}
                  {filteredDistricts.length === 0 && (
                    <div className="p-3 text-xs text-slate-400 text-center">City not in list; type manually above</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current Selection Summary */}
          <div className="p-3.5 bg-slate-100/70 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              {isHi ? 'स्थान सारांश (Location Preview):' : 'Location Preview:'}
            </span>
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                {[cityInput || selectedDistrictName, selectedStateName, selectedCountryName]
                  .filter(Boolean)
                  .join(', ') || 'Not selected'}
              </span>
            </div>
            {latitude && longitude && (
              <span className="text-[10px] text-slate-500 block">
                Coordinates: {latitude.toFixed(3)}°N, {longitude.toFixed(3)}°E
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2D5A3C] hover:bg-[#244730] text-white text-xs font-black shadow-md transition-all active:scale-98"
            >
              {isHi ? 'स्थान सहेजें' : 'Save & Refresh Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

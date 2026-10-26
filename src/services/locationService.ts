/**
 * Mumora Location & GPS Geocoding Service
 * Provides single-shot device GPS detection, reverse-geocoding,
 * and robust matching against the standardized geographical hierarchy.
 */

import {
  WORLD_COUNTRIES,
  SUBDIVISIONS_BY_COUNTRY,
  DISTRICTS_BY_SUBDIVISION,
  GeoCountry,
  GeoSubdivision,
  GeoDistrict,
} from '../data/geoData';

export interface DetectedLocationResult {
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  state: string;
  stateCode?: string;
  district: string;
  districtCode?: string;
  city: string;
  postalCode?: string;
  formattedAddress: string;
  matchedCountry?: GeoCountry;
  matchedSubdivision?: GeoSubdivision;
  matchedDistrict?: GeoDistrict;
}

export interface GeolocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED' | 'NETWORK_ERROR';
  message: string;
  instruction?: string;
}

// In-memory client cache
const clientCache = {
  countries: null as GeoCountry[] | null,
  statesByCountry: new Map<string, GeoSubdivision[]>(),
  districtsByState: new Map<string, GeoDistrict[]>(),
};

/**
 * Fetch all recognized countries worldwide (ISO 3166-1)
 */
export async function fetchCountries(): Promise<GeoCountry[]> {
  if (clientCache.countries && clientCache.countries.length > 0) {
    return clientCache.countries;
  }
  try {
    const res = await fetch('/api/geo/countries');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.countries) && data.countries.length > 0) {
        clientCache.countries = data.countries;
        return data.countries;
      }
    }
  } catch (err) {
    console.warn('Could not fetch countries from server, using local dataset fallback', err);
  }
  clientCache.countries = WORLD_COUNTRIES;
  return WORLD_COUNTRIES;
}

/**
 * Fetch all available states / provinces / regions for a given country
 */
export async function fetchStates(countryCode: string): Promise<GeoSubdivision[]> {
  const normCountry = (countryCode || '').trim().toUpperCase();
  if (!normCountry) return [];

  if (clientCache.statesByCountry.has(normCountry)) {
    return clientCache.statesByCountry.get(normCountry)!;
  }

  try {
    const res = await fetch(`/api/geo/states?countryCode=${encodeURIComponent(normCountry)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.states)) {
        clientCache.statesByCountry.set(normCountry, data.states);
        return data.states;
      }
    }
  } catch (err) {
    console.warn('Could not fetch states from server, using local dataset fallback', err);
  }

  const fallback = SUBDIVISIONS_BY_COUNTRY[normCountry] || [];
  clientCache.statesByCountry.set(normCountry, fallback);
  return fallback;
}

/**
 * Fetch all available districts / counties / local areas for a given state
 */
export async function fetchDistricts(
  countryCode: string,
  stateCode: string,
  stateName?: string
): Promise<GeoDistrict[]> {
  const normCountry = (countryCode || '').trim().toUpperCase();
  const normState = (stateCode || '').trim();
  if (!normCountry && !normState) return [];

  const cacheKey = `${normCountry}_${normState}_${stateName || ''}`;
  if (clientCache.districtsByState.has(cacheKey)) {
    return clientCache.districtsByState.get(cacheKey)!;
  }

  try {
    const query = new URLSearchParams({
      countryCode: normCountry,
      stateCode: normState,
      stateName: stateName || '',
    });
    const res = await fetch(`/api/geo/districts?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.districts)) {
        clientCache.districtsByState.set(cacheKey, data.districts);
        return data.districts;
      }
    }
  } catch (err) {
    console.warn('Could not fetch districts from server, using local dataset fallback', err);
  }

  const fullCode = normState.includes('-') ? normState : `${normCountry}-${normState}`;
  const fallback =
    DISTRICTS_BY_SUBDIVISION[fullCode] ||
    DISTRICTS_BY_SUBDIVISION[normState] ||
    (stateName ? DISTRICTS_BY_SUBDIVISION[stateName] : undefined) ||
    [];

  clientCache.districtsByState.set(cacheKey, fallback);
  return fallback;
}

/**
 * Request single-shot GPS coordinates with permission handling
 */
export async function detectDeviceCoordinates(): Promise<{ latitude: number; longitude: number }> {
  if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
    throw {
      code: 'UNSUPPORTED',
      message: 'Geolocation is not supported by your current browser or device.',
      instruction: 'Please select your country, state and district manually using the selectors.',
    } as GeolocationError;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        let code: GeolocationError['code'] = 'POSITION_UNAVAILABLE';
        let message = 'Unable to determine your device location.';
        let instruction = 'You can easily complete your registration by picking your location manually.';

        if (error.code === error.PERMISSION_DENIED) {
          code = 'PERMISSION_DENIED';
          message = 'Location permission was declined.';
          instruction =
            'To enable GPS detection, allow location access in your browser or device settings, or continue with manual selection.';
        } else if (error.code === error.TIMEOUT) {
          code = 'TIMEOUT';
          message = 'Location request timed out while waiting for GPS satellite lock.';
          instruction = 'Please check your connection or choose your location manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          code = 'POSITION_UNAVAILABLE';
          message = 'GPS signal is currently unavailable.';
          instruction = 'You can select your country, state and district using the dropdowns below.';
        }

        reject({ code, message, instruction } as GeolocationError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}

/**
 * Perform reverse geocoding via server proxy and match to standardized hierarchy
 */
export async function resolveCoordinatesToLocation(
  lat: number,
  lng: number
): Promise<DetectedLocationResult> {
  try {
    const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
    if (!res.ok) {
      throw new Error(`Reverse geocoding HTTP status ${res.status}`);
    }

    const data = await res.json();
    if (!data.success || !data.location) {
      throw new Error(data.error || 'Failed to resolve location details.');
    }

    const loc = data.location;
    const match = matchLocationToHierarchy(loc.country, loc.countryCode, loc.state, loc.district);

    return {
      latitude: lat,
      longitude: lng,
      country: loc.country || 'India',
      countryCode: loc.countryCode || 'IN',
      state: loc.state || '',
      stateCode: match.subdivision?.code,
      district: loc.district || '',
      districtCode: match.district?.code,
      city: loc.city || loc.district || '',
      postalCode: loc.postalCode,
      formattedAddress: loc.formattedAddress || `${loc.city}, ${loc.state}, ${loc.country}`,
      matchedCountry: match.country,
      matchedSubdivision: match.subdivision,
      matchedDistrict: match.district,
    };
  } catch (err: any) {
    // Intelligent coordinate heuristic fallback
    const fallback = getFallbackForCoordinates(lat, lng);
    const match = matchLocationToHierarchy(fallback.country, fallback.countryCode, fallback.state, fallback.district);

    return {
      latitude: lat,
      longitude: lng,
      country: fallback.country,
      countryCode: fallback.countryCode,
      state: fallback.state,
      stateCode: match.subdivision?.code,
      district: fallback.district,
      districtCode: match.district?.code,
      city: fallback.city,
      formattedAddress: `${fallback.city}, ${fallback.state}, ${fallback.country}`,
      matchedCountry: match.country,
      matchedSubdivision: match.subdivision,
      matchedDistrict: match.district,
    };
  }
}

/**
 * Normalize and match text components to standardized GeoData entities
 */
export function matchLocationToHierarchy(
  rawCountry: string,
  rawCountryCode: string | undefined,
  rawState: string,
  rawDistrict: string
): {
  country?: GeoCountry;
  subdivision?: GeoSubdivision;
  district?: GeoDistrict;
} {
  // 1. Match Country
  let matchedCountry = WORLD_COUNTRIES.find(
    c =>
      (rawCountryCode && c.code.toLowerCase() === rawCountryCode.toLowerCase()) ||
      c.name.toLowerCase() === rawCountry.toLowerCase()
  );

  if (!matchedCountry && rawCountry) {
    const q = rawCountry.toLowerCase();
    matchedCountry = WORLD_COUNTRIES.find(c => c.name.toLowerCase().includes(q));
  }

  if (!matchedCountry) {
    matchedCountry = WORLD_COUNTRIES.find(c => c.code === 'IN');
  }

  // 2. Match Subdivision / State
  let matchedSubdivision: GeoSubdivision | undefined;
  if (matchedCountry) {
    const subs = SUBDIVISIONS_BY_COUNTRY[matchedCountry.code] || [];
    const qState = (rawState || '').trim().toLowerCase();

    if (qState) {
      matchedSubdivision = subs.find(s => s.name.toLowerCase() === qState);
      if (!matchedSubdivision) {
        matchedSubdivision = subs.find(
          s =>
            s.name.toLowerCase().includes(qState) ||
            qState.includes(s.name.toLowerCase()) ||
            (s.code && s.code.toLowerCase().endsWith(qState))
        );
      }
    }
  }

  // 3. Match District
  let matchedDistrict: GeoDistrict | undefined;
  if (matchedSubdivision) {
    const dists = DISTRICTS_BY_SUBDIVISION[matchedSubdivision.code] || [];
    const qDist = (rawDistrict || '').trim().toLowerCase();

    if (qDist) {
      matchedDistrict = dists.find(d => d.name.toLowerCase() === qDist);
      if (!matchedDistrict) {
        matchedDistrict = dists.find(
          d =>
            d.name.toLowerCase().includes(qDist) ||
            qDist.includes(d.name.toLowerCase())
        );
      }
    }
  }

  return {
    country: matchedCountry,
    subdivision: matchedSubdivision,
    district: matchedDistrict,
  };
}

/**
 * Fetch live environmental & weather health recommendations for a location
 */
export async function fetchLocationWeather(
  country: string,
  state: string,
  district: string,
  latitude?: number,
  longitude?: number
) {
  try {
    const params = new URLSearchParams({
      country: country || 'India',
      state: state || '',
      district: district || '',
    });
    if (latitude !== undefined && longitude !== undefined) {
      params.set('lat', String(latitude));
      params.set('lng', String(longitude));
    }
    const res = await fetch(`/api/weather/live?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Weather service fetch error:', e);
  }
  return null;
}

/**
 * Approximate geographical fallback based on coarse coordinate bounding boxes
 */
function getFallbackForCoordinates(lat: number, lng: number) {
  // Coordinates in India: Lat roughly 8 to 37 N, Lng 68 to 97 E
  if (lat >= 8.0 && lat <= 37.0 && lng >= 68.0 && lng <= 97.5) {
    // Southern India / Bengaluru region
    if (lat >= 12.0 && lat <= 14.5 && lng >= 76.5 && lng <= 78.5) {
      return { country: 'India', countryCode: 'IN', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' };
    }
    // Mumbai / Maharashtra region
    if (lat >= 18.0 && lat <= 20.0 && lng >= 72.5 && lng <= 74.0) {
      return { country: 'India', countryCode: 'IN', state: 'Maharashtra', district: 'Mumbai City', city: 'Mumbai' };
    }
    // Delhi NCR
    if (lat >= 28.0 && lat <= 29.0 && lng >= 76.8 && lng <= 77.5) {
      return { country: 'India', countryCode: 'IN', state: 'Delhi (NCT)', district: 'New Delhi', city: 'Delhi' };
    }
    // Hyderabad
    if (lat >= 17.0 && lat <= 17.8 && lng >= 78.0 && lng <= 79.0) {
      return { country: 'India', countryCode: 'IN', state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad' };
    }
    // Chennai
    if (lat >= 12.8 && lat <= 13.4 && lng >= 80.0 && lng <= 80.4) {
      return { country: 'India', countryCode: 'IN', state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai' };
    }
    return { country: 'India', countryCode: 'IN', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' };
  }

  // United States
  if (lat >= 24.0 && lat <= 50.0 && lng >= -125.0 && lng <= -66.0) {
    return { country: 'United States', countryCode: 'US', state: 'California', district: 'Santa Clara County (San Jose / Silicon Valley)', city: 'San Jose' };
  }

  // United Kingdom
  if (lat >= 49.8 && lat <= 60.8 && lng >= -8.6 && lng <= 1.8) {
    return { country: 'United Kingdom', countryCode: 'GB', state: 'England', district: 'Greater London', city: 'London' };
  }

  // UAE
  if (lat >= 22.5 && lat <= 26.5 && lng >= 51.0 && lng <= 56.5) {
    return { country: 'United Arab Emirates', countryCode: 'AE', state: 'Dubai', district: 'Downtown Dubai & Business Bay', city: 'Dubai' };
  }

  return { country: 'India', countryCode: 'IN', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru' };
}

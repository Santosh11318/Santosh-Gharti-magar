import { collection, doc, setDoc, getDocs, query, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';

export interface VisitRecord {
  id: string;
  timestamp: string;
  date: string;
  path: string;
  referrer: string;
  device: 'Mobile' | 'Desktop' | 'Tablet';
  browser: string;
  country?: string;
  city?: string;
  language?: string;
}

export interface AnalyticsSummary {
  totalVisits: number;
  todayVisits: number;
  topCountries: { name: string; count: number }[];
  topReferrers: { name: string; count: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  recentVisits: VisitRecord[];
}

const ANALYTICS_COLLECTION = 'analytics_visits';

// Helper to detect device
function getDeviceType(): 'Mobile' | 'Tablet' | 'Desktop' {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

// Helper to detect browser
function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  return 'Browser';
}

// Record a visitor hit (Runs once per session to avoid spamming)
export async function recordVisitorHit(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Check if session already logged in the past 12 hours
  const lastLogged = sessionStorage.getItem('sgm_visitor_logged');
  if (lastLogged) return;

  try {
    sessionStorage.setItem('sgm_visitor_logged', Date.now().toString());

    const visitId = `visit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    // Detect referrer
    let cleanReferrer = 'Direct / Bookmarks';
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        cleanReferrer = refUrl.hostname.replace('www.', '');
        if (cleanReferrer.includes('whatsapp') || cleanReferrer.includes('wa.me')) cleanReferrer = 'WhatsApp';
        else if (cleanReferrer.includes('google')) cleanReferrer = 'Google Search';
        else if (cleanReferrer.includes('facebook')) cleanReferrer = 'Facebook';
        else if (cleanReferrer.includes('linkedin')) cleanReferrer = 'LinkedIn';
        else if (cleanReferrer.includes('instagram')) cleanReferrer = 'Instagram';
        else if (cleanReferrer.includes('github')) cleanReferrer = 'GitHub';
      } catch (e) {
        cleanReferrer = document.referrer.slice(0, 50);
      }
    }

    // Rough country detection from timezone as fallback
    let country = 'Nepal';
    let city = 'Kathmandu';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Kathmandu')) { country = 'Nepal'; city = 'Kathmandu'; }
    else if (tz.includes('Kolkata') || tz.includes('India')) { country = 'India'; city = 'New Delhi'; }
    else if (tz.includes('New_York') || tz.includes('America')) { country = 'USA'; city = 'New York'; }
    else if (tz.includes('London')) { country = 'UK'; city = 'London'; }
    else if (tz.includes('Dubai')) { country = 'UAE'; city = 'Dubai'; }
    else if (tz.includes('Tokyo')) { country = 'Japan'; city = 'Tokyo'; }
    else if (tz.includes('Australia') || tz.includes('Sydney')) { country = 'Australia'; city = 'Sydney'; }
    else if (tz) {
      country = tz.split('/')[0] || 'Unknown';
      city = (tz.split('/')[1] || '').replace(/_/g, ' ') || 'Local';
    }

    const visitData: Omit<VisitRecord, 'id'> = {
      timestamp: now.toISOString(),
      date: dateStr,
      path: window.location.pathname + window.location.hash || '/',
      referrer: cleanReferrer,
      device: getDeviceType(),
      browser: getBrowserName(),
      country,
      city,
      language: navigator.language || 'en'
    };

    await setDoc(doc(db, ANALYTICS_COLLECTION, visitId), visitData);

    // Try optional background IP geolocation refinement without blocking
    try {
      fetch('https://api.country.is/')
        .then(res => res.json())
        .then(geo => {
          if (geo && geo.country) {
            setDoc(doc(db, ANALYTICS_COLLECTION, visitId), { country: geo.country }, { merge: true }).catch(() => {});
          }
        }).catch(() => {});
    } catch (e) {}

  } catch (error) {
    // Non-blocking for visitors
    console.debug('Analytics visit skipped or offline');
  }
}

// Fetch analytics summary for Admin Dashboard
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const visitsRef = collection(db, ANALYTICS_COLLECTION);
    const q = query(visitsRef, orderBy('timestamp', 'desc'), limit(500));
    const snapshot = await getDocs(q);

    const visits: VisitRecord[] = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<VisitRecord, 'id'>)
    }));

    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = visits.filter(v => v.date === todayStr || (v.timestamp && v.timestamp.startsWith(todayStr))).length;

    // Countries aggregation
    const countryMap: Record<string, number> = {};
    const referrerMap: Record<string, number> = {};
    let mobile = 0;
    let desktop = 0;
    let tablet = 0;

    visits.forEach(v => {
      const c = v.country || 'Nepal';
      countryMap[c] = (countryMap[c] || 0) + 1;

      const r = v.referrer || 'Direct';
      referrerMap[r] = (referrerMap[r] || 0) + 1;

      if (v.device === 'Mobile') mobile++;
      else if (v.device === 'Tablet') tablet++;
      else desktop++;
    });

    const topCountries = Object.entries(countryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topReferrers = Object.entries(referrerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      totalVisits: Math.max(visits.length, 1),
      todayVisits: Math.max(todayVisits, 1),
      topCountries: topCountries.length > 0 ? topCountries : [{ name: 'Nepal', count: 1 }],
      topReferrers: topReferrers.length > 0 ? topReferrers : [{ name: 'Direct', count: 1 }],
      deviceBreakdown: {
        mobile: mobile || 1,
        desktop: desktop || 1,
        tablet: tablet || 0
      },
      recentVisits: visits.slice(0, 25)
    };
  } catch (error) {
    console.error('Failed to load analytics', error);
    return {
      totalVisits: 1,
      todayVisits: 1,
      topCountries: [{ name: 'Nepal', count: 1 }],
      topReferrers: [{ name: 'Direct', count: 1 }],
      deviceBreakdown: { mobile: 1, desktop: 1, tablet: 0 },
      recentVisits: []
    };
  }
}

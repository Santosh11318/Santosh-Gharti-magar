import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ToolAnalyticsEvent } from './types';

const TOOL_ANALYTICS_COLLECTION = 'analytics_tool_events';

export async function trackToolEvent(
  eventName: ToolAnalyticsEvent['eventName'],
  toolId: string,
  details?: Record<string, any>
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const eventData = {
      eventName,
      toolId,
      timestamp: new Date().toISOString(),
      path: window.location.pathname,
      details: details || {},
      device: window.innerWidth < 768 ? 'Mobile' : 'Desktop'
    };

    // Non-blocking fire and forget
    const docRef = doc(db, TOOL_ANALYTICS_COLLECTION, eventId);
    setDoc(docRef, eventData).catch(() => {});
  } catch {
    // Fail silently so tool operation is never interrupted
  }
}

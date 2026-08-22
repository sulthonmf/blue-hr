/**
 * Analytics Tracking Service for Mobile Application
 */

export interface MobileAnalyticsEvent {
  eventName: string;
  category: 'ATTENDANCE' | 'LEAVE' | 'AUTH' | 'NAVIGATION' | 'BIOMETRICS';
  metadata?: Record<string, any>;
  timestamp: string;
}

class MobileAnalyticsService {
  private events: MobileAnalyticsEvent[] = [];

  track(eventName: string, category: MobileAnalyticsEvent['category'], metadata?: Record<string, any>) {
    const event: MobileAnalyticsEvent = {
      eventName,
      category,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.events.push(event);
    console.log(`[Analytics Mobile] Event Tracked: ${eventName}`, event);
  }

  getEventLogs(): MobileAnalyticsEvent[] {
    return this.events;
  }
}

export const mobileAnalytics = new MobileAnalyticsService();

/**
 * Analytics Tracking Service for Web Application
 * Tracks user interactions, clock-in performance, leave requests, and navigation events
 */

export interface AnalyticsEvent {
  eventName: string;
  category: 'ATTENDANCE' | 'LEAVE' | 'AUTH' | 'NAVIGATION' | 'PERFORMANCE';
  metadata?: Record<string, any>;
  timestamp: string;
}

class WebAnalyticsService {
  private events: AnalyticsEvent[] = [];

  track(eventName: string, category: AnalyticsEvent['category'], metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      category,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.events.push(event);
    console.log(`[Analytics Web] Event Tracked: ${eventName}`, event);
  }

  getEventLogs(): AnalyticsEvent[] {
    return this.events;
  }
}

export const analytics = new WebAnalyticsService();

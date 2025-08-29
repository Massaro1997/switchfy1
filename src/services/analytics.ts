// Analytics service for tracking user interactions
const ANALYTICS_BASE_URL = 'https://ff82d478-d7da-4a3a-96ea-83d4d70f559c-00-3kgl6pxwclsqg.janeway.replit.dev';

// Generate or get session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = sessionStorage.getItem('switchfy_session');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2);
    sessionStorage.setItem('switchfy_session', sessionId);
  }
  return sessionId;
};

// Track analytics events
export const trackEvent = async (
  eventType: string, 
  metadata: Record<string, unknown> = {},
  userId?: string
) => {
  if (typeof window === 'undefined') return; // Skip on server-side rendering

  try {
    const sessionId = getSessionId();
    
    await fetch(`${ANALYTICS_BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        sessionId,
        userId,
        metadata: {
          page: window.location.pathname,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ...metadata
        }
      })
    });
  } catch (error) {
    console.log('Analytics tracking failed:', error);
  }
};

// Analytics hook for React components
export const useAnalytics = () => {
  return { 
    trackEvent,
    sessionId: typeof window !== 'undefined' ? getSessionId() : null
  };
};

// Predefined event types for consistency
export const ANALYTICS_EVENTS = {
  PAGE_VISIT: 'page_visit',
  QUIZ_START_CLICK: 'quiz_start_click',
  HERO_CARD_CLICK: 'hero_card_click',
  COMPARATOR_VIEW: 'comparator_view',
  LEAD_CONVERSION: 'lead_conversion',
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page'
} as const;
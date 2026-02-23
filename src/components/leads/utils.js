// Utility functions for leads

// Returns the start of the week for a given date
export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

// Helper to format Firestore Timestamp, Date, or string/number
export function formatDateTime(val) {
  if (!val) return '-';
  // Firestore Timestamp object
  if (typeof val === 'object' && val.seconds !== undefined && val.nanoseconds !== undefined && typeof val.toDate === 'function') {
    return val.toDate().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  }
  // JS Date
  if (val instanceof Date) {
    return val.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  }
  // ISO string or timestamp number
  try {
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  } catch {}
  return '-';
} 
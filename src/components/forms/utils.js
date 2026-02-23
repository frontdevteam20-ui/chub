// Utility function to format Firestore Timestamp, Date, or string/number
export function formatDateTime(val) {
  if (!val) return '-';
  if (typeof val === 'object' && val.seconds !== undefined && val.nanoseconds !== undefined && typeof val.toDate === 'function') {
    return val.toDate().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  }
  if (val instanceof Date) {
    return val.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  }
  try {
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    }
  } catch {}
  return '-';
} 
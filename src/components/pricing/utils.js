// Utility functions for Pricing

// Get start of week (Monday)
export function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  // Calculate days to subtract to get to Monday (1 = Monday, 0 = Sunday)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(d.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0); // Set to start of day
  return startOfWeek;
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

// Helper to filter data by date range
export function filterByDateRange(data, startDate, endDate, dateField = 'createdAt') {
  if (!startDate || !endDate) return data;
  
  return data.filter(item => {
    if (!item[dateField]) return false;
    const itemDate = new Date(item[dateField]);
    return itemDate >= startDate && itemDate <= endDate;
  });
}

// Helper to get date range display text
export function getDateRangeDisplay(startDate, endDate) {
  if (!startDate || !endDate) return '';
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
} 
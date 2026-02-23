import { rtdb } from '../../firebaseConfig';
import { ref, push, set } from 'firebase/database';

export async function logBlogActivity({ user, action, blogId, blogTitle }) {
  let ipAddress = '';
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    ipAddress = ipData.ip;
  } catch {
    ipAddress = 'Unavailable';
  }
  const userAgent = navigator.userAgent;
  let deviceType = "Desktop";
  if (/Mobi|Android/i.test(userAgent)) deviceType = "Mobile";
  else if (/Tablet|iPad/i.test(userAgent)) deviceType = "Tablet";
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const logRef = ref(rtdb, `blogActivityLogs/${user?.uid || 'unknown'}`);
  const newLogRef = push(logRef);
  await set(newLogRef, {
    email: user?.email || 'unknown',
    action,
    blogId,
    blogTitle,
    timestamp: istTime.toISOString(),
    ip: ipAddress,
    deviceType,
    userAgent,
  });
}

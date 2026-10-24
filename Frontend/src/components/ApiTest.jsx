import { useEffect } from 'react';

// Read the backend URL from the Vite environment variable
const API_URL = import.meta.env.VITE_API_URL;

// ─── Diagnostic helper ────────────────────────────────────────────────────────
// Analyses the error and prints targeted fix suggestions to the console
function diagnoseFetchError(err, url) {
  console.error('❌ Backend Connection Failed');
  console.error('Error:', err.message || err);

  console.groupCollapsed('🔍 Diagnostic Suggestions');

  // 1. VITE_API_URL missing or undefined
  if (!url || url === 'undefined') {
    console.warn(
      '⚠️  Fix: VITE_API_URL is missing or undefined.\n' +
      '   → Make sure your .env file contains: VITE_API_URL=https://your-backend.onrender.com\n' +
      '   → Restart the Vite dev server after editing .env (Ctrl+C then npm run dev).'
    );
  }

  // 2. CORS error — browser blocks the request
  if (err.message && (err.message.includes('CORS') || err.message.includes('Failed to fetch'))) {
    console.warn(
      '⚠️  Fix: This looks like a CORS error.\n' +
      '   → Make sure your Express server has: app.use(require("cors")())\n' +
      '   → Confirm the cors package is installed: npm install cors\n' +
      '   → Redeploy the backend on Render after making the change.'
    );
  }

  // 3. Network error — backend not reachable
  if (err.name === 'TypeError' && err.message.includes('fetch')) {
    console.warn(
      '⚠️  Fix: The backend server could not be reached.\n' +
      `   → Check that this URL is correct and live: ${url}\n` +
      '   → Open the URL directly in a browser tab to verify.\n' +
      '   → On Render free tier, the server sleeps after inactivity — wait ~30s for a cold start.'
    );
  }

  // 4. HTTP error status (e.g. 404, 500)
  if (err.message && err.message.includes('HTTP error')) {
    console.warn(
      '⚠️  Fix: The server responded with an error status.\n' +
      '   → Make sure the /api/test route exists in server.js.\n' +
      '   → Check your Render deployment logs for runtime errors.'
    );
  }

  // 5. Environment variable present but wrong
  if (url && url !== 'undefined') {
    console.info(
      `ℹ️  VITE_API_URL is set to: ${url}\n` +
      '   → Double-check there are no trailing slashes or typos.\n' +
      '   → If deployed on Vercel/Netlify, make sure VITE_API_URL is also set in their environment variables dashboard.'
    );
  }

  console.groupEnd();
}
// ─────────────────────────────────────────────────────────────────────────────

// Headless component — renders nothing, runs only a console-based connection test
export default function ApiTest() {
  useEffect(() => {
    // Guard: warn early if the env variable is not set
    if (!API_URL || API_URL === 'undefined') {
      diagnoseFetchError(
        new TypeError('VITE_API_URL is not defined'),
        API_URL
      );
      return;
    }

    const endpoint = `${API_URL}/api/test`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error — status: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        // ✅ Success — log the response cleanly
        console.log('%c✅ Backend Connected Successfully', 'color: #4ade80; font-weight: bold;');
        console.log('Backend Response:', data.message ?? data);
      })
      .catch((err) => {
        // ❌ Failure — run diagnostics
        diagnoseFetchError(err, API_URL);
      });
  }, []);

  // No UI is rendered — this component is purely for console verification
  return null;
}

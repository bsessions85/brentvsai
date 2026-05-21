// /api/stats — Live follower counts for brentvsai.com
// Fetches YouTube and Instagram on every request.
// TikTok has no simple public API — add manually in the CONFIG on index.html.
//
// Required Vercel environment variables:
//   YOUTUBE_API_KEY       — Google Cloud Console → YouTube Data API v3
//   YOUTUBE_CHANNEL_ID    — your channel ID (starts with UC...)
//   INSTAGRAM_ACCESS_TOKEN — long-lived token from Meta Graph API

export const config = { runtime: 'edge' };

function fmt(n) {
  if (n == null) return null;
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(n);
}

export default async function handler() {
  const results = { youtube: null, instagram: null };

  // ── YouTube ──────────────────────────────────────────────────────────────
  try {
    const key = process.env.YOUTUBE_API_KEY;
    const id  = process.env.YOUTUBE_CHANNEL_ID;
    if (key && id) {
      const res  = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${key}`
      );
      const data = await res.json();
      const raw  = parseInt(data?.items?.[0]?.statistics?.subscriberCount);
      if (!isNaN(raw)) results.youtube = fmt(raw);
    }
  } catch (_) {}

  // ── Instagram ─────────────────────────────────────────────────────────────
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (token) {
      const res  = await fetch(
        `https://graph.instagram.com/me?fields=followers_count&access_token=${token}`
      );
      const data = await res.json();
      if (data?.followers_count != null) results.instagram = fmt(data.followers_count);
    }
  } catch (_) {}

  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

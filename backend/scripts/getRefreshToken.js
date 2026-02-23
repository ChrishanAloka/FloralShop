/**
 * ONE-TIME SCRIPT — Run this once to get your Google Drive refresh token.
 *
 * Usage:
 *   cd backend
 *   node scripts/getRefreshToken.js
 *
 * It opens a browser, you sign in with your Google account,
 * and it automatically prints your refresh token. Done.
 *
 * In Google Cloud Console, your OAuth client's Authorized redirect URIs
 * must include:  http://localhost:3099/oauth2callback
 */

import { google } from 'googleapis';
import http from 'http';
import { URL } from 'url';
import open from 'open';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const PORT = 3099;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n❌  Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env first.\n');
    process.exit(1);
}

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',   // force refresh_token to always be returned
    scope: ['https://www.googleapis.com/auth/drive'],
});

// Spin up a one-shot local server to catch the OAuth redirect
const server = http.createServer(async (req, res) => {
    if (!req.url.startsWith('/oauth2callback')) return;

    const code = new URL(req.url, `http://localhost:${PORT}`).searchParams.get('code');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <html><body style="font-family:sans-serif;padding:2rem;text-align:center">
      <h2 style="color:#d4637a">✅ Authorised!</h2>
      <p>You can close this tab and go back to your terminal.</p>
    </body></html>
  `);

    server.close();

    try {
        const { tokens } = await oauth2.getToken(code);
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ✅  Success! Add this line to your backend/.env:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log(`GOOGLE_DRIVE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Run this script only once — refresh tokens don\'t expire.');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    } catch (err) {
        console.error('\n❌  Token exchange failed:', err.message, '\n');
    }
});

server.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Google Drive — One-Time Refresh Token Setup');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('  Opening your browser... sign in with the Google account');
    console.log('  that OWNS your MyFlowers Drive folder.\n');
    console.log('  (If the browser doesn\'t open, visit this URL manually:)');
    console.log(' ', authUrl, '\n');
    open(authUrl).catch(() => { });
});
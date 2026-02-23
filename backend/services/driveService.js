import { google } from 'googleapis';
import { Readable } from 'stream';

function getDrive() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error(
            'Missing Drive credentials. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ' +
            'and GOOGLE_DRIVE_REFRESH_TOKEN in your .env — ' +
            'run: node scripts/getRefreshToken.js'
        );
    }

    const oauth2 = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3099/oauth2callback');
    oauth2.setCredentials({ refresh_token: refreshToken });
    return google.drive({ version: 'v3', auth: oauth2 });
}

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

/**
 * Build a working direct-embed image URL for a Drive file ID.
 *
 * drive.google.com/uc?export=view  — BROKEN: redirects to login/virus scan
 * lh3.googleusercontent.com        — WORKS:  Google's image CDN, no login needed
 *
 * To get the lh3 URL we call files.get with field webContentLink
 * then convert it — or we use the thumbnail endpoint at a large size.
 *
 * Most reliable approach: use the thumbnail API at full size.
 * sz=w1000 means "width up to 1000px" — plenty for product images.
 */
function imageUrl(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

// ── Upload buffer → Drive, returns { fileId, imageUrl } ─────────────────────
export async function uploadToDrive(buffer, originalName, mimeType) {
    const drive = getDrive();
    const stream = Readable.from(buffer);

    const { data } = await drive.files.create({
        requestBody: {
            name: `${Date.now()}_${originalName}`,
            parents: [FOLDER_ID],
        },
        media: { mimeType, body: stream },
        fields: 'id,name',
    });

    // Make file publicly readable — required for the thumbnail URL to work
    await drive.permissions.create({
        fileId: data.id,
        requestBody: { role: 'reader', type: 'anyone' },
    });

    return {
        fileId: data.id,
        imageUrl: imageUrl(data.id),
    };
}

// ── Delete a file from Drive ────────────────────────────────────────────────
export async function deleteFromDrive(fileId) {
    if (!fileId) return;
    try {
        const drive = getDrive();
        await drive.files.delete({ fileId });
    } catch (err) {
        console.warn(`Could not delete Drive file ${fileId}: ${err.message}`);
    }
}

// ── List all images in MyFlowers folder ────────────────────────────────────
export async function listDriveImages() {
    const drive = getDrive();
    const { data } = await drive.files.list({
        q: `'${FOLDER_ID}' in parents and trashed = false and mimeType contains 'image/'`,
        fields: 'files(id,name,mimeType,createdTime)',
        orderBy: 'createdTime desc',
        pageSize: 100,
    });

    return data.files.map(f => ({
        fileId: f.id,
        name: f.name.replace(/^\d+_/, ''),
        mimeType: f.mimeType,
        createdTime: f.createdTime,
        imageUrl: imageUrl(f.id),
        thumbnailUrl: `https://drive.google.com/thumbnail?id=${f.id}&sz=w200`,
    }));
}
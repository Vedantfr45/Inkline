// Sends a phone notification to everyone in the class when a new class assignment is posted.
// Runs on GitHub Actions every 10 minutes (see .github/workflows/notify.yml).
import admin from 'firebase-admin';

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) {
  console.log('The FIREBASE_SERVICE_ACCOUNT secret is not set yet, so there is nothing to send.');
  process.exit(0);
}
let creds;
try { creds = JSON.parse(raw); } catch {
  console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole key file into the secret.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(creds) });
const db = admin.firestore();
const fcm = admin.messaging();
const SITE = process.env.SITE_URL || './';

const pending = await db.collection('classAssignments').where('notified', '==', false).get();
if (pending.empty) { console.log('No new class assignments.'); process.exit(0); }

const tokens = (await db.collection('pushTokens').get()).docs.map(d => d.id);
console.log(`${pending.size} new assignment(s), ${tokens.length} phone(s) with notifications on.`);

const prettyDate = s => {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
};
const dead = new Set();

for (const doc of pending.docs) {
  const a = doc.data();
  const title = `New ${a.subject ? a.subject + ' ' : ''}assignment`;
  const body = `${a.title} · due ${prettyDate(a.due)}`;
  for (let i = 0; i < tokens.length; i += 500) {
    const batch = tokens.slice(i, i + 500);
    const res = await fcm.sendEachForMulticast({
      tokens: batch,
      data: { title, body, url: SITE, tag: 'cls-' + doc.id },
      webpush: { headers: { Urgency: 'high', TTL: String(3 * 86400) } }
    });
    res.responses.forEach((r, j) => {
      const code = (r.error && r.error.code) || '';
      if (!r.success && /registration-token-not-registered|invalid-registration-token|invalid-argument/.test(code)) dead.add(batch[j]);
    });
    console.log(`"${a.title}": sent ${res.successCount}, failed ${res.failureCount}`);
  }
  await doc.ref.update({ notified: true, notifiedAt: admin.firestore.FieldValue.serverTimestamp() });
}

for (const t of dead) await db.collection('pushTokens').doc(t).delete().catch(() => {});
if (dead.size) console.log(`Removed ${dead.size} phone(s) that no longer accept notifications.`);
process.exit(0);

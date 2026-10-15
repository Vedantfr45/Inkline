# Inkline

Inkline is a website for tracking your assignments. Earn points for writing them.

Made for FE Division A, PRPCET. Built by Vedant.

- Everyone's **own assignments**, photos, XP, badges and plant are saved on their own phone.
- On first open, everyone sees **"Are you PRP Division A FE?"**. Tapping **Yes** and signing in with Google gets them every class assignment you post.
- When you post a new class assignment, everyone who turned on notifications gets a **phone notification** within about 10 minutes.
- The **Class** tab ranks everyone. Finishing a class assignment on time is worth 10 points and finishing late is worth 5. Each tick is stamped with Google's server time, so nobody can fake finishing early.

**Website:** https://inkline-1234.web.app

## Files

| File | What it is |
|---|---|
| `index.html` | The whole website |
| `firebase-config.js` | Firebase settings for the `inkline-d215d` project |
| `firestore.rules` | Who can read and write what in the database |
| `sw.js`, `manifest.webmanifest`, `icons/` | Notifications, the app icon and Add to Home Screen |
| `firebase.json`, `.firebaserc`, `.github/workflows/deploy.yml` | Publishes the site to Firebase Hosting every time something is merged to main |
| `.github/workflows/notify.yml`, `scripts/notify.mjs` | Sends the notifications, running on GitHub every 10 minutes |

It costs nothing. Firebase's free Spark plan and GitHub's free Actions minutes for public repositories are plenty for one class.

## Setup

Done already: the Firebase project (`inkline-d215d`), the web app, the Hosting site (`inkline-1234`) and the settings in `firebase-config.js`.

### 1. Turn on Google sign-in
1. In Firebase, open **Build → Authentication → Get started**.
2. Under **Sign-in method**, choose **Google**, switch it on, pick your email as the support email, and tap **Save**.
3. Open **Authentication → Settings → Authorized domains**. If `inkline-1234.web.app` isn't in the list, tap **Add domain** and add it.

### 2. Create the database and paste the rules
1. Open **Build → Firestore Database → Create database**.
2. For location, pick **asia-south1 (Mumbai)**. You can't change this later.
3. Start in **production mode**.
4. Open the **Rules** tab, delete what's there, paste everything from `firestore.rules`, and tap **Publish**.

### 3. Get the web push key
In Firebase, open **Project settings (gear icon) → Cloud Messaging**. Under **Web configuration → Web Push certificates**, tap **Generate key pair**. Copy the long key into `vapidKey` in `firebase-config.js`, or send it to Claude to add.

### 4. Give GitHub the Firebase key (a laptop is easier)
This one key lets GitHub publish the website and send notifications.
1. Open **Project settings → Service accounts** and tap **Generate new private key**. A `.json` file downloads.
   This file is a password for your whole Firebase project. Never upload it to the repository or send it to anyone.
2. In the GitHub repository, go to **Settings → Secrets and variables → Actions → New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Secret: open the `.json` file, copy **everything** in it, and paste it here. Then tap **Add secret**.
3. Give that key permission to publish. Go to **console.cloud.google.com**, pick the **InkLine** project, and open **IAM & Admin → IAM**. Find the account that starts with `firebase-adminsdk-` and tap its **pencil**. Tap **Add another role**, choose **Firebase Hosting Admin**, and tap **Save**.

### 5. Publish
1. Open the repository's **Actions** tab. If GitHub asks, tap **I understand my workflows, go ahead and enable them**.
2. Open **Publish to Firebase Hosting** and tap **Run workflow**. When it shows a green tick, the site is live at https://inkline-1234.web.app.
3. Open **Send class notifications** and tap **Run workflow** once too, to check it also gets a green tick.

From now on, every merge to main publishes the site by itself within a couple of minutes.

### 6. Make yourself the class admin
1. Open https://inkline-1234.web.app, tap **Yes**, and sign in with Google.
2. In Firebase, go to **Authentication → Users** and copy the **User UID** next to your email.
3. Go to **Firestore Database → Data → Start collection**:
   - Collection ID: `admins`
   - Document ID: paste your User UID
   - Add one field: `role` (string) = `admin`, then tap **Save**.
4. Reload the website. Now when you tap **New**, you'll see **Post to all of Div A**.

Want to make a CR or a friend an admin too? Add their User UID to `admins` the same way.

### 7. Test notifications, then share
1. Turn on notifications on your phone when Inkline asks, or go to **More → Turn on notifications**.
2. On a second phone, sign in with a different Google account and turn notifications on there too.
3. Post a test class assignment. The second phone should get a notification within about 10 to 20 minutes.
4. Send **https://inkline-1234.web.app** in the class WhatsApp group. Tell everyone to open it in **Chrome or Safari**, because Google sign-in doesn't work inside WhatsApp's or Instagram's built-in browser. On Android, Chrome's menu has **Add to Home screen**, so it opens like an app.

How notifications work: each phone that turns them on is saved in the database. Every 10 minutes, GitHub checks for class assignments posted since its last check and sends a notification to all those phones.

**iPhone:** notifications only work after **Share → Add to Home Screen**, then opening Inkline from the Home Screen (iOS 16.4 or newer).

The old GitHub Pages address (vedantfr45.github.io/Inkline) still works, but notifications are tied to one address, so share only the `web.app` link. You can switch GitHub Pages off under **Settings → Pages**.

## Changing things later
- **Edit a class assignment:** open it and tap **Edit** (admins only).
- **Change the class name or question:** near the top of the script in `index.html`, edit `CLASS_Q`, `CLASS_NAME` and `CLASS_SHORT`. Then commit the change.
- **Remove someone from the leaderboard:** in Firestore, open `students` and delete their document.

## Limits
- People tick "done" themselves, so the leaderboard trusts them. The server time on each tick stops anyone from faking finishing early.
- Class assignments can include photos, but not PDFs. Photos are shrunk to under about 0.8 MB each so they fit in the free database.
- Personal assignments live only in that phone's browser. Use **More → Save full backup** now and then.
- GitHub pauses scheduled workflows in a repository with no commits for 60 days. If notifications stop, open **Actions → Send class notifications** and tap **Enable workflow**.
- If someone is offline when you post, they still see the assignment marked **New** next time they open Inkline.

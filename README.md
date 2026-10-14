# Inkline

Inkline is a website for tracking your assignments. Earn points for writing them.

Made for FE Division A, PRPCET. Built by Vedant.

- Everyone's **own assignments**, photos, XP, badges and plant are saved on their own phone.
- **Class assignments** that you post show up for everyone who says yes to "Are you from FE Division A, PRPCET (Pravin Rohidas Patil College)?" and signs in with Google.
- The **Class** tab ranks everyone. Finishing a class assignment on time is worth 10 points and finishing late is worth 5. Each tick is stamped with Google's server time, so nobody can fake finishing early.

## Files

| File | What it is |
|---|---|
| `index.html` | The whole website |
| `firebase-config.js` | Your Firebase settings (you fill this in) |
| `firestore.rules` | Who can read and write what in the database |

It costs nothing. Firebase's free Spark plan is plenty for one class.

## Setup (about 20 minutes)

### 1. Make the Firebase project
1. Go to **console.firebase.google.com** and sign in with your Google account.
2. Click **Create a project** and name it `inkline`. You can turn Google Analytics off.

### 2. Get your settings into `firebase-config.js`
1. On the project home page, click the **web icon `</>`** ("Add app").
2. Name it `Inkline`. Leave "Firebase Hosting" unticked, then click **Register app**.
3. You'll see `const firebaseConfig = { apiKey: "...", ... }`. Copy each value into the matching line of `firebase-config.js`.
   These values are meant to be public. The rules in step 4 are what protect the data.

### 3. Turn on Google sign-in
1. In the left menu, open **Build → Authentication → Get started**.
2. Under **Sign-in method**, choose **Google**, switch it on, pick your email as the support email, and click **Save**.

### 4. Create the database and paste the rules
1. Open **Build → Firestore Database → Create database**.
2. For location, pick **asia-south1 (Mumbai)**. You can't change this later.
3. Start in **production mode**.
4. Open the **Rules** tab, delete what's there, paste everything from `firestore.rules`, and click **Publish**.

### 5. Put the website online with GitHub Pages
1. On github.com, make the repository **public** (Settings → General → Danger Zone → Change visibility) if it isn't already.
2. Make sure `index.html` and `firebase-config.js` are in the main branch.
3. Go to **Settings → Pages**. Under "Build and deployment", choose **Deploy from a branch**, then pick **main** and **/ (root)**, and click **Save**.
4. Wait a minute or two. Your site will be at `https://vedantfr45.github.io/Inkline/`.

### 6. Allow your website to use Google sign-in
In Firebase, go to **Authentication → Settings → Authorized domains → Add domain** and add `vedantfr45.github.io`.

### 7. Make yourself the class admin
1. Open your website, tap **Yes, I'm in Div A**, and sign in with Google.
2. In Firebase, go to **Authentication → Users** and copy the **User UID** next to your email.
3. Go to **Firestore Database → Data → Start collection**:
   - Collection ID: `admins`
   - Document ID: paste your User UID
   - Add one field: `role` (string) = `admin`, then click **Save**.
4. Reload the website. Now when you tap **New**, you'll see **Post to all of Div A**.

Want to make a CR or a friend an admin too? Add their User UID to `admins` the same way.

### 8. Share it with the class
Send the link in the class WhatsApp group. Tell everyone to open it in **Chrome or Safari**, because Google sign-in doesn't work inside WhatsApp's or Instagram's built-in browser. On Android, Chrome's menu has **Add to Home screen**, so it opens like an app.

## Changing things later
- **Edit a class assignment:** open it and tap **Edit** (admins only).
- **Change the class name or question:** near the top of the script in `index.html`, edit `CLASS_Q`, `CLASS_NAME` and `CLASS_SHORT`. Then commit the change.
- **Remove someone from the leaderboard:** in Firestore, open `students` and delete their document.

## Limits
- People tick "done" themselves, so the leaderboard trusts them. The server time on each tick stops anyone from faking finishing early.
- Class assignments can include photos, but not PDFs. Photos are shrunk to under about 0.8 MB each so they fit in the free database.
- Personal assignments live only in that phone's browser. Use **More → Save full backup** now and then.

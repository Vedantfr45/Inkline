// Paste the firebaseConfig values from your Firebase project here.
// Firebase console → Project settings (gear icon) → Your apps → SDK setup and configuration → Config
// These values are safe to be public. The database rules are what keep the data safe.

self.FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE",
  appId: "PASTE",

  // For notifications: Project settings → Cloud Messaging → Web Push certificates → Generate key pair.
  // Copy the long "Key pair" value here.
  vapidKey: "PASTE_YOUR_WEB_PUSH_KEY"
};

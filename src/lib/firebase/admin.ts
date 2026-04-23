import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore } from "firebase-admin/firestore";

// Firebase Admin SDK — initialised from service-account env vars
// These must be set as server-only env vars (no NEXT_PUBLIC_ prefix)
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  // The private key is stored with literal "\n" in .env — replace them
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const adminApp =
  getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApps()[0];

export const adminDb = getFirestore(adminApp);
export const messaging = getMessaging(adminApp);
export default adminApp;

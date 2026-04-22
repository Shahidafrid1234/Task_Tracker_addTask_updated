const admin = require("firebase-admin");

let initialized = false;

const initializeFirebaseAdmin = () => {
  if (initialized) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in backend/.env",
    );
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  initialized = true;
};

const verifyAuthHeader = async (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: Missing or invalid Authorization header");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();
  if (!token) {
    throw new Error("Unauthorized: Missing token");
  }

  initializeFirebaseAdmin();
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
};

module.exports = {
  verifyAuthHeader,
};

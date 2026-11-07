/* The web build's Firebase project (Cal's "SAYWHAT", made 2026-11-07). None of this is secret: a Firebase web config only names
   the project; what anyone may read or write is set by firestore.rules. On Firebase Hosting the page takes its config from
   /__/firebase/init.js instead, so a slip in the copy below (it was read off Cal's screenshot) only matters for local tests.
   authDomain is the hosting domain, not firebaseapp.com: Google sign-in by redirect fails on iPhone Safari and from the home
   screen when the sign-in helper runs on another domain than the page. */
window.QB_WEB = {
  firebase: {
    apiKey: "AIzaSyB7jKptM6sLaquKxQVUMZEHo71_n35SuiI",
    authDomain: "saywhat-b7ae8.web.app",
    projectId: "saywhat-b7ae8",
    storageBucket: "saywhat-b7ae8.firebasestorage.app",
    messagingSenderId: "363595943030",
    appId: "1:363595943030:web:957c811819571b049ce357"
  },
  /* Cal's uid, filled in after his first sign-in on the web build: the owner sees the Test tools and reads diag and inbox */
  owners: []
};

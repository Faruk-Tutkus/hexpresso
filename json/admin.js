const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./service_key.json")),
});

admin
  .auth()
  .updateUser("6Kc6XHwXTHcojYFkpdzofZcetIr2", {
    emailVerified: true,
  })
  .then((userRecord) => {
    console.log("✅ Email doğrulandı:", userRecord.email);
  })
  .catch((error) => {
    console.error("Hata:", error);
  });

const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");
const path = require("path");
const fs = require("fs");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hexpresso-5d0d6.firebaseio.com"
});

const firestore = admin.firestore();

// JSON dosyasını oku
const seerDataPath = path.join(__dirname, "seers/seers.json");

try {
  const jsonData = require(seerDataPath);

  if (jsonData.seer && Array.isArray(jsonData.seer)) {
    jsonData.seer.forEach(async (seer, index) => {
      const docId = seer.name.toLowerCase().replace(/\s+/g, "_"); // örn: münevver_ana

      try {
        await firestore.collection("seer").doc(docId).set(seer);
        console.log(`✅ Seer '${seer.name}' yüklendi.`);
      } catch (error) {
        console.error(`❌ ${seer.name} yüklenirken hata:`, error);
      }
    });
  } else {
    console.warn("⚠️ JSON formatı beklenen yapıda değil.");
  }
} catch (e) {
  console.error("❌ JSON dosyası okunurken hata:", e);
}

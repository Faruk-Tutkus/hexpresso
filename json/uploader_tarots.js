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
const tarotDataPath = path.join(__dirname, "tarots/tarots.json");

try {
  const jsonData = require(tarotDataPath);

  if (jsonData.tarots && Array.isArray(jsonData.tarots)) {
    jsonData.tarots.forEach(async (tarot, index) => {
      const docId = tarot.name.toLowerCase().replace(/\s+/g, "_"); // örn: baş_rahibe_(azize)

      try {
        await firestore.collection("tarots").doc(docId).set(tarot);
        console.log(`✅ Tarot kartı '${tarot.name}' yüklendi.`);
      } catch (error) {
        console.error(`❌ ${tarot.name} yüklenirken hata:`, error);
      }
    });
  } else {
    console.warn("⚠️ JSON formatı beklenen yapıda değil.");
  }
} catch (e) {
  console.error("❌ JSON dosyası okunurken hata:", e);
}

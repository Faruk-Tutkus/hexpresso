const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kitap-takip-67654.firebaseio.com"
});

const firestore = admin.firestore();
const path = require("path");
const fs = require("fs");
const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function(err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function(file) {
    const lastDotIndex = file.lastIndexOf(".");
    const fileNameWithoutExt = file.substring(0, lastDotIndex);
    const fullPath = path.join(directoryPath, file);
    
    try {
      const jsonData = require(fullPath);

      // Desteklenen periyot tipleri
      const periods = ["daily", "weekly", "monthly", "yearly"];

      periods.forEach(period => {
        if (jsonData[period] && Array.isArray(jsonData[period])) {
          jsonData[period].forEach(obj => {
            if (!obj.date) {
              console.error(`HATA: ${file} dosyasında ${period} içinde tarih bilgisi eksik`);
              return;
            }

            const docId = obj.date.replace(/\./g, "-");
            const collectionName = `${period}_${fileNameWithoutExt}`;

            firestore.collection(collectionName)
              .doc(docId)
              .set(obj)
              .then(() => {
                console.log(`✅ ${docId} eklendi -> ${collectionName}`);
              })
              .catch(error => {
                console.error(`❌ ${collectionName}/${docId} eklenirken hata:`, error);
              });
          });
        }
      });
    } catch (e) {
      console.error(`HATA: ${file} dosyası işlenirken hata oluştu:`, e);
    }
  });
});
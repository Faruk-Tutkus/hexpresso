const admin = require("firebase-admin");
const serviceAccount = require("./service_key.json");

const path = require("path");

const fs = require("fs");

admin.initializeApp({ 
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hexpresso-5d0d6.firebaseio.com"
});

// Firestore db instance
const firestore = admin.firestore();

const directoryPath = path.join(__dirname, "files");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    const fileNameWithoutExt = file.split(".")[0].toLowerCase();
    const fullPath = path.join(directoryPath, file);

    try {
      const jsonData = require(fullPath);
      const periods = ["daily", "weekly", "monthly", "yearly"];

      const documentData = {};

      periods.forEach((period) => {
        if (jsonData[period] && Array.isArray(jsonData[period])) {
          documentData[period] = jsonData[period];
        }
      });

      // info bilgisini de dokümana ekliyoruz
      if (jsonData.info) {
        documentData.info = jsonData.info;
      }

      if (Object.keys(documentData).length > 0) {
        firestore
          .collection("signs") // Tek collection
          .doc(fileNameWithoutExt) // Burç dokümanı
          .set(documentData)
          .then(() => {
            console.log(`✅ signs/${fileNameWithoutExt} yüklendi.`);
          })
          .catch((error) => {
            console.error(`❌ ${fileNameWithoutExt} yüklenirken hata:`, error);
          });
      } else {
        console.warn(`⚠️ ${fileNameWithoutExt} için içerik yok.`);
      }
    } catch (e) {
      console.error(`❌ ${file} okunurken hata:`, e);
    }
  });
});

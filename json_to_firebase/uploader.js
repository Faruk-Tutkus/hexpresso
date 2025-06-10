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
    const jsonData = require(fullPath);

    const items = Array.isArray(jsonData)
      ? jsonData
      : jsonData.weekly || [];

    if (!Array.isArray(items)) {
      console.error(`HATA: ${file} dosyasının içeriği işlenebilir bir dizi değil.`);
      return;
    }

    items.forEach(function(obj) {
      const docId = obj.date.replace(/\./g, "-"); // date'i docID olarak kullan, noktalardan kurtul

      firestore
        .collection(fileNameWithoutExt)
        .doc(docId)
        .set(obj)
        .then(() => {
          console.log(`✅ ${docId} dokümanı eklendi -> Koleksiyon: ${fileNameWithoutExt}`);
        })
        .catch(function(error) {
          console.error("❌ Doküman eklenirken hata: ", error);
        });
    });
  });
});

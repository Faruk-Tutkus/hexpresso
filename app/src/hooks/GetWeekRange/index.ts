function getWeekRange(dateStr: string) {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day); // JS aylar 0-indexli

  const dayOfWeek = date.getDay(); // 0 (Pazar) - 6 (Cumartesi)

  // Pazartesi'yi bulmak için (0 ise -6, 1 ise 0, 2 ise -1, ..., 6 ise -5)
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((dayOfWeek + 6) % 7));

  // Pazar'ı bulmak için (0 ise 0, 1 ise 6, 2 ise 5, ..., 6 ise 1)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d: Date) =>
    d.toLocaleDateString("tr-TR").split(".").join("-");

  return `${format(monday)} - ${format(sunday)}`;
}

// Kullanım:
const inputDate = "06-01-2025";
const weekRange = getWeekRange(inputDate);
console.log(weekRange); // "01-09-2025 - 07-09-2025"
type Coord = { latitude: number; longitude: number; };

export interface FullAstroResult {
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  age: number;
  birthWeekday: string;
  daysToNextBirthday: number;
}

export function getFullAstro(date: string, time: string, coord: Coord): FullAstroResult {
  // Her ikisini T ile birleştir
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  const sunSign = getSunSign(datetime);
  const moonSign = getMoonSign(date, time);
  const asc = getAscendant(date, time, coord);
  const birthWeekday = getBirthWeekday(date, time);
  const age = getAge(date, time);
  const daysToNext = getDaysToNextBirthday(date, time);

  return {
    sunSign,
    moonSign,
    ascendantSign: asc,
    age,
    birthWeekday,
    daysToNextBirthday: daysToNext
  };
}

/** Güneş burcu */
export function getSunSign(d: Date): string {
  const day = d.getUTCDate();
  const month = d.getUTCMonth() + 1;

  if ((month === 3 && day >= 21) ||
    (month === 4 && day <= 19)) {
    return 'Aries';
  }
  if ((month === 4 && day >= 20) ||
    (month === 5 && day <= 20)) {
    return 'Taurus';
  }
  if ((month === 5 && day >= 21) ||
    (month === 6 && day <= 21)) {
    return 'Gemini';
  }
  if ((month === 6 && day >= 22) ||
    (month === 7 && day <= 22)) {
    return 'Cancer';
  }
  if ((month === 7 && day >= 23) ||
    (month === 8 && day <= 22)) {
    return 'Leo';
  }
  if ((month === 8 && day >= 23) ||
    (month === 9 && day <= 22)) {
    return 'Virgo';
  }
  if ((month === 9 && day >= 23) ||
    (month === 10 && day <= 23)) {
    return 'Libra';
  }
  if ((month === 10 && day >= 24) ||
    (month === 11 && day <= 21)) {
    return 'Scorpius';
  }
  if ((month === 11 && day >= 22) ||
    (month === 12 && day <= 21)) {
    return 'Sagittarius';
  }
  if ((month === 12 && day >= 22) ||
    (month === 1 && day <= 19)) {
    return 'Capricornus';
  }
  if ((month === 1 && day >= 20) ||
    (month === 2 && day <= 18)) {
    return 'Aquarius';
  }
  if ((month === 2 && day >= 19) ||
    (month === 3 && day <= 20)) {
    return 'Pisces';
  }

  return 'Invalid';
}


/** Ay burcu */
function getMoonSign(date: string, time: string): string {
  try {
    const datetime = new Date(
      `${date.split("T")[0]}T${time.split("T")[1]}`
    );

    // Geçersiz tarih kontrolü
    if (isNaN(datetime.getTime())) {
      console.warn('Invalid datetime for moon sign calculation');
      return 'aries';
    }

    const jd = getJulian(datetime);
    const D = jd - 2451543.5;
    const lon = (218.316 + 13.176396 * D) % 360;

    return zodiacFromDeg(lon);
  } catch (error) {
    console.error('Error calculating moon sign:', error);
    return 'aries';
  }
}

/** Yükselen burç */
function getAscendant(date: string, time: string, { latitude: φ, longitude }: Coord): string {
  try {
    const datetime = new Date(
      `${date.split("T")[0]}T${time.split("T")[1]}`
    );

    // Geçersiz tarih kontrolü
    if (isNaN(datetime.getTime())) {
      console.warn('Invalid datetime for ascendant calculation');
      return 'aries';
    }

    // Koordinat kontrolü
    if (!Number.isFinite(φ) || !Number.isFinite(longitude)) {
      console.warn('Invalid coordinates for ascendant calculation');
      return 'aries';
    }

    const jd = getJulian(datetime);
    const GST = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
    const RAMC = GST + longitude;

    const ε = 23.437 * Math.PI / 180;
    const φr = φ * Math.PI / 180;
    const rRamc = RAMC * Math.PI / 180;

    const num = Math.cos(rRamc);
    const den = -(Math.sin(ε) * Math.tan(φr) + Math.cos(ε) * Math.sin(rRamc));

    let asc = Math.atan2(num, den) * 180 / Math.PI;
    if (asc < 0) asc += 360;

    return zodiacFromDeg(asc);
  } catch (error) {
    console.error('Error calculating ascendant:', error);
    return 'aries';
  }
}

/** Doğum Günü */
function getBirthWeekday(date: string, time: string): string {
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  return ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][datetime.getDay()];
}

/** Yaş */
function getAge(date: string, time: string): number {
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  const today = new Date();

  let age = today.getFullYear() - datetime.getFullYear();

  if (
    today.getMonth() < datetime.getMonth() ||
    (today.getMonth() === datetime.getMonth() &&
      today.getDate() < datetime.getDate())
  ) age--;

  return age;
}

/** Sonraki Doğum Günü */
function getDaysToNextBirthday(date: string, time: string): number {
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  const today = new Date();

  let next = new Date(today.getFullYear(), datetime.getMonth(), datetime.getDate());
  if (next < today)
    next = new Date(today.getFullYear() + 1, datetime.getMonth(), datetime.getDate());

  return Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Yardımcılar */
function getJulian(d: Date): number {
  const y = d.getUTCFullYear(), m = d.getUTCMonth() + 1;
  const D = d.getUTCDate() + d.getUTCHours() / 24 + d.getUTCMinutes() / 1440 + d.getUTCSeconds() / 86400;

  let Y = y, M = m;

  if (M <= 2) {
    Y--;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
}

function zodiacFromDeg(deg: number): string {
  // NaN veya infinite değerleri kontrol et
  if (!Number.isFinite(deg)) {
    console.warn('Invalid degree value for zodiac calculation:', deg);
    return 'aries'; // varsayılan değer
  }

  // Derece değerini 0-360 aralığına normalize et
  const normalizedDeg = ((deg % 360) + 360) % 360;
  const idx = Math.floor(normalizedDeg / 30) % 12;

  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

  // Index kontrolü
  if (idx < 0 || idx >= signs.length) {
    console.warn('Invalid zodiac index:', idx, 'for degree:', deg);
    return 'aries'; // varsayılan değer
  }

  return signs[idx];
}

type Coord = { latitude: number;longitude: number;};

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
  const day = d.getUTCDate(), m = d.getUTCMonth()+1;

  if((m===3 && day >=21) ||
     (m===4 && day <=19)) return 'aries';
  if((m===4 && day >=20) ||
     (m===5 && day <=20 )) return 'taurus';
  if((m===5 && day >=21) ||
     (m===6 && day <=21 )) return 'gemini';
  if((m===6 && day >=22) ||
     (m===7 && day <=22 )) return 'cancer';
  if((m===7 && day >=23) ||
     (m===8 && day <=22 )) return 'leo';
  if((m===8 && day >=23) ||
     (m===9 && day <=22 )) return 'virgo';
  if((m===9 && day >=23) ||
     (m===10 && day <=23 )) return 'libra';
  if((m===10 && day >=24) ||
     (m===11 && day <=21 )) return 'scorpio';
  if((m===11 && day >=22) ||
     (m===12 && day <=21 )) return 'sagittarius';
  if((m===12 && day >=22) ||
     (m===1 && day <=19 )) return 'capricorn';
  if((m===1 && day >=20) ||
     (m===2 && day <=18 )) return 'aquarius';
  if((m===2 && day >=19) ||
     (m===3 && day <=20 )) return 'pisces';
  
  return 'invalid';
}

/** Ay burcu */
function getMoonSign(date: string, time: string): string {
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  const jd = getJulian(datetime);
  const D = jd - 2451543.5;
  const lon = (218.316 + 13.176396 * D) % 360;

  return zodiacFromDeg(lon);
}

/** Yükselen burç */
function getAscendant(date: string, time: string, { latitude: φ,longitude }: Coord): string {
  const datetime = new Date(
    `${date.split("T")[0]}T${time.split("T")[1]}`
  );

  const jd = getJulian(datetime);
  const GST = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
  const RAMC = GST +longitude;

  const ε = 23.437 * Math.PI/180;
  const φr = φ * Math.PI/180;
  const rRamc = RAMC * Math.PI/180;

  const num = Math.cos(rRamc);
  const den = -(Math.sin(ε)*Math.tan(φr) + Math.cos(ε)*Math.sin(rRamc));

  let asc = Math.atan2(num, den) * 180/Math.PI;
  if (asc < 0) asc += 360;

  return zodiacFromDeg(asc);
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
    next = new Date(today.getFullYear()+1, datetime.getMonth(), datetime.getDate());  

  return Math.ceil((next.getTime() - today.getTime()) / (1000*60*60*24));  
}

/** Yardımcılar */
function getJulian(d: Date): number {
  const y = d.getUTCFullYear(), m = d.getUTCMonth()+1;
  const D = d.getUTCDate() + d.getUTCHours()/24 + d.getUTCMinutes()/1440 + d.getUTCSeconds()/86400;

  let Y = y, M = m;

  if (M <= 2) { 
    Y--;
    M += 12;
  }
  
  const A = Math.floor(Y/100);
  const B = 2-A+Math.floor(A/4);
  
  return Math.floor(365.25*(Y+4716 )) + Math.floor(30.6001*(M+1 )) + D + B - 1524.5;
}

function zodiacFromDeg(deg: number): string {
  const idx = Math.floor(deg / 30) % 12;
  return ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'][idx];
}

import { db } from '@api/config.firebase'
import { format } from 'date-fns'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const markHoroscopeRequestedToday = async (uid: string, response: string) => {
  const today = format(new Date(), 'yyyy-MM-dd') // Bug fix: removed .getDay()
  await setDoc(doc(db, 'users', uid), {
    lastHoroscopeAIRequest: today,
    lastHoroscopeAIResponse: response
  }, { merge: true })
}

const canRequestHoroscopeToday = async (uid: string) => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  const today = format(new Date(), 'yyyy-MM-dd')
  const lastRequest = userSnap.data()?.lastHoroscopeAIRequest
  const lastResponse = userSnap.data()?.lastHoroscopeAIResponse
  // Eğer kullanıcının bugün hiç isteği yoksa veya son istek bugün değilse true döner
  return {lastRequest: lastRequest !== today, lastResponse}
}

export { canRequestHoroscopeToday, markHoroscopeRequestedToday }


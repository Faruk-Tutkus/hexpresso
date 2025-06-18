import { db } from "@api/config.firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { MMKV } from "react-native-mmkv";
const storage = new MMKV({ id: 'signs_data' });
interface FetchDataProps {
  user: any;
  setLoading: (loading: boolean) => void;
  setSigns: (signs: any[]) => void;
}
function cacheData(id: string, data: any) {
  try {
    storage.set(id, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}
const fetchData = async ({ user, setLoading, setSigns }: FetchDataProps): Promise<boolean> => {
  if (user) {
    try {
      setLoading(true);
      const docRef = collection(db, "signs");
      const docSnap = (await getDocs(docRef)).docs.map((item) => item.data())

      if (!docSnap || docSnap.length === 0) {
        setLoading(false);
        return false;
      }

      setSigns(docSnap);
      setLoading(false);
      const existingData = storage.getString('signs_data');

      const docSet = doc(db, 'settings', 'update')
      const docSnapSet = await getDoc(docSet)


      // Eğer kullanıcı varsa veriyi cache'e kaydet
      if (!existingData || docSnapSet?.data()?.update) {
        cacheData('signs_data', docSnap);
      }
      return true;
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      return false;
    }
  }
  return false;
}

export default fetchData;
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { MMKV } from "react-native-mmkv";
const Logout = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    router.replace('/src/screens/side/StartScreen');
    const storage = new MMKV({ id: 'signs_data' });
    storage.clearAll();
  }).catch((error) => {
    console.log(error);
  }); 

}

export default Logout
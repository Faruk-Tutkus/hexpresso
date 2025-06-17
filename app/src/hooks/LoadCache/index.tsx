import { MMKV } from "react-native-mmkv";
interface LoadCacheProps {
    id: string;
    setSigns: (signs: any[]) => void;
    setLoading: (loading: boolean) => void;
}

const storage = new MMKV({ id: 'signs_data' });
const loadCache = async ({ id, setSigns, setLoading }: LoadCacheProps) => {
    try {
        const item = storage.getString(id);
        setSigns(item ? JSON.parse(item) : null);
        setLoading(false);
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
}
export default loadCache;
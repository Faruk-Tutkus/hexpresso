import { MMKV } from "react-native-mmkv";

const storage = new MMKV({ id: 'theme_preferences' });

interface ThemeDataProps {
  setTheme: (theme: 'light' | 'dark') => void;
  defaultTheme?: 'light' | 'dark';
}

// Theme'i cache'e kaydet
function cacheTheme(theme: 'light' | 'dark') {
  try {
    storage.set('theme', theme);
  } catch (error) {
    console.error('Error caching theme:', error);
  }
}

// Theme'i cache'den oku
function getCachedTheme(): 'light' | 'dark' | null {
  try {
    const theme = storage.getString('theme');
    return theme === 'light' || theme === 'dark' ? theme : null;
  } catch (error) {
    console.error('Error reading cached theme:', error);
    return null;
  }
}

// Theme'i yükle
const loadTheme = ({ setTheme, defaultTheme = 'dark' }: ThemeDataProps): 'light' | 'dark' => {
  try {
    // Önce cache'den kontrol et
    const cachedTheme = getCachedTheme();
    
    if (cachedTheme) {
      setTheme(cachedTheme);
      return cachedTheme;
    }
    
    // Cache'de yoksa varsayılan tema kullan
    setTheme(defaultTheme);
    cacheTheme(defaultTheme);
    return defaultTheme;
  } catch (error) {
    console.error('Error loading theme:', error);
    setTheme(defaultTheme);
    return defaultTheme;
  }
};

// Theme'i güncelle ve cache'e kaydet
const updateTheme = (theme: 'light' | 'dark') => {
  cacheTheme(theme);
};

// Cache'i temizle
const clearThemeCache = () => {
  try {
    storage.delete('theme');
  } catch (error) {
    console.error('Error clearing theme cache:', error);
  }
};

export { clearThemeCache, getCachedTheme, loadTheme, updateTheme };


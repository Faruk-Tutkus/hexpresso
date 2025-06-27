import { auth, db } from '@api/config.firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'social' | 'story' | 'tweet' | 'referral';
  platform?: string;
  completed: boolean;
  completedAt?: Date;
  icon?: string;
  url?: string;
}

export interface UserTaskData {
  tasks: { [taskId: string]: { completed: boolean; completedAt?: Date } };
}

const defaultTasks: Task[] = [
  {
    id: 'instagram_follow',
    title: 'Instagram\'ı Takip Et',
    description: 'Hexpresso Instagram hesabını takip et ve 50 coin kazan',
    reward: 50,
    type: 'social',
    platform: 'instagram',
    completed: false,
    icon: 'logo-instagram',
    url: 'https://instagram.com/hexpresso'
  },
  {
    id: 'twitter_follow', 
    title: 'Twitter\'ı Takip Et',
    description: 'Hexpresso Twitter hesabını takip et ve 50 coin kazan',
    reward: 50,
    type: 'social',
    platform: 'twitter',
    completed: false,
    icon: 'logo-twitter',
    url: 'https://twitter.com/hexpresso'
  },
  {
    id: 'facebook_share',
    title: 'Facebook\'ta Paylaş',
    description: 'Hexpresso hakkında Facebook\'ta paylaş ve 75 coin kazan',
    reward: 75,
    type: 'social', 
    platform: 'facebook',
    completed: false,
    icon: 'logo-facebook',
    url: 'https://www.facebook.com/sharer/sharer.php?u=https://hexpresso.app'
  },
  {
    id: 'instagram_story',
    title: 'Story\'de Paylaş',
    description: 'Bu resmi Instagram story\'inde paylaş ve 100 coin kazan',
    reward: 100,
    type: 'story',
    completed: false,
    icon: 'camera'
  },
  {
    id: 'twitter_tweet',
    title: 'Tweet Paylaş',
    description: 'Hexpresso hakkında tweet at ve 100 coin kazan',
    reward: 100,
    type: 'tweet',
    completed: false,
    icon: 'chatbubble-ellipses'
  }
];

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [userCoins, setUserCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = auth.currentUser;

  // Kullanıcı verilerini yükle
  const loadUserTaskData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserCoins(userData.coins || 0);
        
        // Task durumlarını güncelle
        const taskData = userData.task || {};
        const updatedTasks = defaultTasks.map(task => ({
          ...task,
          completed: taskData.tasks?.[task.id]?.completed || false,
          completedAt: taskData.tasks?.[task.id]?.completedAt
        }));
        
        setTasks(updatedTasks);
      } else {
        // İlk kez oluşturulan kullanıcı - varsayılan veriyi kaydet
        await initializeUserTasks();
      }
    } catch (err) {
      console.error('Task verileri yüklenirken hata:', err);
      setError('Task verileri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı task verilerini ilk kez oluştur
  const initializeUserTasks = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const initialTaskData: UserTaskData = {
        tasks: {},
      };

      if (userDoc.exists()) {
        // Mevcut kullanıcı - sadece task ve coins alanlarını güncelle
        await updateDoc(userRef, {
          task: initialTaskData,
          coins: userDoc.data().coins || 250 // Eğer coins yoksa 250 ver
        });
        setUserCoins(userDoc.data().coins || 250);
      } else {
        // Yeni kullanıcı - tam profil oluştur
        await setDoc(userRef, {
          task: initialTaskData,
          coins: 250,
          createdAt: new Date()
        });
        setUserCoins(250);
      }
      
      setTasks(defaultTasks);
    } catch (err) {
      console.error('Task verileri oluşturulurken hata:', err);
      setError('Task verileri oluşturulamadı');
    }
  };

  // Task tamamla
  const completeTask = async (taskId: string): Promise<boolean> => {
    if (!user) {
      setError('Kullanıcı girişi gerekli');
      return false;
    }

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || task.completed) {
        setError('Task bulunamadı veya zaten tamamlanmış');
        return false;
      }

      // Local state'i güncelle
      const updatedTasks = tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completedAt: new Date() }
          : t
      );
      
      const newCoins = userCoins + task.reward;
      
      setTasks(updatedTasks);
      setUserCoins(newCoins);

      // Firebase'i güncelle - ana user dokümanda
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentData = userDoc.data();
        const currentTaskData = currentData.task || { tasks: {}, lastUpdated: new Date() };
        
        const updatedTaskData = {
          ...currentTaskData,
          tasks: {
            ...currentTaskData.tasks,
            [taskId]: {
              completed: true,
              completedAt: new Date()
            }
          },
          lastUpdated: new Date()
        };

        await updateDoc(userRef, {
          task: updatedTaskData,
          coins: newCoins,
        });
      }

      return true;
    } catch (err) {
      console.error('Task tamamlanırken hata:', err);
      setError('Task tamamlanamadı');
      
      // Hata durumunda state'i geri al
      await loadUserTaskData();
      return false;
    }
  };

  // Kullanıcı coinlerini güncelle (referral için)
  const addCoins = async (amount: number, reason: string = 'bonus'): Promise<boolean> => {
    if (!user) return false;

    try {
      const newCoins = userCoins + amount;
      setUserCoins(newCoins);

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        coins: newCoins,
      });

      return true;
    } catch (err) {
      console.error('Coin eklenirken hata:', err);
      setError('Coin eklenemedi');
      return false;
    }
  };

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    if (user) {
      loadUserTaskData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Task istatistikleri
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    tasks,
    userCoins,
    loading,
    error,
    completedTasks,
    totalTasks,
    progress,
    completeTask,
    addCoins,
    refreshTasks: loadUserTaskData
  };
}; 
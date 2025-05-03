import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  learningLevel: string;
  preferredLearningStyle: string;
  learningGoals: string[];
  lastUpdated: string;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user-profile');
        if (!response.ok) throw new Error('获取用户配置失败');
        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        setError('获取用户配置失败');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return {
    userProfile,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      fetchUserProfile();
    },
  };
}; 
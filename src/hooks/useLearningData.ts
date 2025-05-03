import { useState, useEffect } from 'react';

interface LearningData {
  progress: number;
  difficulty: number;
  performance: number;
  lastUpdated: string;
}

export const useLearningData = () => {
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const response = await fetch('/api/learning-data');
        if (!response.ok) throw new Error('获取学习数据失败');
        const data = await response.json();
        setLearningData(data);
      } catch (error) {
        setError('获取学习数据失败');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, []);

  return {
    learningData,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      fetchLearningData();
    },
  };
}; 
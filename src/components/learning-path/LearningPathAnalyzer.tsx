import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLearningData } from '@/hooks/useLearningData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LearningPathData, LearningPathAnalysis } from '@/types/learning-path';

export const LearningPathAnalyzer: React.FC = () => {
  const [pathData, setPathData] = useState<LearningPathData[]>([]);
  const [analysis, setAnalysis] = useState<LearningPathAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { learningData } = useLearningData();
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchPathData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/learning-path/data');
        if (!response.ok) throw new Error('获取数据失败');
        const data = await response.json();
        setPathData(data);
      } catch (error) {
        setError('获取学习路径数据失败');
        console.error('Error:', error);
      }
      setLoading(false);
    };

    fetchPathData();
  }, []);

  const analyzeLearningPath = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/learning-path/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          learningData,
          userProfile,
        }),
      });
      
      if (!response.ok) throw new Error('分析失败');
      const analysisData = await response.json();
      setAnalysis(analysisData);
    } catch (error) {
      setError('分析学习路径失败');
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        智能学习路径分析
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                学习进度趋势
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pathData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="progress" stroke="#8884d8" name="进度" />
                    <Line type="monotone" dataKey="difficulty" stroke="#82ca9d" name="难度" />
                    <Line type="monotone" dataKey="performance" stroke="#ffc658" name="表现" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                分析结果
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : analysis ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    当前进度: {analysis.currentProgress}%
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    当前表现: {analysis.currentPerformance}%
                  </Typography>
                  
                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    学习难点:
                  </Typography>
                  <ul>
                    {analysis.difficulties.map((difficulty, index) => (
                      <li key={index}>{difficulty}</li>
                    ))}
                  </ul>

                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                    建议学习路径:
                  </Typography>
                  <ul>
                    {analysis.adjustment.suggestedPath.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>

                  <Typography variant="body1" gutterBottom>
                    难度调整: {analysis.adjustment.difficultyAdjustment > 0 ? '+' : ''}
                    {analysis.adjustment.difficultyAdjustment}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    预计完成时间: {analysis.adjustment.estimatedTime} 天
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={analyzeLearningPath}
                    sx={{ mt: 2 }}
                  >
                    重新分析
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    点击按钮开始分析您的学习路径
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={analyzeLearningPath}
                    sx={{ mt: 2 }}
                  >
                    分析学习路径
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 
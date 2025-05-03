import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useLearningData } from '@/hooks/useLearningData';
import { useUserProfile } from '@/hooks/useUserProfile';

interface LearningPathData {
  date: string;
  progress: number;
  difficulty: number;
  performance: number;
}

interface PathAdjustment {
  suggestedPath: string[];
  difficultyAdjustment: number;
  additionalResources: string[];
  estimatedTime: number;
}

export const DynamicPathAdjuster: React.FC = () => {
  const [pathData, setPathData] = useState<LearningPathData[]>([]);
  const [adjustment, setAdjustment] = useState<PathAdjustment | null>(null);
  const [loading, setLoading] = useState(false);
  const { learningData } = useLearningData();
  const { userProfile } = useUserProfile();

  useEffect(() => {
    const fetchPathData = async () => {
      setLoading(true);
      try {
        // 模拟API调用获取学习路径数据
        const response = await fetch('/api/learning-path/data');
        const data = await response.json();
        setPathData(data);
      } catch (error) {
        console.error('获取学习路径数据失败:', error);
      }
      setLoading(false);
    };

    fetchPathData();
  }, []);

  const analyzeLearningPath = async () => {
    setLoading(true);
    try {
      // 模拟API调用分析学习路径
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
      const adjustmentData = await response.json();
      setAdjustment(adjustmentData);
    } catch (error) {
      console.error('分析学习路径失败:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        动态学习路径调整
      </Typography>

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
                <LineChart
                  width={600}
                  height={300}
                  data={pathData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progress" stroke="#8884d8" name="进度" />
                  <Line type="monotone" dataKey="difficulty" stroke="#82ca9d" name="难度" />
                  <Line type="monotone" dataKey="performance" stroke="#ffc658" name="表现" />
                </LineChart>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                路径调整建议
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : adjustment ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    建议学习路径：
                  </Typography>
                  <ul>
                    {adjustment.suggestedPath.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <Typography variant="body1" gutterBottom>
                    难度调整：{adjustment.difficultyAdjustment > 0 ? '+' : ''}
                    {adjustment.difficultyAdjustment}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    预计完成时间：{adjustment.estimatedTime} 天
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
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  FormControl, 
  FormControlLabel, 
  Grid, 
  Radio, 
  RadioGroup, 
  Slider, 
  Stack, 
  Typography, 
  Chip,
  Checkbox
} from '@mui/material';
import { learningAnalyticsService } from '@/services/learningAnalyticsService';

// 练习类型
type PracticeType = 'vocabulary' | 'grammar' | 'listening' | 'translation' | 'mixed';

// 练习项目接口
interface PracticeItem {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'reorder' | 'matching' | 'dictation';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  hint?: string;
  sourceLesson?: string;
  tags: string[];
}

// 练习集接口
interface PracticeSet {
  id: string;
  title: string;
  description: string;
  items: PracticeItem[];
  estimatedTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  focusAreas: string[];
}

/**
 * 智能练习生成器组件
 * 基于用户学习数据生成个性化的练习内容
 */
const SmartPracticeGenerator: React.FC = () => {
  // 状态
  const [loading, setLoading] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [practiceType, setPracticeType] = useState<PracticeType>('mixed');
  const [difficulty, setDifficulty] = useState<number>(2); // 1-易, 2-中, 3-难
  const [practiceLength, setPracticeLength] = useState<number>(10); // 练习题目数量
  const [includeRecentlyLearned, setIncludeRecentlyLearned] = useState<boolean>(true);
  const [focusOnWeakAreas, setFocusOnWeakAreas] = useState<boolean>(true);
  const [includeExplanations, setIncludeExplanations] = useState<boolean>(true);
  const [generatedPractice, setGeneratedPractice] = useState<PracticeSet | null>(null);
  const [weakAreas, setWeakAreas] = useState<{area: string, score: number}[]>([]);
  const [selectedWeakAreas, setSelectedWeakAreas] = useState<string[]>([]);

  // 从分析服务获取用户弱项
  useEffect(() => {
    const fetchWeakAreas = async () => {
      setLoading(true);
      try {
        // 在实际应用中，可能需要从身份验证上下文获取用户ID
        const userId = 'current-user-id';
        const stats = await learningAnalyticsService.getUserStats(userId);
        setWeakAreas(stats.weakestAreas);
        
        // 默认选择前三个弱项
        if (stats.weakestAreas && stats.weakestAreas.length > 0) {
          setSelectedWeakAreas(stats.weakestAreas.slice(0, 3).map(area => area.area));
        }
      } catch (error) {
        console.error('获取用户弱项失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakAreas();
  }, []);

  // 生成练习集
  const generatePractice = async () => {
    setGenerating(true);
    try {
      // 在实际应用中，这里应该调用后端API来生成练习
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 模拟生成的练习集数据
      const mockPractice: PracticeSet = {
        id: `practice-${Date.now()}`,
        title: `${getDifficultyLabel(difficulty)}${getPracticeTypeLabel(practiceType)}练习`,
        description: focusOnWeakAreas 
          ? `专注于提高你的${selectedWeakAreas.join('、')}能力的个性化练习` 
          : '综合能力提升练习',
        items: generateMockItems(),
        estimatedTime: practiceLength * 1.5, // 每题约1.5分钟
        difficulty: getDifficultyValue(),
        focusAreas: selectedWeakAreas.length > 0 ? selectedWeakAreas : ['综合能力']
      };
      
      setGeneratedPractice(mockPractice);
    } catch (error) {
      console.error('生成练习失败:', error);
    } finally {
      setGenerating(false);
    }
  };

  // 生成模拟练习项目
  const generateMockItems = (): PracticeItem[] => {
    const items: PracticeItem[] = [];
    const difficultyValue = getDifficultyValue();
    
    // 根据练习类型和难度生成不同类型的题目
    for (let i = 0; i < practiceLength; i++) {
      let itemType: PracticeItem['type'];
      let tags: string[] = [...selectedWeakAreas];
      
      // 根据练习类型选择题目类型
      switch (practiceType) {
        case 'vocabulary':
          itemType = Math.random() > 0.5 ? 'multiple-choice' : 'matching';
          tags.push('vocabulary');
          break;
        case 'grammar':
          itemType = Math.random() > 0.5 ? 'fill-blank' : 'reorder';
          tags.push('grammar');
          break;
        case 'listening':
          itemType = 'dictation';
          tags.push('listening');
          break;
        case 'translation':
          itemType = 'fill-blank';
          tags.push('translation');
          break;
        case 'mixed':
        default:
          // 混合模式随机选择题目类型
          const types: PracticeItem['type'][] = ['multiple-choice', 'fill-blank', 'reorder', 'matching', 'dictation'];
          itemType = types[Math.floor(Math.random() * types.length)];
          break;
      }
      
      // 创建练习项目
      const item: PracticeItem = {
        id: `item-${i}`,
        type: itemType,
        question: generateMockQuestion(itemType, difficultyValue),
        correctAnswer: itemType === 'matching' ? ['答案1', '答案2', '答案3'] : '正确答案',
        difficulty: difficultyValue,
        tags: tags
      };
      
      // 根据题目类型添加特定属性
      if (itemType === 'multiple-choice') {
        item.options = ['选项A', '选项B', '选项C', '选项D'];
      }
      
      // 如果需要解释，添加解释
      if (includeExplanations) {
        item.explanation = '这是题目解析，解释了为什么这个答案是正确的，以及相关的语法/词汇知识点。';
        item.hint = '考虑句子的时态和主谓一致。';
      }
      
      // 如果包含最近学习内容，添加来源
      if (includeRecentlyLearned && Math.random() > 0.5) {
        item.sourceLesson = `课程${Math.floor(Math.random() * 5) + 1} - 课时${Math.floor(Math.random() * 10) + 1}`;
      }
      
      items.push(item);
    }
    
    return items;
  };

  // 生成模拟问题文本
  const generateMockQuestion = (type: PracticeItem['type'], difficulty: PracticeItem['difficulty']): string => {
    const difficultyFactor = difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难';
    
    switch (type) {
      case 'multiple-choice':
        return `【${difficultyFactor}】选择词语"example"的正确含义：`;
      case 'fill-blank':
        return `【${difficultyFactor}】完成句子：I _____ to the store yesterday.`;
      case 'reorder':
        return `【${difficultyFactor}】重新排列单词组成正确的句子：went / she / to / school / yesterday`;
      case 'matching':
        return `【${difficultyFactor}】将下列英文单词与其中文含义匹配：`;
      case 'dictation':
        return `【${difficultyFactor}】听录音，完成句子：`;
      default:
        return `【${difficultyFactor}】示例问题`;
    }
  };

  // 获取难度标签
  const getDifficultyLabel = (value: number): string => {
    switch (value) {
      case 1: return '基础';
      case 2: return '进阶';
      case 3: return '挑战';
      default: return '进阶';
    }
  };

  // 获取练习类型标签
  const getPracticeTypeLabel = (type: PracticeType): string => {
    switch (type) {
      case 'vocabulary': return '词汇';
      case 'grammar': return '语法';
      case 'listening': return '听力';
      case 'translation': return '翻译';
      case 'mixed': return '综合';
      default: return '综合';
    }
  };

  // 获取难度值
  const getDifficultyValue = (): PracticeItem['difficulty'] => {
    switch (difficulty) {
      case 1: return 'easy';
      case 2: return 'medium';
      case 3: return 'hard';
      default: return 'medium';
    }
  };

  // 处理弱项选择变化
  const handleWeakAreaToggle = (area: string) => {
    setSelectedWeakAreas(prev => 
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  // 重置练习
  const handleReset = () => {
    setGeneratedPractice(null);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        智能练习生成器
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : generatedPractice ? (
        // 显示生成的练习集
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {generatedPractice.title}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {generatedPractice.description}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              {generatedPractice.focusAreas.map(area => (
                <Chip key={area} label={area} color="primary" size="small" />
              ))}
            </Stack>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  难度级别: <strong>{generatedPractice.difficulty}</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  预计时间: <strong>{generatedPractice.estimatedTime} 分钟</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  题目数量: <strong>{generatedPractice.items.length}</strong>
                </Typography>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom>
              练习预览:
            </Typography>
            
            {/* 显示前3个题目预览 */}
            {generatedPractice.items.slice(0, 3).map((item, index) => (
              <Card key={item.id} variant="outlined" sx={{ mb: 2, bgcolor: 'background.default' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {index + 1}. {item.question}
                  </Typography>
                  
                  {item.type === 'multiple-choice' && item.options && (
                    <Box sx={{ ml: 3 }}>
                      {item.options.map((option, idx) => (
                        <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                          {String.fromCharCode(65 + idx)}. {option}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      size="small" 
                      label={item.type} 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      size="small" 
                      label={item.difficulty} 
                      color={
                        item.difficulty === 'easy' ? 'success' : 
                        item.difficulty === 'medium' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            {generatedPractice.items.length > 3 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                还有 {generatedPractice.items.length - 3} 道题未显示...
              </Typography>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={handleReset}>
                重新设置
              </Button>
              <Button variant="contained" color="primary">
                开始练习
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        // 练习生成设置
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              练习设置
            </Typography>
            
            <Grid container spacing={3}>
              {/* 练习类型选择 */}
              <Grid item xs={12}>
                <Typography id="practice-type-label" gutterBottom>
                  练习类型:
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    value={practiceType}
                    onChange={(e) => setPracticeType(e.target.value as PracticeType)}
                  >
                    <FormControlLabel value="vocabulary" control={<Radio />} label="词汇" />
                    <FormControlLabel value="grammar" control={<Radio />} label="语法" />
                    <FormControlLabel value="listening" control={<Radio />} label="听力" />
                    <FormControlLabel value="translation" control={<Radio />} label="翻译" />
                    <FormControlLabel value="mixed" control={<Radio />} label="综合" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              {/* 难度选择 */}
              <Grid item xs={12}>
                <Typography id="difficulty-slider-label" gutterBottom>
                  难度级别: {getDifficultyLabel(difficulty)}
                </Typography>
                <Slider
                  value={difficulty}
                  onChange={(_, value) => setDifficulty(value as number)}
                  step={1}
                  marks
                  min={1}
                  max={3}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => getDifficultyLabel(value)}
                  aria-labelledby="difficulty-slider-label"
                  sx={{ maxWidth: 400 }}
                />
              </Grid>
              
              {/* 题目数量选择 */}
              <Grid item xs={12}>
                <Typography id="length-slider-label" gutterBottom>
                  题目数量: {practiceLength}题
                </Typography>
                <Slider
                  value={practiceLength}
                  onChange={(_, value) => setPracticeLength(value as number)}
                  step={5}
                  marks
                  min={5}
                  max={30}
                  valueLabelDisplay="auto"
                  aria-labelledby="length-slider-label"
                  sx={{ maxWidth: 400 }}
                />
              </Grid>
              
              {/* 选项设置 */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  更多选项:
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeRecentlyLearned}
                      onChange={(e) => setIncludeRecentlyLearned(e.target.checked)}
                    />
                  }
                  label="包含最近学习的内容"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={focusOnWeakAreas}
                      onChange={(e) => setFocusOnWeakAreas(e.target.checked)}
                    />
                  }
                  label="专注于弱项"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeExplanations}
                      onChange={(e) => setIncludeExplanations(e.target.checked)}
                    />
                  }
                  label="包含题目解析"
                />
              </Grid>
              
              {/* 弱项选择 */}
              {focusOnWeakAreas && weakAreas.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    专注的弱项:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {weakAreas.map((area) => (
                      <Chip
                        key={area.area}
                        label={`${area.area} (${area.score.toFixed(1)})`}
                        onClick={() => handleWeakAreaToggle(area.area)}
                        color={selectedWeakAreas.includes(area.area) ? "primary" : "default"}
                        sx={{ my: 0.5 }}
                      />
                    ))}
                  </Stack>
                </Grid>
              )}
              
              {/* 生成按钮 */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={generatePractice}
                  disabled={generating || (focusOnWeakAreas && selectedWeakAreas.length === 0)}
                  startIcon={generating && <CircularProgress size={20} color="inherit" />}
                >
                  {generating ? '生成中...' : '生成练习'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SmartPracticeGenerator; 
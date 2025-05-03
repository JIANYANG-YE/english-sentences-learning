import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Snackbar,
  Chip,
  Paper,
  Tooltip,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  SettingsOutlined,
  School,
  Timer,
  TrendingUp,
  Psychology,
  LocalLibrary,
  Translate,
  Notifications,
  Save,
  Refresh,
  HelpOutline,
  PlayArrow,
  VolumeUp,
  Language,
  Info
} from '@mui/icons-material';

// 学习偏好接口
interface LearningPreferences {
  // 难度设置
  contentDifficulty: number; // 1-5 内容难度
  grammarComplexity: number; // 1-5 语法复杂度
  vocabularyLevel: number; // 1-5 词汇难度
  
  // 学习方式
  dailyGoal: number; // 每日目标学习句子数
  sessionDuration: number; // 每次学习会话时长（分钟）
  repetitionInterval: 'low' | 'medium' | 'high'; // 重复练习间隔
  
  // 内容偏好
  preferredTopics: string[]; // 偏好主题
  learningMode: 'balanced' | 'intensive' | 'extensive'; // 学习模式
  
  // 辅助功能
  showPinyin: boolean; // 显示拼音
  autoPlayAudio: boolean; // 自动播放音频
  enableNotifications: boolean; // 启用提醒
  showTranslationHints: boolean; // 显示翻译提示
  
  // 适应性学习
  adaptiveLearning: boolean; // 启用适应性学习
  focusOnWeakPoints: boolean; // 专注于薄弱点
  
  // 语言设置
  interfaceLanguage: 'zh-CN' | 'en-US'; // 界面语言
}

// 模拟API调用 - 获取用户学习偏好
const fetchUserPreferences = (userId: string): Promise<LearningPreferences> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        contentDifficulty: 3,
        grammarComplexity: 2,
        vocabularyLevel: 3,
        
        dailyGoal: 20,
        sessionDuration: 15,
        repetitionInterval: 'medium',
        
        preferredTopics: ['日常对话', '商务英语', '旅游'],
        learningMode: 'balanced',
        
        showPinyin: true,
        autoPlayAudio: true,
        enableNotifications: true,
        showTranslationHints: true,
        
        adaptiveLearning: true,
        focusOnWeakPoints: true,
        
        interfaceLanguage: 'zh-CN'
      });
    }, 1000);
  });
};

// 模拟API调用 - 保存用户学习偏好
const saveUserPreferences = (
  userId: string, 
  preferences: LearningPreferences
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '学习偏好设置已成功保存'
      });
    }, 1500);
  });
};

// 难度标签
const difficultyLabels = ['入门', '初级', '中级', '中高级', '高级'];

// 难度解释
const difficultyExplanations = {
  contentDifficulty: [
    '基础句型，适合零基础学习者',
    '简单日常用语，适合初学者',
    '一般日常交流句子，适合具备基础词汇的学习者',
    '包含较复杂表达的句子，适合中级学习者',
    '高级表达和习语，适合高级学习者'
  ],
  grammarComplexity: [
    '仅使用基本语法结构',
    '简单时态和基础句式',
    '包含多种时态和从句',
    '复杂句式和语法结构',
    '高级语法现象和非常规表达'
  ],
  vocabularyLevel: [
    '基础1000词汇范围',
    '初级2000词汇范围',
    '中级4000词汇范围',
    '进阶6000词汇范围',
    '高级10000+词汇范围'
  ]
};

// 学习模式说明
const learningModeInfo = {
  balanced: '均衡模式：各类学习活动平均分配',
  intensive: '强化模式：集中练习和频繁测试',
  extensive: '广泛模式：多样化内容和灵活学习路径'
};

// 可选主题列表
const availableTopics = [
  '日常对话',
  '商务英语',
  '旅游',
  '学术英语',
  '科技',
  '文化与艺术',
  '健康与医疗',
  '体育',
  '环境',
  '新闻英语',
  '社交媒体',
  '电影与娱乐'
];

interface PersonalizedLearningSettingsProps {
  userId: string;
  onSettingsSaved?: (preferences: LearningPreferences) => void;
}

const PersonalizedLearningSettings: React.FC<PersonalizedLearningSettingsProps> = ({
  userId,
  onSettingsSaved
}) => {
  const [preferences, setPreferences] = useState<LearningPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState<string>('');
  const [topicDialogOpen, setTopicDialogOpen] = useState<boolean>(false);
  
  // 预览设置
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const userPreferences = await fetchUserPreferences(userId);
        setPreferences(userPreferences);
        setError(null);
      } catch (err) {
        setError('无法加载学习偏好设置，请稍后再试');
        console.error('Error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  const handleSave = async () => {
    if (!preferences) return;

    try {
      setSaving(true);
      const result = await saveUserPreferences(userId, preferences);
      
      if (result.success) {
        setSuccess(result.message);
        if (onSettingsSaved) {
          onSettingsSaved(preferences);
        }
      } else {
        setError('保存设置失败：' + result.message);
      }
    } catch (err) {
      setError('保存设置时发生错误，请稍后再试');
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const defaultPreferences = await fetchUserPreferences(userId);
      setPreferences(defaultPreferences);
      setSuccess('设置已重置为默认值');
    } catch (err) {
      setError('重置设置失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LearningPreferences, value: any) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

  const handleTopicToggle = (topic: string) => {
    if (!preferences) return;
    
    const updatedTopics = preferences.preferredTopics.includes(topic)
      ? preferences.preferredTopics.filter(t => t !== topic)
      : [...preferences.preferredTopics, topic];
    
    setPreferences({
      ...preferences,
      preferredTopics: updatedTopics
    });
  };

  const handleAddTopic = () => {
    if (!newTopic.trim() || !preferences) return;
    
    if (!preferences.preferredTopics.includes(newTopic)) {
      setPreferences({
        ...preferences,
        preferredTopics: [...preferences.preferredTopics, newTopic]
      });
    }
    
    setNewTopic('');
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>加载学习偏好设置...</Typography>
      </Box>
    );
  }

  if (!preferences) {
    return (
      <Alert severity="error">
        无法加载学习偏好设置。请刷新页面重试。
      </Alert>
    );
  }

  const renderPreview = () => {
    if (!showPreview) return null;
    
    return (
      <Card sx={{ mb: 4, mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            学习体验预览
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                示例句子（{difficultyLabels[preferences.contentDifficulty - 1]}难度）
              </Typography>
              
              {preferences.contentDifficulty <= 2 && (
                <Box>
                  <Typography variant="body1">This is a simple sentence for beginners.</Typography>
                  {preferences.showPinyin && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      这是一个简单的句子，适合初学者。
                    </Typography>
                  )}
                </Box>
              )}
              
              {preferences.contentDifficulty === 3 && (
                <Box>
                  <Typography variant="body1">
                    The meeting has been rescheduled to next Tuesday afternoon.
                  </Typography>
                  {preferences.showPinyin && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      会议已重新安排在下周二下午。
                    </Typography>
                  )}
                </Box>
              )}
              
              {preferences.contentDifficulty >= 4 && (
                <Box>
                  <Typography variant="body1">
                    Despite the unforeseen challenges that emerged during the implementation phase, 
                    the team managed to deliver the project ahead of schedule.
                  </Typography>
                  {preferences.showPinyin && (
                    <Typography variant="caption" color="textSecondary" display="block">
                      尽管在实施阶段出现了不可预见的挑战，团队还是提前完成了项目交付。
                    </Typography>
                  )}
                </Box>
              )}
              
              {preferences.autoPlayAudio && (
                <IconButton size="small" sx={{ mt: 1 }}>
                  <VolumeUp />
                </IconButton>
              )}
            </Box>
            
            {preferences.showTranslationHints && (
              <Box sx={{ mb: 2 }}>
                <Chip 
                  size="small" 
                  color="primary" 
                  label="翻译提示已启用" 
                  icon={<Translate fontSize="small" />} 
                />
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Timer fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                每日目标: {preferences.dailyGoal} 句 | 
                学习时长: {preferences.sessionDuration} 分钟
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                学习模式: {
                  preferences.learningMode === 'balanced' ? '均衡' :
                  preferences.learningMode === 'intensive' ? '强化' : '广泛'
                }
              </Typography>
            </Box>
          </Paper>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          <SettingsOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
          个性化学习设置
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<PlayArrow />}
            onClick={() => setShowPreview(!showPreview)}
            sx={{ mr: 1 }}
          >
            {showPreview ? '隐藏预览' : '显示预览'}
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Refresh />}
            onClick={handleReset}
            sx={{ mr: 1 }}
          >
            重置
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
            onClick={handleSave}
            disabled={saving}
          >
            保存设置
          </Button>
        </Box>
      </Box>
      
      {renderPreview()}
      
      <Grid container spacing={3}>
        {/* 难度设置卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1 }} />
                难度设置
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography id="content-difficulty-label">
                    内容难度
                  </Typography>
                  <Tooltip title={difficultyExplanations.contentDifficulty[preferences.contentDifficulty - 1]}>
                    <Chip 
                      label={difficultyLabels[preferences.contentDifficulty - 1]} 
                      size="small" 
                      color={
                        preferences.contentDifficulty <= 2 ? 'success' :
                        preferences.contentDifficulty <= 3 ? 'primary' :
                        'secondary'
                      }
                    />
                  </Tooltip>
                </Box>
                <Slider
                  value={preferences.contentDifficulty}
                  onChange={(_, value) => handleChange('contentDifficulty', value as number)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  aria-labelledby="content-difficulty-label"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography id="grammar-complexity-label">
                    语法复杂度
                  </Typography>
                  <Tooltip title={difficultyExplanations.grammarComplexity[preferences.grammarComplexity - 1]}>
                    <Chip 
                      label={difficultyLabels[preferences.grammarComplexity - 1]} 
                      size="small" 
                      color={
                        preferences.grammarComplexity <= 2 ? 'success' :
                        preferences.grammarComplexity <= 3 ? 'primary' :
                        'secondary'
                      }
                    />
                  </Tooltip>
                </Box>
                <Slider
                  value={preferences.grammarComplexity}
                  onChange={(_, value) => handleChange('grammarComplexity', value as number)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  aria-labelledby="grammar-complexity-label"
                />
              </Box>
              
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography id="vocabulary-level-label">
                    词汇难度
                  </Typography>
                  <Tooltip title={difficultyExplanations.vocabularyLevel[preferences.vocabularyLevel - 1]}>
                    <Chip 
                      label={difficultyLabels[preferences.vocabularyLevel - 1]} 
                      size="small" 
                      color={
                        preferences.vocabularyLevel <= 2 ? 'success' :
                        preferences.vocabularyLevel <= 3 ? 'primary' :
                        'secondary'
                      }
                    />
                  </Tooltip>
                </Box>
                <Slider
                  value={preferences.vocabularyLevel}
                  onChange={(_, value) => handleChange('vocabularyLevel', value as number)}
                  min={1}
                  max={5}
                  step={1}
                  marks
                  aria-labelledby="vocabulary-level-label"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 学习方式卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Timer sx={{ mr: 1 }} />
                学习方式
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="daily-goal-label" gutterBottom>
                  每日目标（句子数量）
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={preferences.dailyGoal}
                    onChange={(_, value) => handleChange('dailyGoal', value as number)}
                    min={5}
                    max={50}
                    step={5}
                    sx={{ flexGrow: 1 }}
                    aria-labelledby="daily-goal-label"
                  />
                  <Typography sx={{ minWidth: '40px', textAlign: 'right' }}>
                    {preferences.dailyGoal}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography id="session-duration-label" gutterBottom>
                  学习会话时长（分钟）
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider
                    value={preferences.sessionDuration}
                    onChange={(_, value) => handleChange('sessionDuration', value as number)}
                    min={5}
                    max={60}
                    step={5}
                    sx={{ flexGrow: 1 }}
                    aria-labelledby="session-duration-label"
                  />
                  <Typography sx={{ minWidth: '40px', textAlign: 'right' }}>
                    {preferences.sessionDuration}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="repetition-interval-label">重复练习间隔</InputLabel>
                  <Select
                    labelId="repetition-interval-label"
                    value={preferences.repetitionInterval}
                    label="重复练习间隔"
                    onChange={(e) => handleChange('repetitionInterval', e.target.value)}
                  >
                    <MenuItem value="low">低（更频繁的重复）</MenuItem>
                    <MenuItem value="medium">中（均衡的重复）</MenuItem>
                    <MenuItem value="high">高（较少的重复）</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="learning-mode-label">学习模式</InputLabel>
                  <Select
                    labelId="learning-mode-label"
                    value={preferences.learningMode}
                    label="学习模式"
                    onChange={(e) => handleChange('learningMode', e.target.value)}
                  >
                    <MenuItem value="balanced">均衡模式</MenuItem>
                    <MenuItem value="intensive">强化模式</MenuItem>
                    <MenuItem value="extensive">广泛模式</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  {learningModeInfo[preferences.learningMode]}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 内容偏好卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalLibrary sx={{ mr: 1 }} />
                内容偏好
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                偏好主题（选择1-5个）
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {availableTopics.map((topic) => (
                  <Chip
                    key={topic}
                    label={topic}
                    color={preferences.preferredTopics.includes(topic) ? 'primary' : 'default'}
                    onClick={() => handleTopicToggle(topic)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  size="small"
                  placeholder="添加自定义主题"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  sx={{ flexGrow: 1 }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleAddTopic}
                  disabled={!newTopic.trim()}
                >
                  添加
                </Button>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                已选主题
              </Typography>
              {preferences.preferredTopics.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {preferences.preferredTopics.map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      onDelete={() => handleTopicToggle(topic)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  未选择任何主题，将提供多样化内容
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* 辅助功能卡片 */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1 }} />
                学习辅助设置
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showPinyin}
                      onChange={(e) => handleChange('showPinyin', e.target.checked)}
                    />
                  }
                  label="显示中文翻译"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.autoPlayAudio}
                      onChange={(e) => handleChange('autoPlayAudio', e.target.checked)}
                    />
                  }
                  label="自动播放音频"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.showTranslationHints}
                      onChange={(e) => handleChange('showTranslationHints', e.target.checked)}
                    />
                  }
                  label="显示翻译提示"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.enableNotifications}
                      onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                    />
                  }
                  label="启用学习提醒"
                />
              </FormGroup>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                适应性学习
              </Typography>
              
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.adaptiveLearning}
                      onChange={(e) => handleChange('adaptiveLearning', e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      启用适应性学习
                      <Tooltip title="系统将根据您的学习情况自动调整内容难度和学习进度">
                        <IconButton size="small">
                          <HelpOutline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={preferences.focusOnWeakPoints}
                      onChange={(e) => handleChange('focusOnWeakPoints', e.target.checked)}
                      disabled={!preferences.adaptiveLearning}
                    />
                  }
                  label="专注于薄弱点"
                />
              </FormGroup>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="interface-language-label">
                    <Language fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    界面语言
                  </InputLabel>
                  <Select
                    labelId="interface-language-label"
                    value={preferences.interfaceLanguage}
                    label="界面语言"
                    onChange={(e) => handleChange('interfaceLanguage', e.target.value)}
                  >
                    <MenuItem value="zh-CN">简体中文</MenuItem>
                    <MenuItem value="en-US">English (US)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Info fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="subtitle2">
            关于个性化学习设置
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          个性化设置将帮助系统为您提供最合适的学习内容和体验。您可以随时调整这些设置，
          系统会根据您的学习进度和表现进行智能推荐，并逐步调整难度。启用适应性学习可以
          让系统自动根据您的学习情况优化内容，提高学习效率。
        </Typography>
      </Box>
      
      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalizedLearningSettings; 
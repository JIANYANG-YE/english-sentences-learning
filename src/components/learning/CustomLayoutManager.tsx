'use client';

import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Button,
  IconButton,
  Switch,
  Tooltip,
  Tabs,
  Tab,
  Chip,
  Divider
} from '@mui/material';

// 简化的图标组件
const SettingsIcon = () => <span>⚙️</span>;
const ColorPaletteIcon = () => <span>🎨</span>;
const TextFormatIcon = () => <span>📝</span>;
const LayoutIcon = () => <span>📊</span>;
const CloseIcon = () => <span>✖️</span>;
const ResetIcon = () => <span>🔄</span>;
const SaveIcon = () => <span>💾</span>;

// 可用颜色主题
const COLOR_THEMES = [
  { id: 'default', name: '默认蓝', primary: '#3b82f6', secondary: '#8b5cf6' },
  { id: 'green', name: '翠绿', primary: '#10b981', secondary: '#059669' },
  { id: 'red', name: '暖红', primary: '#ef4444', secondary: '#dc2626' },
  { id: 'purple', name: '紫罗兰', primary: '#8b5cf6', secondary: '#7c3aed' },
  { id: 'orange', name: '暖橙', primary: '#f97316', secondary: '#ea580c' },
  { id: 'teal', name: '蓝绿', primary: '#14b8a6', secondary: '#0d9488' },
  { id: 'pink', name: '粉红', primary: '#ec4899', secondary: '#db2777' },
  { id: 'indigo', name: '靛蓝', primary: '#6366f1', secondary: '#4f46e5' },
];

// 字体家族选项
const FONT_FAMILIES = [
  { id: 'system', name: '系统默认', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { id: 'serif', name: '衬线字体', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { id: 'mono', name: '等宽字体', value: 'Menlo, Monaco, Consolas, "Liberation Mono", monospace' }
];

// 布局模式
const LAYOUT_MODES = [
  { id: 'standard', name: '标准模式', description: '默认教学布局' },
  { id: 'focusMode', name: '专注模式', description: '隐藏非必要元素，专注于内容' },
  { id: 'sideBySide', name: '并排模式', description: '内容和练习并排显示' },
  { id: 'compact', name: '紧凑模式', description: '适合小屏幕设备' }
];

// 布局设置接口
export interface LayoutSettings {
  colorTheme: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  layoutMode: string;
  showTranslations: boolean;
  darkMode: boolean;
  contrastMode: boolean;
  animationsEnabled: boolean;
}

// 默认设置
const DEFAULT_SETTINGS: LayoutSettings = {
  colorTheme: 'default',
  fontSize: 16,
  lineHeight: 1.5,
  fontFamily: 'system',
  layoutMode: 'standard',
  showTranslations: true,
  darkMode: true,
  contrastMode: false,
  animationsEnabled: true
};

// 从localStorage读取或使用默认设置
const getInitialSettings = (): LayoutSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const savedSettings = localStorage.getItem('userLayoutSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('读取设置失败:', error);
    return DEFAULT_SETTINGS;
  }
};

// 持久化用户设置
const saveSettings = (settings: LayoutSettings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('userLayoutSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

interface CustomLayoutManagerProps {
  onSettingsChange?: (settings: LayoutSettings) => void;
}

const CustomLayoutManager: React.FC<CustomLayoutManagerProps> = ({ 
  onSettingsChange 
}) => {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<LayoutSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState(0);
  const [tempSettings, setTempSettings] = useState<LayoutSettings>(DEFAULT_SETTINGS);
  
  // 初始化设置
  useEffect(() => {
    const initialSettings = getInitialSettings();
    setSettings(initialSettings);
    setTempSettings(initialSettings);
    
    // 通知父组件初始设置
    if (onSettingsChange) {
      onSettingsChange(initialSettings);
    }
  }, [onSettingsChange]);
  
  // 打开设置对话框
  const handleOpen = () => {
    setTempSettings({...settings});
    setOpen(true);
  };
  
  // 关闭设置对话框
  const handleClose = () => {
    setOpen(false);
  };
  
  // 保存设置
  const handleSave = () => {
    setSettings(tempSettings);
    saveSettings(tempSettings);
    
    // 通知父组件设置已更改
    if (onSettingsChange) {
      onSettingsChange(tempSettings);
    }
    
    setOpen(false);
  };
  
  // 重置设置
  const handleReset = () => {
    setTempSettings(DEFAULT_SETTINGS);
  };
  
  // 切换标签页
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // 更新临时设置
  const updateTempSetting = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 获取当前主题颜色信息
  const currentTheme = COLOR_THEMES.find(theme => theme.id === tempSettings.colorTheme) || COLOR_THEMES[0];
  
  // 获取当前字体信息
  const currentFont = FONT_FAMILIES.find(font => font.id === tempSettings.fontFamily) || FONT_FAMILIES[0];
  
  return (
    <>
      {/* 设置按钮 */}
      <Tooltip title="自定义学习界面">
        <IconButton
          onClick={handleOpen}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      
      {/* 设置对话框 */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">自定义学习界面</Typography>
          <IconButton onClick={handleClose} edge="end">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          centered
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<ColorPaletteIcon />} label="主题颜色" />
          <Tab icon={<TextFormatIcon />} label="文本设置" />
          <Tab icon={<LayoutIcon />} label="界面布局" />
        </Tabs>
        
        <DialogContent>
          {/* 主题颜色设置 */}
          {activeTab === 0 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                选择颜色主题
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {COLOR_THEMES.map(theme => (
                  <Box 
                    key={theme.id}
                    onClick={() => updateTempSetting('colorTheme', theme.id)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: theme.id === tempSettings.colorTheme ? '3px solid #fff' : 'none',
                      boxShadow: theme.id === tempSettings.colorTheme ? '0 0 0 3px rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    <Box sx={{ height: '60%', backgroundColor: theme.primary }} />
                    <Box sx={{ 
                      height: '40%', 
                      backgroundColor: theme.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {theme.name}
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={tempSettings.darkMode}
                    onChange={e => updateTempSetting('darkMode', e.target.checked)}
                  />
                }
                label="深色模式"
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={tempSettings.contrastMode}
                    onChange={e => updateTempSetting('contrastMode', e.target.checked)}
                  />
                }
                label="高对比度模式"
              />
            </Box>
          )}
          
          {/* 文本设置 */}
          {activeTab === 1 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                字体大小: {tempSettings.fontSize}px
              </Typography>
              <Slider
                value={tempSettings.fontSize}
                min={12}
                max={24}
                step={1}
                onChange={(_e, value) => updateTempSetting('fontSize', value as number)}
                sx={{ mb: 4 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                行间距: {tempSettings.lineHeight}
              </Typography>
              <Slider
                value={tempSettings.lineHeight}
                min={1}
                max={2}
                step={0.1}
                onChange={(_e, value) => updateTempSetting('lineHeight', value as number)}
                sx={{ mb: 4 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                字体选择
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 4 }}>
                <RadioGroup 
                  value={tempSettings.fontFamily}
                  onChange={e => updateTempSetting('fontFamily', e.target.value)}
                >
                  {FONT_FAMILIES.map(font => (
                    <FormControlLabel 
                      key={font.id} 
                      value={font.id} 
                      control={<Radio />} 
                      label={
                        <Typography sx={{ fontFamily: font.value }}>
                          {font.name}
                        </Typography>
                      } 
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={tempSettings.showTranslations}
                    onChange={e => updateTempSetting('showTranslations', e.target.checked)}
                  />
                }
                label="默认显示翻译"
              />
            </Box>
          )}
          
          {/* 界面布局 */}
          {activeTab === 2 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                布局模式
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
                {LAYOUT_MODES.map(mode => (
                  <Box 
                    key={mode.id}
                    onClick={() => updateTempSetting('layoutMode', mode.id)}
                    sx={{
                      border: '1px solid',
                      borderColor: mode.id === tempSettings.layoutMode ? 'primary.main' : 'divider',
                      backgroundColor: mode.id === tempSettings.layoutMode ? 'action.selected' : 'background.paper',
                      p: 2,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Typography variant="subtitle2">{mode.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mode.description}
                    </Typography>
                    {mode.id === tempSettings.layoutMode && (
                      <Chip
                        label="已选择"
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={tempSettings.animationsEnabled}
                    onChange={e => updateTempSetting('animationsEnabled', e.target.checked)}
                  />
                }
                label="启用界面动画"
              />
            </Box>
          )}
          
          {/* 底部按钮 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ResetIcon />}
              onClick={handleReset}
            >
              重置为默认
            </Button>
            
            <Box>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ mr: 1 }}
              >
                取消
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
              >
                保存设置
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomLayoutManager; 
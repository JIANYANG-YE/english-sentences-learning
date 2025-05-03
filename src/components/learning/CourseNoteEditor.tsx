'use client';

import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Box, 
  TextField, 
  Typography, 
  IconButton, 
  Button, 
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';

// 假设我们使用图标组件
const SaveIcon = () => <span>💾</span>;
const DeleteIcon = () => <span>🗑️</span>;
const EditIcon = () => <span>✏️</span>;
const BookmarkIcon = () => <span>🔖</span>;
const TranslateIcon = () => <span>🔤</span>;
const GrammarIcon = () => <span>📝</span>;

export interface CourseNote {
  id: string;
  courseId: string;
  lessonId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  category: 'vocabulary' | 'grammar' | 'insight' | 'question' | 'summary';
  isImportant: boolean;
}

interface CourseNoteEditorProps {
  initialNote?: Partial<CourseNote>;
  courseId: string;
  lessonId?: string;
  lessonTitle?: string;
  onSave?: (note: CourseNote) => void;
  onDelete?: (noteId: string) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const CourseNoteEditor: React.FC<CourseNoteEditorProps> = ({
  initialNote,
  courseId,
  lessonId,
  lessonTitle,
  onSave,
  onDelete,
  onCancel,
  isEditMode = false
}) => {
  // 笔记状态
  const [note, setNote] = useState<Partial<CourseNote>>({
    courseId,
    lessonId,
    content: '',
    tags: [],
    category: 'insight',
    isImportant: false,
    ...initialNote
  });
  
  // UI状态
  const [isEditing, setIsEditing] = useState(isEditMode || !initialNote?.id);
  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  // 输入变更处理
  const handleInputChange = (field: keyof CourseNote, value: any) => {
    setNote(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !note.tags?.includes(tagInput.trim())) {
      setNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setNote(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  // 保存笔记
  const handleSave = () => {
    if (!note.content?.trim()) {
      setNotification({
        open: true,
        message: '笔记内容不能为空',
        severity: 'error'
      });
      return;
    }
    
    const now = new Date().toISOString();
    const completeNote: CourseNote = {
      id: note.id || `note_${Date.now()}`,
      courseId: note.courseId || courseId,
      lessonId: note.lessonId || lessonId,
      content: note.content || '',
      createdAt: note.createdAt || now,
      updatedAt: now,
      tags: note.tags || [],
      category: note.category as CourseNote['category'] || 'insight',
      isImportant: note.isImportant || false
    };
    
    onSave?.(completeNote);
    setIsEditing(false);
    setNotification({
      open: true,
      message: '笔记已保存',
      severity: 'success'
    });
  };
  
  // 删除笔记
  const handleDelete = () => {
    if (note.id && window.confirm('确定要删除这条笔记吗？')) {
      onDelete?.(note.id);
      setNotification({
        open: true,
        message: '笔记已删除',
        severity: 'info'
      });
    }
  };
  
  // 切换编辑模式
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };
  
  // 取消编辑
  const handleCancel = () => {
    if (isEditMode && initialNote) {
      setNote(initialNote);
    }
    setIsEditing(false);
    onCancel?.();
  };
  
  // 关闭通知
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  // 切换重要标记
  const toggleImportant = () => {
    setNote(prev => ({
      ...prev,
      isImportant: !prev.isImportant
    }));
  };
  
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      {/* 笔记头部 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {isEditing ? (note.id ? '编辑笔记' : '添加笔记') : '笔记详情'}
          {lessonTitle && (
            <Typography variant="caption" display="block" color="text.secondary">
              {lessonTitle}
            </Typography>
          )}
        </Typography>
        
        {note.id && !isEditing && (
          <IconButton onClick={toggleEditMode} size="small" sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
        )}
        
        <IconButton 
          onClick={toggleImportant}
          color={note.isImportant ? "primary" : "default"}
        >
          <BookmarkIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* 笔记内容 */}
      {isEditing ? (
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="笔记内容"
            multiline
            rows={4}
            value={note.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            margin="normal"
          />
          
          <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="note-category-label">分类</InputLabel>
              <Select
                labelId="note-category-label"
                value={note.category}
                label="分类"
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <MenuItem value="vocabulary">词汇</MenuItem>
                <MenuItem value="grammar">语法</MenuItem>
                <MenuItem value="insight">见解</MenuItem>
                <MenuItem value="question">问题</MenuItem>
                <MenuItem value="summary">总结</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              size="small"
              label="添加标签"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              sx={{ flexGrow: 1 }}
            />
            
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              添加
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ my: 2 }}>
          <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
            {note.content}
          </Typography>
          
          {/* 时间信息 */}
          {note.createdAt && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
              创建于: {new Date(note.createdAt).toLocaleString('zh-CN')}
              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <> | 更新于: {new Date(note.updatedAt).toLocaleString('zh-CN')}</>
              )}
            </Typography>
          )}
        </Box>
      )}
      
      {/* 标签显示 */}
      {note.tags && note.tags.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
          {note.tags.map((tag) => (
            <Chip 
              key={tag} 
              label={tag}
              size="small"
              onDelete={isEditing ? () => handleRemoveTag(tag) : undefined}
            />
          ))}
        </Box>
      )}
      
      {/* 分类图标 */}
      {note.category && (
        <Box sx={{ display: 'inline-block', mr: 1 }}>
          <Chip 
            icon={
              note.category === 'vocabulary' ? <TranslateIcon /> :
              note.category === 'grammar' ? <GrammarIcon /> :
              undefined
            }
            label={
              note.category === 'vocabulary' ? '词汇' :
              note.category === 'grammar' ? '语法' :
              note.category === 'insight' ? '见解' :
              note.category === 'question' ? '问题' :
              note.category === 'summary' ? '总结' :
              note.category
            }
            size="small"
            color={
              note.category === 'question' ? 'warning' :
              note.category === 'insight' ? 'success' :
              'default'
            }
          />
        </Box>
      )}
      
      {/* 底部按钮 */}
      {isEditing && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          {note.id && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              删除
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={handleCancel}
          >
            取消
          </Button>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            保存
          </Button>
        </Box>
      )}
      
      {/* 通知消息 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CourseNoteEditor; 
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, IconButton, Paper, Chip, Divider } from '@mui/material';
import { FaSave, FaTrash, FaPlus, FaPen, FaVolumeUp } from 'react-icons/fa';
import { SentencePair } from '@/types/courses/contentTypes';
import { Note } from '@/types/courses';

interface UserPreferences {
  showPinyin?: boolean;
  audioSpeed?: number;
}

interface NotesModeProps {
  sentencePair: SentencePair;
  onComplete?: (success: boolean) => void;
  preferences?: UserPreferences;
  onNext?: () => void;
  existingNotes?: Note[];
  onSaveNote?: (note: Note) => void;
  onDeleteNote?: (noteId: string) => void;
}

const NotesMode: React.FC<NotesModeProps> = ({
  sentencePair,
  onComplete,
  preferences = {},
  onNext,
  existingNotes = [],
  onSaveNote,
  onDeleteNote
}) => {
  // 默认首选项
  const defaultPrefs = {
    showPinyin: false,
    audioSpeed: 1.0
  };

  // 合并默认设置和用户设置
  const prefs = { ...defaultPrefs, ...preferences };
  
  // 状态
  const [notes, setNotes] = useState<Note[]>(existingNotes);
  const [newNote, setNewNote] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 音频引用
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // 初始化音频元素
  useEffect(() => {
    if (sentencePair.audioUrl) {
      audioRef.current = new Audio(sentencePair.audioUrl);
      audioRef.current.playbackRate = prefs.audioSpeed;
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }
  }, [sentencePair.audioUrl, prefs.audioSpeed]);

  // 播放音频
  const playAudio = () => {
    if (audioRef.current && !isPlaying) {
      setIsPlaying(true);
      audioRef.current.play().catch(error => console.error('音频播放失败:', error));
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  // 添加笔记
  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const newNoteItem: Note = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      highlight: selectedText,
      note: newNote,
      type: 'user',
      paragraphIndex: 0
    };
    
    const updatedNotes = [...notes, newNoteItem];
    setNotes(updatedNotes);
    setNewNote('');
    setSelectedText('');
    
    // 调用外部保存回调
    if (onSaveNote) {
      onSaveNote(newNoteItem);
    }
  };

  // 处理文本选择
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
      setSelectedText(selection.toString().trim());
    }
  };

  // 编辑笔记
  const startEditing = (note: Note) => {
    setIsEditing(note.id);
    setEditText(note.note);
  };

  // 保存编辑
  const saveEdit = () => {
    if (!isEditing || editText.trim() === '') return;
    
    const updatedNotes = notes.map(note => 
      note.id === isEditing 
        ? { ...note, note: editText, timestamp: new Date().toISOString() } 
        : note
    );
    
    setNotes(updatedNotes);
    setIsEditing(null);
    setEditText('');
    
    // 调用外部保存回调
    const editedNote = updatedNotes.find(note => note.id === isEditing);
    if (onSaveNote && editedNote) {
      onSaveNote(editedNote);
    }
  };

  // 删除笔记
  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    
    // 调用外部删除回调
    if (onDeleteNote) {
      onDeleteNote(id);
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setIsEditing(null);
    setEditText('');
  };

  // 处理完成
  const handleComplete = () => {
    if (onComplete) {
      onComplete(true);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>
        笔记模式
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {sentencePair.audioUrl && (
            <IconButton 
              onClick={playAudio}
              disabled={isPlaying}
              size="small"
              color="primary"
              sx={{ mr: 1 }}
            >
              <FaVolumeUp />
            </IconButton>
          )}
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            选择文本以添加笔记
          </Typography>
        </Box>
        
        <Typography 
          variant="body1" 
          sx={{ mb: 2, lineHeight: 1.6 }}
          onMouseUp={handleTextSelection}
        >
          {sentencePair.english}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {sentencePair.chinese}
        </Typography>
      </Paper>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          添加笔记
        </Typography>
        
        {selectedText && (
          <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              "{selectedText}"
            </Typography>
          </Paper>
        )}
        
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="在此输入你的笔记..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          sx={{ mb: 1 }}
        />
        
        <Button 
          variant="contained" 
          startIcon={<FaPlus />}
          onClick={addNote}
          disabled={newNote.trim() === ''}
        >
          添加笔记
        </Button>
      </Box>
      
      {notes.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            你的笔记
          </Typography>
          
          {notes.map((note) => (
            <Paper 
              key={note.id} 
              elevation={1} 
              sx={{ p: 2, mb: 2, position: 'relative' }}
            >
              {isEditing === note.id ? (
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      size="small" 
                      onClick={cancelEdit}
                      sx={{ mr: 1 }}
                    >
                      取消
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={saveEdit}
                    >
                      保存
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {note.highlight && (
                    <>
                      <Typography 
                        variant="body2" 
                        sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 1 }}
                      >
                        "{note.highlight}"
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </>
                  )}
                  
                  <Typography variant="body2">{note.note}</Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ color: 'text.disabled', mr: 'auto' }}
                    >
                      {new Date(note.timestamp).toLocaleString()}
                    </Typography>
                    
                    <IconButton 
                      size="small" 
                      onClick={() => startEditing(note)}
                      sx={{ mr: 0.5 }}
                    >
                      <FaPen size={12} />
                    </IconButton>
                    
                    <IconButton 
                      size="small"
                      onClick={() => deleteNote(note.id)}
                      color="error"
                    >
                      <FaTrash size={12} />
                    </IconButton>
                  </Box>
                </>
              )}
            </Paper>
          ))}
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleComplete}
        >
          完成学习
        </Button>
        
        <Button 
          variant="outlined"
          onClick={onNext}
        >
          下一句
        </Button>
      </Box>
    </Box>
  );
};

export default NotesMode; 
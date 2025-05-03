'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button, 
  Paper,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import courseInteractionService, { CourseRating } from '@/services/courseInteractionService';

interface CourseRatingFormProps {
  userId: string;
  courseId: string;
  courseName: string;
  onRatingSubmitted?: (rating: CourseRating) => void;
  initialRating?: CourseRating;
}

const CourseRatingForm: React.FC<CourseRatingFormProps> = ({
  userId,
  courseId,
  courseName,
  onRatingSubmitted,
  initialRating
}) => {
  const [rating, setRating] = useState<number | null>(initialRating?.rating || null);
  const [comment, setComment] = useState(initialRating?.comment || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = () => {
    try {
      if (!rating) {
        setError('请选择评分星级');
        return;
      }
      
      const result = courseInteractionService.rateCourse(
        userId, 
        courseId, 
        rating, 
        comment
      );
      
      setSuccess(true);
      
      if (onRatingSubmitted) {
        onRatingSubmitted(result);
      }
    } catch (err: any) {
      setError(err.message || '提交评分时出错');
    }
  };
  
  const handleRatingChange = (_event: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue);
    if (error) setError('');
  };
  
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };
  
  const handleCloseAlert = () => {
    setSuccess(false);
    setError('');
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, maxWidth: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {initialRating ? '更新您的评分' : '为课程评分'}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {courseName}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography component="legend" gutterBottom>
          您的评分
        </Typography>
        <Rating
          name="course-rating"
          value={rating}
          onChange={handleRatingChange}
          precision={0.5}
          size="large"
          sx={{ fontSize: '2rem' }}
        />
        {rating !== null && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {rating === 5 ? '太棒了！' : 
             rating >= 4 ? '很好' : 
             rating >= 3 ? '一般' : 
             rating >= 2 ? '不太满意' : 
             '很差'}
          </Typography>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography component="legend" gutterBottom>
          您的评论（可选）
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
          placeholder="分享您对这个课程的想法和建议..."
          variant="outlined"
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!rating}
        >
          {initialRating ? '更新评分' : '提交评分'}
        </Button>
      </Box>
      
      {/* 错误消息显示 */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* 成功消息显示 */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          {initialRating ? '评分已更新' : '评分已提交，谢谢您的反馈！'}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CourseRatingForm; 
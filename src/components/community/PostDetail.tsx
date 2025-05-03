import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface Author {
  id: string;
  name: string;
  avatar: string;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
  liked: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  date: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  liked: boolean;
  bookmarked: boolean;
}

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

export default function PostDetail({ postId, onBack }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // 模拟获取帖子数据
  useEffect(() => {
    const fetchPostDetails = async () => {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟帖子数据
      const mockPost: Post = {
        id: postId,
        title: '学习英语口语的最佳方法是什么？',
        content: `我一直在努力提高我的英语口语能力，但感觉进步很慢。已经学习了大约6个月，但仍然在实际对话中感到紧张。

我尝试过看英语电影、听播客，甚至找了一些语言交换伙伴，但感觉效果不是很明显。

有人能分享一些有效的方法或个人经验吗？特别是如何克服说英语的心理障碍，以及如何有效地提高发音和流利度。

非常感谢大家的建议！`,
        author: {
          id: 'user1',
          name: '语言学习者',
          avatar: 'https://i.pravatar.cc/150?img=1'
        },
        date: '2023-10-15',
        likes: 24,
        comments: [
          {
            id: 'comment1',
            author: {
              id: 'user2',
              name: '英语教师',
              avatar: 'https://i.pravatar.cc/150?img=5'
            },
            content: '我作为一名英语教师，建议你尝试"影子跟读"方法。找一些简短的英语对话或演讲，反复听并尝试模仿说话者的语调和节奏。这对提高发音和口语流利度非常有效。',
            date: '2023-10-16',
            likes: 8,
            liked: false
          },
          {
            id: 'comment2',
            author: {
              id: 'user3',
              name: '海外留学生',
              avatar: 'https://i.pravatar.cc/150?img=6'
            },
            content: '我在国外学习期间最大的突破是加入了一个英语角。每周固定时间与其他学习者面对面交流，创造了不得不说英语的环境。你可以在当地找找有没有这样的活动，或者在线上加入一些语言交换社区。',
            date: '2023-10-17',
            likes: 12,
            liked: true
          },
          {
            id: 'comment3',
            author: {
              id: 'user4',
              name: '自学成才',
              avatar: 'https://i.pravatar.cc/150?img=7'
            },
            content: '我发现录制自己说英语然后回听是一个很好的方法。这样可以发现自己的问题，比如发音不准确或语法错误。一开始可能会觉得尴尬，但效果真的很好！另外，设定小目标也很重要，比如每天练习15分钟口语。',
            date: '2023-10-18',
            likes: 5,
            liked: false
          }
        ],
        tags: ['口语', '学习方法', '语言交流'],
        liked: false,
        bookmarked: false
      };
      
      setPost(mockPost);
      setIsLoading(false);
    };
    
    fetchPostDetails();
  }, [postId]);

  // 处理点赞帖子
  const handleLikePost = () => {
    if (!post) return;
    
    setPost({
      ...post,
      likes: post.liked ? post.likes - 1 : post.likes + 1,
      liked: !post.liked
    });
  };

  // 处理收藏帖子
  const handleBookmark = () => {
    if (!post) return;
    
    setPost({
      ...post,
      bookmarked: !post.bookmarked
    });
  };

  // 处理点赞评论
  const handleLikeComment = (commentId: string) => {
    if (!post) return;
    
    setPost({
      ...post,
      comments: post.comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            liked: !comment.liked
          };
        }
        return comment;
      })
    });
  };

  // 提交评论
  const handleSubmitComment = () => {
    if (!post || !newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `comment${post.comments.length + 1}`,
      author: {
        id: 'currentUser',
        name: '当前用户',
        avatar: 'https://i.pravatar.cc/150?img=8'
      },
      content: replyingTo 
        ? `@${post.comments.find(c => c.id === replyingTo)?.author.name} ${newComment}`
        : newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      liked: false
    };
    
    setPost({
      ...post,
      comments: [...post.comments, newCommentObj]
    });
    
    setNewComment('');
    setReplyingTo(null);
  };

  // 回复评论
  const handleReply = (commentId: string) => {
    if (!post) return;
    
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    
    setReplyingTo(commentId);
    setNewComment(``);
    
    // 滚动到评论框
    document.getElementById('comment-input')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 分享帖子
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: '查看这个有趣的英语学习讨论',
        url: window.location.href,
      })
      .catch((error) => console.log('分享失败:', error));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('链接已复制到剪贴板'))
        .catch((err) => console.error('复制失败: ', err));
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', my: 5 }}>
        <Typography variant="h6">帖子未找到</Typography>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          返回讨论区
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          返回讨论区
        </Button>
        
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={onBack}
            sx={{ cursor: 'pointer' }}
          >
            讨论区
          </Link>
          <Typography color="text.primary">帖子详情</Typography>
        </Breadcrumbs>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            src={post.author.avatar} 
            alt={post.author.name} 
            sx={{ width: 50, height: 50, mr: 2 }} 
          />
          <Box>
            <Typography variant="h6">{post.author.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              发布于 {post.date}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h5" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box sx={{ my: 3 }}>
          {post.content.split('\n\n').map((paragraph, index) => (
            <Typography 
              key={index} 
              variant="body1" 
              paragraph
            >
              {paragraph}
            </Typography>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
          {post.tags.map(tag => (
            <Chip 
              key={tag} 
              label={tag} 
              size="small" 
              variant="outlined" 
              color="primary"
            />
          ))}
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              onClick={handleLikePost}
              color={post.liked ? "primary" : "default"}
            >
              {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {post.likes}
            </Typography>
          </Box>
          
          <Box>
            <IconButton onClick={handleShare}>
              <ShareIcon />
            </IconButton>
            <IconButton 
              onClick={handleBookmark}
              color={post.bookmarked ? "primary" : "default"}
            >
              {post.bookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          评论 ({post.comments.length})
        </Typography>
        
        <List>
          {post.comments.map((comment) => (
            <ListItem 
              key={comment.id} 
              alignItems="flex-start"
              sx={{ px: 0, display: 'block' }}
            >
              <Card variant="outlined" sx={{ mb: 2, width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={comment.author.avatar} 
                      alt={comment.author.name}
                      sx={{ mr: 2 }} 
                    />
                    <Box>
                      <Typography variant="subtitle1">
                        {comment.author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.date}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {comment.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small"
                        onClick={() => handleLikeComment(comment.id)}
                        color={comment.liked ? "primary" : "default"}
                      >
                        {comment.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                      <Typography variant="body2" color="text.secondary">
                        {comment.likes}
                      </Typography>
                    </Box>
                    
                    <Button 
                      size="small" 
                      onClick={() => handleReply(comment.id)}
                    >
                      回复
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Paper elevation={2} sx={{ p: 3 }} id="comment-input">
        <Typography variant="h6" gutterBottom>
          {replyingTo 
            ? `回复: ${post.comments.find(c => c.id === replyingTo)?.author.name}`
            : '发表评论'
          }
        </Typography>
        
        {replyingTo && (
          <Box sx={{ mb: 2 }}>
            <Button 
              size="small" 
              onClick={() => setReplyingTo(null)}
              variant="outlined"
            >
              取消回复
            </Button>
          </Box>
        )}
        
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="写下你的评论..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary"
            disabled={!newComment.trim()}
            onClick={handleSubmitComment}
          >
            发表评论
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
  Chip,
  Avatar,
  Grid,
  IconButton,
  Badge,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CommentIcon from '@mui/icons-material/Comment';

// 帖子数据类型定义
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  tags: string[];
  likes: number;
  views: number;
  commentCount: number;
  isLiked: boolean;
  isPinned: boolean;
  isHot: boolean;
  category: string;
  answerId?: string;
}

// 讨论区组件
export default function DiscussionForum() {
  // 状态管理
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    category: '讨论'
  });
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState('latest');
  const [filterCategory, setFilterCategory] = useState('all');
  const [tagInput, setTagInput] = useState('');

  // 模拟数据
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      const mockPosts: Post[] = Array(30).fill(null).map((_, index) => {
        const categories = ['讨论', '问答', '心得', '资源分享'];
        const isQuestion = Math.random() > 0.7;
        const category = isQuestion ? '问答' : categories[Math.floor(Math.random() * categories.length)];
        
        return {
          id: `post-${index + 1}`,
          title: [
            '如何有效地记忆英语单词？',
            '分享我的托福备考经验与心得',
            '英语口语练习的最佳方法是什么？',
            '请教：如何区分"affect"和"effect"的用法？',
            '我的100天英语学习挑战记录',
            '有没有推荐的英语学习APP？',
            '为什么我听力理解总是跟不上？',
            '商务英语中常见的表达方式和礼仪',
            '如何克服英语学习的"高原期"？',
            '英语阅读技巧分享：如何提高阅读速度'
          ][Math.floor(Math.random() * 10)],
          content: '这是帖子的详细内容，包含作者的观点、经验或问题描述。这里会有更多的文字解释和详情。',
          authorId: `user-${Math.floor(Math.random() * 100)}`,
          authorName: ['学习达人', '英语爱好者', '语言学习者', '求知者', '分享君', '疑问人'][Math.floor(Math.random() * 6)],
          authorAvatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.jpg`,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['学习方法', '经验分享', '求助', '资源', '语法', '口语', '听力', '阅读', '写作'].sort(() => 0.5 - Math.random()).slice(0, 1 + Math.floor(Math.random() * 3)),
          likes: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 200) + 20,
          commentCount: Math.floor(Math.random() * 30),
          isLiked: Math.random() > 0.7,
          isPinned: Math.random() > 0.9,
          isHot: Math.random() > 0.8,
          category,
          answerId: isQuestion && Math.random() > 0.6 ? `answer-${Math.floor(Math.random() * 100)}` : undefined
        };
      });
      
      // 排序，置顶在前
      mockPosts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 处理搜索和筛选
  useEffect(() => {
    let filtered = [...posts];
    
    // 搜索查询
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 标签筛选
    if (currentTab === 1) { // 问答
      filtered = filtered.filter(post => post.category === '问答');
    } else if (currentTab === 2) { // 已解决
      filtered = filtered.filter(post => post.category === '问答' && post.answerId);
    } else if (currentTab === 3) { // 热门
      filtered = filtered.filter(post => post.isHot);
    }
    
    // 分类筛选
    if (filterCategory !== 'all') {
      filtered = filtered.filter(post => post.category === filterCategory);
    }
    
    // 排序
    switch(sortBy) {
      case 'latest':
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        break;
      case 'popular':
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.views - a.views;
        });
        break;
      case 'mostComments':
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.commentCount - a.commentCount;
        });
        break;
      default:
        break;
    }
    
    setFilteredPosts(filtered);
  }, [searchQuery, currentTab, sortBy, filterCategory, posts]);

  // 处理标签变更
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 处理点赞
  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const newIsLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  // 处理发帖对话框
  const handleOpenNewPostDialog = () => {
    setOpenNewPostDialog(true);
  };

  const handleCloseNewPostDialog = () => {
    setOpenNewPostDialog(false);
  };

  // 处理新帖子提交
  const handleSubmitNewPost = () => {
    // 模拟生成ID
    const postId = `post-${Date.now()}`;
    
    // 创建新帖子对象
    const newPostObj: Post = {
      id: postId,
      title: newPost.title,
      content: newPost.content,
      authorId: 'current-user',
      authorName: '当前用户',
      authorAvatar: '/avatars/default.jpg',
      createdAt: new Date().toISOString(),
      tags: newPost.tags,
      likes: 0,
      views: 0,
      commentCount: 0,
      isLiked: false,
      isPinned: false,
      isHot: false,
      category: newPost.category
    };
    
    // 更新帖子列表
    setPosts(prevPosts => [newPostObj, ...prevPosts]);
    
    // 重置表单
    setNewPost({
      title: '',
      content: '',
      tags: [],
      category: '讨论'
    });
    
    // 关闭对话框
    handleCloseNewPostDialog();
  };

  // 处理排序菜单
  const handleSortMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  // 处理筛选菜单
  const handleFilterMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  // 标签输入处理
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!newPost.tags.includes(newTag)) {
        setNewPost(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // 获取讨论分类图标
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case '讨论':
        return <ForumIcon fontSize="small" color="primary" />;
      case '问答':
        return <HelpOutlineIcon fontSize="small" color="secondary" />;
      case '心得':
        return <EmojiEventsIcon fontSize="small" color="success" />;
      case '资源分享':
        return <LocalOfferIcon fontSize="small" color="info" />;
      default:
        return <ForumIcon fontSize="small" />;
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} 分钟前`;
      }
      return `${diffHours} 小时前`;
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput && !newPost.tags.includes(tagInput)) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput]
      }));
      setTagInput('');
    }
  };

  // 删除标签
  const handleDeleteTag = (tagToDelete: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToDelete)
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 标题 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          学习讨论区
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          在这里与其他学习者交流经验、分享心得、解答问题，共同进步。
        </Typography>
      </Box>
      
      {/* 搜索和操作栏 */}
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <TextField
          placeholder="搜索讨论..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: '60%' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
            onClick={handleSortMenuOpen}
          >
            排序
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterMenuOpen}
          >
            筛选
          </Button>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenNewPostDialog}
          >
            发布新帖
          </Button>
          
          {/* 排序菜单 */}
          <Menu
            anchorEl={sortMenuAnchor}
            open={Boolean(sortMenuAnchor)}
            onClose={handleSortMenuClose}
          >
            <MenuItem 
              selected={sortBy === 'latest'}
              onClick={() => {
                setSortBy('latest');
                handleSortMenuClose();
              }}
            >
              最新发布
            </MenuItem>
            <MenuItem 
              selected={sortBy === 'popular'}
              onClick={() => {
                setSortBy('popular');
                handleSortMenuClose();
              }}
            >
              最多浏览
            </MenuItem>
            <MenuItem 
              selected={sortBy === 'mostComments'}
              onClick={() => {
                setSortBy('mostComments');
                handleSortMenuClose();
              }}
            >
              最多评论
            </MenuItem>
          </Menu>
          
          {/* 筛选菜单 */}
          <Menu
            anchorEl={filterMenuAnchor}
            open={Boolean(filterMenuAnchor)}
            onClose={handleFilterMenuClose}
          >
            <MenuItem 
              selected={filterCategory === 'all'}
              onClick={() => {
                setFilterCategory('all');
                handleFilterMenuClose();
              }}
            >
              全部分类
            </MenuItem>
            <MenuItem 
              selected={filterCategory === '讨论'}
              onClick={() => {
                setFilterCategory('讨论');
                handleFilterMenuClose();
              }}
            >
              讨论
            </MenuItem>
            <MenuItem 
              selected={filterCategory === '问答'}
              onClick={() => {
                setFilterCategory('问答');
                handleFilterMenuClose();
              }}
            >
              问答
            </MenuItem>
            <MenuItem 
              selected={filterCategory === '心得'}
              onClick={() => {
                setFilterCategory('心得');
                handleFilterMenuClose();
              }}
            >
              心得
            </MenuItem>
            <MenuItem 
              selected={filterCategory === '资源分享'}
              onClick={() => {
                setFilterCategory('资源分享');
                handleFilterMenuClose();
              }}
            >
              资源分享
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      
      {/* 标签导航 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="全部" />
          <Tab label="问答" />
          <Tab label="已解决" />
          <Tab label="热门" />
        </Tabs>
      </Box>
      
      {/* 帖子列表 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <CircularProgress />
        </Box>
      ) : filteredPosts.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 6 }}>
          <Typography variant="h6" gutterBottom>未找到相关讨论</Typography>
          <Typography variant="body2" color="text.secondary">
            尝试使用不同的搜索词或筛选条件
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchQuery('');
              setCurrentTab(0);
              setFilterCategory('all');
              setSortBy('latest');
            }}
          >
            查看全部讨论
          </Button>
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {filteredPosts.map((post) => (
            <React.Fragment key={post.id}>
              <ListItem 
                alignItems="flex-start" 
                component={Paper} 
                elevation={1}
                sx={{ 
                  mb: 2, 
                  borderRadius: 1,
                  position: 'relative',
                  pl: 2,
                  pr: 2,
                  pt: 1.5,
                  pb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  bgcolor: post.isPinned ? 'rgba(0, 0, 0, 0.02)' : 'background.paper'
                }}
              >
                {/* 帖子内容 */}
                <Grid container spacing={2}>
                  {/* 左侧作者信息 */}
                  <Grid item xs={12} sm={2} md={1.5}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar 
                        src={post.authorAvatar} 
                        alt={post.authorName}
                        sx={{ width: 48, height: 48, mb: 1 }}
                      />
                      <Typography variant="body2" align="center" noWrap>
                        {post.authorName}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  {/* 右侧帖子信息 */}
                  <Grid item xs={12} sm={10} md={10.5}>
                    <Box sx={{ width: '100%' }}>
                      {/* 帖子标题和标签 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getCategoryIcon(post.category)}
                        <Typography variant="subtitle1" component="h2" sx={{ ml: 1, fontWeight: 'medium' }}>
                          {post.isPinned && (
                            <Chip 
                              label="置顶" 
                              size="small" 
                              color="error" 
                              sx={{ mr: 1, height: 20, fontSize: '0.75rem' }}
                            />
                          )}
                          {post.title}
                        </Typography>
                      </Box>
                      
                      {/* 帖子内容预览 */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 1
                        }}
                      >
                        {post.content}
                      </Typography>
                      
                      {/* 标签 */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                        {post.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                        
                        {post.answerId && (
                          <Chip
                            label="已解答"
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                        
                        {post.isHot && (
                          <Chip
                            label="热门"
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                      
                      {/* 互动信息 */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton 
                              size="small" 
                              color={post.isLiked ? 'primary' : 'default'}
                              onClick={() => handleLike(post.id)}
                            >
                              {post.isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {post.likes}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ChatBubbleOutlineIcon fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {post.commentCount}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VisibilityIcon fontSize="small" color="action" />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {post.views}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* 操作菜单 */}
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <MoreHorizIcon fontSize="small" />
                </IconButton>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
      
      {/* 发布新帖对话框 */}
      <Dialog
        open={openNewPostDialog}
        onClose={handleCloseNewPostDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>发布新帖</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="标题"
                variant="outlined"
                fullWidth
                required
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="内容"
                variant="outlined"
                fullWidth
                required
                multiline
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="分类"
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                fullWidth
              >
                <MenuItem value="讨论">讨论</MenuItem>
                <MenuItem value="问答">问答</MenuItem>
                <MenuItem value="心得">心得</MenuItem>
                <MenuItem value="资源分享">资源分享</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="添加标签 (按Enter添加)"
                variant="outlined"
                fullWidth
                onKeyDown={handleTagInput}
                helperText="最多添加5个标签，每个标签按Enter确认"
              />
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {newPost.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewPostDialog}>取消</Button>
          <Button 
            onClick={handleSubmitNewPost}
            variant="contained"
            disabled={!newPost.title || !newPost.content}
          >
            发布
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
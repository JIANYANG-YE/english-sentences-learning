import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Rating,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DescriptionIcon from '@mui/icons-material/Description';
import VideocamIcon from '@mui/icons-material/Videocam';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import LinkIcon from '@mui/icons-material/Link';
import GetAppIcon from '@mui/icons-material/GetApp';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SortIcon from '@mui/icons-material/Sort';

// 资源数据类型定义
interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'audio' | 'link';
  tags: string[];
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  reviewCount: number;
  views: number;
  likes: number;
  dateAdded: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
  };
  isFeatured: boolean;
  isBookmarked: boolean;
  url: string;
  size?: string;
}

// 筛选器选项
interface FilterOptions {
  category: string;
  resourceType: string;
  level: string;
  sortBy: string;
}

// 资料库组件主体
export default function ResourceLibrary() {
  // 状态管理
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [filteredResources, setFilteredResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'all',
    resourceType: 'all',
    level: 'all',
    sortBy: 'newest'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resourcesPerPage = 12;

  // 模拟资源数据
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      const mockResources: ResourceItem[] = Array(50).fill(null).map((_, index) => {
        const types = ['document', 'video', 'audio', 'link'] as const;
        const categories = ['语法', '词汇', '听力', '口语', '阅读', '写作'];
        const levels = ['beginner', 'intermediate', 'advanced'] as const;
        const type = types[Math.floor(Math.random() * types.length)];
        
        return {
          id: `resource-${index + 1}`,
          title: [
            '初级英语语法完全指南', 
            '2000核心英语词汇', 
            '英语发音技巧与练习', 
            '高级商务英语写作', 
            '托福听力训练材料', 
            '日常英语会话100主题', 
            '英语阅读理解策略', 
            '英语词汇记忆方法',
            '英语演讲技巧与范例',
            '英语学习常见错误分析'
          ][Math.floor(Math.random() * 10)],
          description: '这是一份高质量的学习资料，涵盖了重要的知识点和练习内容，适合不同水平的学习者使用。',
          type,
          tags: ['学习资料', '练习', categories[Math.floor(Math.random() * categories.length)], Math.random() > 0.5 ? '推荐' : ''],
          category: categories[Math.floor(Math.random() * categories.length)],
          level: levels[Math.floor(Math.random() * levels.length)],
          rating: 3 + Math.random() * 2,
          reviewCount: Math.floor(Math.random() * 200),
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 200),
          dateAdded: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString(),
          creator: {
            id: `user-${Math.floor(Math.random() * 100)}`,
            name: ['张老师', '李教授', '王学者', '学习社区', '英语爱好者', '语言专家'][Math.floor(Math.random() * 6)],
            avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.jpg`
          },
          isFeatured: Math.random() > 0.8,
          isBookmarked: Math.random() > 0.7,
          url: '#',
          size: type === 'document' ? `${Math.floor(Math.random() * 10) + 1}MB` : undefined
        };
      });
      
      setResources(mockResources);
      setFilteredResources(mockResources);
      setTotalPages(Math.ceil(mockResources.length / resourcesPerPage));
      setIsLoading(false);
    }, 1000);
  }, []);

  // 处理搜索
  useEffect(() => {
    filterResources();
  }, [searchQuery, filterOptions, currentTab, resources]);

  // 筛选资源
  const filterResources = () => {
    let filtered = [...resources];
    
    // 处理搜索查询
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        resource => 
          resource.title.toLowerCase().includes(query) || 
          resource.description.toLowerCase().includes(query) ||
          resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // 处理标签分类
    if (currentTab === 1) {
      filtered = filtered.filter(resource => resource.isBookmarked);
    } else if (currentTab === 2) {
      filtered = filtered.filter(resource => resource.isFeatured);
    }
    
    // 应用筛选条件
    if (filterOptions.category !== 'all') {
      filtered = filtered.filter(resource => resource.category === filterOptions.category);
    }
    
    if (filterOptions.resourceType !== 'all') {
      filtered = filtered.filter(resource => resource.type === filterOptions.resourceType);
    }
    
    if (filterOptions.level !== 'all') {
      filtered = filtered.filter(resource => resource.level === filterOptions.level);
    }
    
    // 应用排序
    switch(filterOptions.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredResources(filtered);
    setTotalPages(Math.ceil(filtered.length / resourcesPerPage));
    setPage(1);
  };

  // 处理标签变更
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // 处理筛选菜单
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 更新筛选选项
  const updateFilterOption = (option: keyof FilterOptions, value: string) => {
    setFilterOptions({
      ...filterOptions,
      [option]: value
    });
    handleMenuClose();
  };

  // 处理书签切换
  const toggleBookmark = (id: string) => {
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === id 
          ? { ...resource, isBookmarked: !resource.isBookmarked } 
          : resource
      )
    );
  };

  // 分页处理
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 获取当前页的资源
  const getCurrentPageResources = () => {
    const startIndex = (page - 1) * resourcesPerPage;
    return filteredResources.slice(startIndex, startIndex + resourcesPerPage);
  };

  // 获取资源类型图标
  const getResourceTypeIcon = (type: string) => {
    switch(type) {
      case 'document':
        return <DescriptionIcon />;
      case 'video':
        return <VideocamIcon />;
      case 'audio':
        return <AudioFileIcon />;
      case 'link':
        return <LinkIcon />;
      default:
        return <DescriptionIcon />;
    }
  };

  // 获取资源类型名称
  const getResourceTypeName = (type: string) => {
    switch(type) {
      case 'document':
        return '文档';
      case 'video':
        return '视频';
      case 'audio':
        return '音频';
      case 'link':
        return '链接';
      default:
        return '文档';
    }
  };

  // 获取难度级别名称
  const getLevelName = (level: string) => {
    switch(level) {
      case 'beginner':
        return '初级';
      case 'intermediate':
        return '中级';
      case 'advanced':
        return '高级';
      default:
        return '所有级别';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 标题 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          学习资料库
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          丰富的学习资源，助您进步。从社区中发现高质量的英语学习材料，或分享您的资源。
        </Typography>
      </Box>
      
      {/* 搜索和筛选 */}
      <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          placeholder="搜索资料..."
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
          sx={{ flexGrow: 1 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleMenuClick}
          >
            筛选
          </Button>
          
          <IconButton 
            color="primary"
            onClick={handleMenuClick}
            aria-label="排序"
          >
            <SortIcon />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              style: { width: 250 },
            }}
          >
            <MenuItem>
              <Typography variant="subtitle2" color="text.secondary">
                资源类型
              </Typography>
            </MenuItem>
            <MenuItem 
              selected={filterOptions.resourceType === 'all'}
              onClick={() => updateFilterOption('resourceType', 'all')}
            >
              所有类型
            </MenuItem>
            <MenuItem 
              selected={filterOptions.resourceType === 'document'}
              onClick={() => updateFilterOption('resourceType', 'document')}
            >
              文档资料
            </MenuItem>
            <MenuItem 
              selected={filterOptions.resourceType === 'video'}
              onClick={() => updateFilterOption('resourceType', 'video')}
            >
              视频教程
            </MenuItem>
            <MenuItem 
              selected={filterOptions.resourceType === 'audio'}
              onClick={() => updateFilterOption('resourceType', 'audio')}
            >
              音频资料
            </MenuItem>
            <MenuItem 
              selected={filterOptions.resourceType === 'link'}
              onClick={() => updateFilterOption('resourceType', 'link')}
            >
              外部链接
            </MenuItem>
            <Divider />
            
            <MenuItem>
              <Typography variant="subtitle2" color="text.secondary">
                难度级别
              </Typography>
            </MenuItem>
            <MenuItem 
              selected={filterOptions.level === 'all'}
              onClick={() => updateFilterOption('level', 'all')}
            >
              所有级别
            </MenuItem>
            <MenuItem 
              selected={filterOptions.level === 'beginner'}
              onClick={() => updateFilterOption('level', 'beginner')}
            >
              初级
            </MenuItem>
            <MenuItem 
              selected={filterOptions.level === 'intermediate'}
              onClick={() => updateFilterOption('level', 'intermediate')}
            >
              中级
            </MenuItem>
            <MenuItem 
              selected={filterOptions.level === 'advanced'}
              onClick={() => updateFilterOption('level', 'advanced')}
            >
              高级
            </MenuItem>
            <Divider />
            
            <MenuItem>
              <Typography variant="subtitle2" color="text.secondary">
                排序方式
              </Typography>
            </MenuItem>
            <MenuItem 
              selected={filterOptions.sortBy === 'newest'}
              onClick={() => updateFilterOption('sortBy', 'newest')}
            >
              最新上传
            </MenuItem>
            <MenuItem 
              selected={filterOptions.sortBy === 'popular'}
              onClick={() => updateFilterOption('sortBy', 'popular')}
            >
              热门资料
            </MenuItem>
            <MenuItem 
              selected={filterOptions.sortBy === 'rating'}
              onClick={() => updateFilterOption('sortBy', 'rating')}
            >
              评分最高
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
          <Tab label="全部资料" />
          <Tab label="我的收藏" />
          <Tab label="精选资源" />
          <Tab label="语法" />
          <Tab label="词汇" />
          <Tab label="听力" />
          <Tab label="口语" />
          <Tab label="阅读" />
          <Tab label="写作" />
        </Tabs>
      </Box>
      
      {/* 资源列表 */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
          <Typography>加载中...</Typography>
        </Box>
      ) : filteredResources.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 6 }}>
          <Typography variant="h6" gutterBottom>未找到符合条件的资源</Typography>
          <Typography variant="body2" color="text.secondary">
            尝试使用不同的搜索词或筛选条件
          </Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchQuery('');
              setFilterOptions({
                category: 'all',
                resourceType: 'all',
                level: 'all',
                sortBy: 'newest'
              });
              setCurrentTab(0);
            }}
          >
            清除筛选条件
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            找到 {filteredResources.length} 个资源
          </Typography>
          
          <Grid container spacing={3}>
            {getCurrentPageResources().map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    '&:hover': {
                      boxShadow: 3,
                      '& .resource-actions': {
                        opacity: 1
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getResourceTypeIcon(resource.type)}
                        <Typography 
                          variant="caption" 
                          sx={{ ml: 1, color: 'text.secondary' }}
                        >
                          {getResourceTypeName(resource.type)}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleBookmark(resource.id)}
                        color={resource.isBookmarked ? 'primary' : 'default'}
                      >
                        {resource.isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" gutterBottom component="h2">
                      {resource.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2
                      }}
                    >
                      {resource.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip
                        label={getLevelName(resource.level)}
                        size="small"
                        color={
                          resource.level === 'beginner' ? 'success' :
                          resource.level === 'intermediate' ? 'primary' : 'error'
                        }
                        variant="outlined"
                      />
                      <Chip
                        label={resource.category}
                        size="small"
                        variant="outlined"
                      />
                      {resource.isFeatured && (
                        <Chip
                          label="精选"
                          size="small"
                          color="secondary"
                        />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        value={resource.rating} 
                        precision={0.5} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({resource.reviewCount})
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={resource.creator.avatar} 
                          alt={resource.creator.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="caption">
                          {resource.creator.name}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(resource.dateAdded).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      fullWidth
                      startIcon={<GetAppIcon />}
                    >
                      获取资源
                    </Button>
                  </CardActions>
                  
                  <Box 
                    className="resource-actions"
                    sx={{ 
                      position: 'absolute',
                      bottom: 70,
                      right: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      bgcolor: 'background.paper',
                      borderRadius: 1,
                      boxShadow: 1,
                      p: 0.5
                    }}
                  >
                    <IconButton size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="caption">{resource.views}</Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* 分页 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
      
      {/* 贡献资源区域 */}
      <Box 
        sx={{ 
          mt: 6, 
          p: 3, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" gutterBottom>
          分享您的学习资源
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          您有优质的学习资料想要分享给社区吗？上传您的资源，帮助其他学习者进步。
        </Typography>
        <Button variant="contained" color="primary" sx={{ bgcolor: 'primary.dark' }}>
          上传资源
        </Button>
      </Box>
    </Container>
  );
} 
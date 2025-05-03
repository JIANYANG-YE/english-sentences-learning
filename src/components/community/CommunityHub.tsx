import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Avatar, 
  Button, 
  Tabs, 
  Tab, 
  Divider, 
  Badge, 
  Chip,
  CircularProgress
} from '@mui/material';
import { 
  FiUsers, 
  FiMessageCircle, 
  FiBookOpen, 
  FiAward, 
  FiTrendingUp,
  FiCalendar, 
  FiHeart, 
  FiBookmark, 
  FiShare2,
  FiBell
} from 'react-icons/fi';

// 类型定义
interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  badges: string[];
}

interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
  type: 'discussion' | 'question' | 'resource' | 'achievement';
}

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  participants: number;
  category: string;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  level: string;
  topics: string[];
  avatar: string;
}

interface CommunityHubProps {
  userId?: string;
}

// 辅助组件: 活动卡片
const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
    <CardMedia
      component="img"
      height="140"
      image={activity.imageUrl}
      alt={activity.title}
    />
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6">{activity.title}</Typography>
        <Chip 
          size="small" 
          label={activity.category} 
          color={
            activity.category === '挑战' ? 'error' :
            activity.category === '学习活动' ? 'primary' :
            activity.category === '讨论会' ? 'success' : 'default'
          }
        />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {activity.description}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <FiCalendar style={{ marginRight: 4 }} />
          <Typography variant="caption">
            {activity.startDate} - {activity.endDate}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <FiUsers style={{ marginRight: 4 }} />
          <Typography variant="caption">{activity.participants} 人参与</Typography>
        </Box>
      </Box>
      <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 2 }}
        size="small"
      >
        参与活动
      </Button>
    </CardContent>
  </Card>
);

// 辅助组件: 动态流项目
const FeedItem: React.FC<{ post: Post }> = ({ post }) => (
  <Card sx={{ mb: 2, boxShadow: 1, borderRadius: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar src={post.author.avatar} sx={{ mr: 1 }} />
        <Box>
          <Typography variant="subtitle2">{post.author.name}</Typography>
          <Typography variant="caption" color="text.secondary">{post.timestamp}</Typography>
        </Box>
        {post.type === 'question' && (
          <Chip size="small" label="问题" color="warning" sx={{ ml: 'auto' }} />
        )}
        {post.type === 'resource' && (
          <Chip size="small" label="资源" color="info" sx={{ ml: 'auto' }} />
        )}
        {post.type === 'achievement' && (
          <Chip size="small" label="成就" color="success" sx={{ ml: 'auto' }} />
        )}
      </Box>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        {post.content}
      </Typography>
      
      {post.imageUrl && (
        <Box mb={2}>
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            style={{ width: '100%', borderRadius: 8, maxHeight: 300, objectFit: 'cover' }}
          />
        </Box>
      )}
      
      <Box display="flex" gap={1} mb={1}>
        {post.tags.map(tag => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box display="flex" justifyContent="space-between">
        <Button startIcon={<FiHeart />} size="small" color="inherit">
          {post.likes}
        </Button>
        <Button startIcon={<FiMessageCircle />} size="small" color="inherit">
          {post.comments}
        </Button>
        <Button startIcon={<FiBookmark />} size="small" color="inherit">
          收藏
        </Button>
        <Button startIcon={<FiShare2 />} size="small" color="inherit">
          分享
        </Button>
      </Box>
    </CardContent>
  </Card>
);

// 辅助组件: 学习小组卡片
const StudyGroupCard: React.FC<{ group: StudyGroup }> = ({ group }) => (
  <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar src={group.avatar} sx={{ width: 50, height: 50, mr: 2 }} />
        <Box>
          <Typography variant="h6">{group.name}</Typography>
          <Box display="flex" alignItems="center">
            <Chip 
              size="small" 
              label={group.level} 
              color={
                group.level === '初级' ? 'primary' :
                group.level === '中级' ? 'warning' :
                group.level === '高级' ? 'error' : 'default'
              }
              sx={{ mr: 1 }}
            />
            <Typography variant="caption">
              <FiUsers style={{ verticalAlign: 'middle', marginRight: 4 }} />
              {group.members} 成员
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {group.description}
      </Typography>
      
      <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
        {group.topics.map(topic => (
          <Chip key={topic} label={topic} size="small" variant="outlined" />
        ))}
      </Box>
      
      <Button 
        variant="outlined" 
        fullWidth
        size="small"
      >
        加入小组
      </Button>
    </CardContent>
  </Card>
);

// 辅助组件: 资源库预览
const ResourcePreview: React.FC = () => (
  <Card sx={{ mb: 3, p: 2, borderRadius: 2 }}>
    <Box display="flex" alignItems="center" mb={2}>
      <FiBookOpen size={24} style={{ marginRight: 12 }} />
      <Typography variant="h6">资源库精选</Typography>
    </Box>
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {[
        { title: "英语口语实用表达100句", type: "文档", downloads: 320 },
        { title: "四级必备语法详解", type: "视频", downloads: 156 },
        { title: "商务英语面试指南", type: "音频", downloads: 98 },
        { title: "旅游英语情景对话", type: "练习", downloads: 205 }
      ].map((resource, index) => (
        <Box 
          key={index}
          sx={{ 
            width: { xs: '100%', sm: 'calc(50% - 8px)' },
            p: 1.5, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Typography variant="subtitle2" noWrap>{resource.title}</Typography>
          <Box display="flex" justifyContent="space-between">
            <Chip size="small" label={resource.type} />
            <Typography variant="caption">{resource.downloads} 次下载</Typography>
          </Box>
        </Box>
      ))}
    </Box>
    
    <Button 
      fullWidth 
      sx={{ mt: 2 }} 
      endIcon={<FiBookOpen />}
    >
      浏览全部资源
    </Button>
  </Card>
);

// 主组件
const CommunityHub: React.FC<CommunityHubProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [feed, setFeed] = useState<Post[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 模拟数据加载
  useEffect(() => {
    const loadCommunityData = async () => {
      // 这里将来会从API获取数据
      setTimeout(() => {
        // 模拟活动数据
        setActivities([
          {
            id: '1',
            title: '21天英语口语挑战',
            description: '每天练习10分钟口语，21天养成习惯，提升英语表达能力',
            imageUrl: '/images/community/challenge1.jpg',
            startDate: '2023-05-10',
            endDate: '2023-05-31',
            participants: 1256,
            category: '挑战'
          },
          {
            id: '2',
            title: '商务英语写作工作坊',
            description: '学习撰写专业商务邮件、报告和提案的技巧和模板',
            imageUrl: '/images/community/workshop1.jpg',
            startDate: '2023-05-15',
            endDate: '2023-05-16',
            participants: 342,
            category: '学习活动'
          },
          {
            id: '3',
            title: '英语电影欣赏会：《国王的演讲》',
            description: '一起观看经典英语电影，分析语言点，探讨文化背景',
            imageUrl: '/images/community/movie1.jpg',
            startDate: '2023-05-20',
            endDate: '2023-05-20',
            participants: 128,
            category: '讨论会'
          }
        ]);
        
        // 模拟动态流数据
        setFeed([
          {
            id: '1',
            author: {
              id: 'user1',
              name: '王小英',
              avatar: '/images/avatars/user1.jpg',
              level: 4,
              badges: ['语法大师', '勤奋学习者']
            },
            content: '今天完成了"日常对话"专题的学习，感觉口语表达能力有了明显提升！分享一下我整理的笔记，希望对大家有帮助。',
            likes: 24,
            comments: 5,
            timestamp: '2小时前',
            tags: ['日常对话', '口语练习', '学习笔记'],
            type: 'discussion'
          },
          {
            id: '2',
            author: {
              id: 'user2',
              name: '李学习',
              avatar: '/images/avatars/user2.jpg',
              level: 3,
              badges: ['词汇达人']
            },
            content: '有人能解释一下英语中的虚拟语气用法吗？特别是在if条件句中的使用，总是搞混。',
            likes: 8,
            comments: 12,
            timestamp: '4小时前',
            tags: ['语法', '虚拟语气', '求助'],
            type: 'question'
          },
          {
            id: '3',
            author: {
              id: 'user3',
              name: '赵老师',
              avatar: '/images/avatars/user3.jpg',
              level: 7,
              badges: ['内容贡献者', '优秀导师']
            },
            content: '我整理了一份"面试英语100句"资料，包含常见面试问题和高分回答范例，希望对正在找工作的同学有所帮助！',
            imageUrl: '/images/community/resource1.jpg',
            likes: 67,
            comments: 15,
            timestamp: '昨天',
            tags: ['面试英语', '求职', '学习资料'],
            type: 'resource'
          },
          {
            id: '4',
            author: {
              id: 'user4',
              name: '张英语',
              avatar: '/images/avatars/user4.jpg',
              level: 5,
              badges: ['听力达人']
            },
            content: '刚刚完成了"英语流利说30天挑战"！从最初的紧张结巴到现在能够较为流畅地表达，真的感受到了坚持的力量！',
            imageUrl: '/images/community/achievement1.jpg',
            likes: 96,
            comments: 32,
            timestamp: '2天前',
            tags: ['学习成就', '口语挑战', '学习心得'],
            type: 'achievement'
          }
        ]);
        
        // 模拟学习小组数据
        setStudyGroups([
          {
            id: 'group1',
            name: '商务英语学习小组',
            description: '专注于商务场景英语学习，包括邮件写作、会议沟通、谈判技巧等',
            members: 78,
            level: '中级',
            topics: ['商务英语', '职场沟通', '邮件写作'],
            avatar: '/images/groups/business.jpg'
          },
          {
            id: 'group2',
            name: '英语口语练习俱乐部',
            description: '每周线上会话练习，帮助成员克服口语障碍，提升口语流利度',
            members: 156,
            level: '初级',
            topics: ['口语练习', '发音', '日常对话'],
            avatar: '/images/groups/speaking.jpg'
          },
          {
            id: 'group3',
            name: '托福备考互助组',
            description: '共同备战托福考试，分享备考资料、解题技巧和学习方法',
            members: 120,
            level: '高级',
            topics: ['托福', '考试技巧', '学术英语'],
            avatar: '/images/groups/toefl.jpg'
          }
        ]);
        
        setIsLoading(false);
      }, 1000); // 模拟网络延迟
    };
    
    loadCommunityData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>加载社区内容...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* 社区头部 */}
      <Box 
        sx={{
          mb: 4, 
          p: 3, 
          borderRadius: 3, 
          bgcolor: 'primary.main', 
          color: 'white',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: 3
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          英语学习社区
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
          在这里分享你的学习经验，寻求帮助，结交学习伙伴
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ fontWeight: 'bold' }}
            startIcon={<FiMessageCircle />}
          >
            发起讨论
          </Button>
          <Button 
            variant="outlined" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'white' }}
            startIcon={<FiUsers />}
          >
            寻找学习伙伴
          </Button>
        </Box>
      </Box>

      {/* 主体内容 */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
        {/* 左侧边栏：当前活动 */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, px: 1.5, mb: { xs: 3, md: 0 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FiCalendar style={{ marginRight: 8 }} />
              当前活动
            </Typography>
            
            {activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 1 }}
            >
              查看全部活动
            </Button>
          </Box>
        </Box>
        
        {/* 中间主内容区 */}
        <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1.5 }}>
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<FiTrendingUp />} label="热门" />
              <Tab icon={<FiBell />} label="最新" />
              <Tab icon={<FiUsers />} label="关注" />
            </Tabs>
            
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ width: 40, height: 40, mr: 1 }} 
                src="/images/avatars/default.jpg"
              />
              <Button 
                fullWidth 
                variant="outlined" 
                sx={{ 
                  justifyContent: 'flex-start', 
                  pl: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  height: 48
                }}
              >
                分享你的学习心得或提问...
              </Button>
            </Box>
          </Card>
          
          {/* 动态列表 */}
          {feed.map(post => (
            <FeedItem key={post.id} post={post} />
          ))}
          
          <Box display="flex" justifyContent="center" mt={4}>
            <Button variant="outlined">加载更多内容</Button>
          </Box>
        </Box>
        
        {/* 右侧边栏：推荐资源和学习小组 */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, px: 1.5, mt: { xs: 3, md: 0 } }}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            {/* 资源库预览 */}
            <ResourcePreview />
            
            {/* 推荐学习小组 */}
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <FiUsers style={{ marginRight: 8 }} />
              推荐学习小组
            </Typography>
            
            {studyGroups.map(group => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
            
            <Button 
              fullWidth 
              variant="outlined" 
              sx={{ mt: 1 }}
            >
              浏览全部学习小组
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default CommunityHub; 
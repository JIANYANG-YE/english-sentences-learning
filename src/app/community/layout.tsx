'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Tabs, 
  Tab, 
  Container, 
  Breadcrumbs, 
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { 
  Home as HomeIcon,
  Forum as ForumIcon,
  MenuBook as ResourceIcon,
  Group as GroupIcon,
  EmojiEvents as TrophyIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { usePathname } from 'next/navigation';

/**
 * 社区页面布局组件
 */
export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // 获取当前活动选项卡
  const getActiveTab = () => {
    if (pathname === '/community') return 0;
    if (pathname.includes('/community/discussions')) return 1;
    if (pathname.includes('/community/resources')) return 2;
    if (pathname.includes('/community/leaderboard')) return 3;
    if (pathname.includes('/community/events')) return 4;
    return 0;
  };
  
  // 获取面包屑路径
  const getBreadcrumbPath = () => {
    const paths = [
      { label: '首页', href: '/', icon: <HomeIcon fontSize="small" /> },
      { label: '社区', href: '/community', icon: <GroupIcon fontSize="small" /> }
    ];
    
    if (pathname === '/community') {
      return paths;
    }
    
    if (pathname.includes('/community/discussions')) {
      paths.push({ label: '讨论区', href: '/community/discussions', icon: <ForumIcon fontSize="small" /> });
      
      // 如果是具体讨论帖
      if (pathname !== '/community/discussions') {
        const discussionId = pathname.split('/').pop();
        if (discussionId) {
          paths.push({ label: `帖子 #${discussionId}`, href: pathname, icon: null });
        }
      }
    } else if (pathname.includes('/community/resources')) {
      paths.push({ label: '资源库', href: '/community/resources', icon: <ResourceIcon fontSize="small" /> });
      
      // 如果是具体资源
      if (pathname !== '/community/resources') {
        const resourceId = pathname.split('/').pop();
        if (resourceId) {
          paths.push({ label: `资源 #${resourceId}`, href: pathname, icon: null });
        }
      }
    } else if (pathname.includes('/community/leaderboard')) {
      paths.push({ label: '声誉排行榜', href: '/community/leaderboard', icon: <TrophyIcon fontSize="small" /> });
    } else if (pathname.includes('/community/events')) {
      paths.push({ label: '社区活动', href: '/community/events', icon: <GroupIcon fontSize="small" /> });
    } else if (pathname.includes('/community/profile')) {
      paths.push({ label: '用户资料', href: pathname, icon: null });
    }
    
    return paths;
  };
  
  // 获取页面标题
  const getPageTitle = () => {
    if (pathname === '/community') {
      return '社区主页';
    }
    
    if (pathname.includes('/community/discussions')) {
      if (pathname === '/community/discussions') {
        return '社区讨论区';
      }
      return '讨论详情';
    }
    
    if (pathname.includes('/community/resources')) {
      if (pathname === '/community/resources') {
        return '社区资源库';
      }
      return '资源详情';
    }
    
    if (pathname.includes('/community/leaderboard')) {
      return '社区声誉排行榜';
    }
    
    if (pathname.includes('/community/events')) {
      return '社区活动';
    }
    
    if (pathname.includes('/community/profile')) {
      return '用户资料';
    }
    
    return '社区';
  };
  
  // 渲染面包屑
  const renderBreadcrumbs = () => {
    const paths = getBreadcrumbPath();
    
    return (
      <Breadcrumbs aria-label="面包屑导航" sx={{ mb: 1, ml: { xs: 1, sm: 0 } }}>
        {paths.map((path, index) => (
          <Box
            key={path.href}
            component={index === paths.length - 1 ? 'span' : Link}
            href={index === paths.length - 1 ? undefined : path.href}
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: index === paths.length - 1 ? 'text.primary' : 'text.secondary',
              textDecoration: 'none',
              '&:hover': index === paths.length - 1 ? {} : { textDecoration: 'underline' }
            }}
          >
            {path.icon && <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>{path.icon}</Box>}
            <Typography variant="body2" component="span" fontWeight={index === paths.length - 1 ? 'medium' : 'normal'}>
              {path.label}
            </Typography>
          </Box>
        ))}
      </Breadcrumbs>
    );
  };
  
  // 渲染返回按钮（仅在详情页面上的移动端显示）
  const shouldShowBackButton = () => {
    if (isMobile) {
      if (
        (pathname.includes('/community/discussions') && pathname !== '/community/discussions') ||
        (pathname.includes('/community/resources') && pathname !== '/community/resources') ||
        pathname.includes('/community/profile')
      ) {
        return true;
      }
    }
    return false;
  };
  
  // 获取返回链接
  const getBackLink = () => {
    if (pathname.includes('/community/discussions') && pathname !== '/community/discussions') {
      return '/community/discussions';
    }
    if (pathname.includes('/community/resources') && pathname !== '/community/resources') {
      return '/community/resources';
    }
    if (pathname.includes('/community/profile')) {
      return '/community';
    }
    return '/community';
  };
  
  return (
    <Box>
      {/* 社区导航栏 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Tabs 
            value={getActiveTab()} 
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="社区导航选项卡"
            sx={{ minHeight: 48 }}
          >
            <Tab 
              label="社区首页" 
              component={Link}
              href="/community"
              sx={{ minHeight: 48, py: 1 }}
            />
            <Tab 
              label="讨论区" 
              component={Link}
              href="/community/discussions"
              sx={{ minHeight: 48, py: 1 }}
            />
            <Tab 
              label="资源库" 
              component={Link}
              href="/community/resources"
              sx={{ minHeight: 48, py: 1 }}
            />
            <Tab 
              label="声誉排行榜" 
              component={Link}
              href="/community/leaderboard"
              sx={{ minHeight: 48, py: 1 }}
            />
            <Tab 
              label="社区活动" 
              component={Link}
              href="/community/events"
              sx={{ minHeight: 48, py: 1 }}
            />
          </Tabs>
        </Container>
      </Box>
      
      {/* 面包屑和页面标题 */}
      <Container maxWidth="lg">
        <Box sx={{ mt: 2, mb: 1, display: 'flex', alignItems: 'center' }}>
          {shouldShowBackButton() && (
            <IconButton 
              component={Link} 
              href={getBackLink()}
              sx={{ mr: 1 }}
              aria-label="返回"
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }}>
            {renderBreadcrumbs()}
            <Typography variant="h5" component="h1" fontWeight="bold" sx={{ ml: { xs: 1, sm: 0 } }}>
              {getPageTitle()}
            </Typography>
          </Box>
        </Box>
      </Container>
      
      <Box sx={{ pb: 6 }}>
        {children}
      </Box>
    </Box>
  );
} 
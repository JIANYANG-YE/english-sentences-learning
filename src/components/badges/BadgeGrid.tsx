import React, { useState } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  TextField,
  Pagination,
  SelectChangeEvent,
  CircularProgress,
  Alert
} from '@mui/material';
import BadgeCard from './BadgeCard';
import { Badge, BadgeType, BadgeRarity } from '@/services/badgeService';
import { useBadgeFilters } from '@/hooks/useBadges';

// 组件属性接口
export interface BadgeGridProps {
  badges: Badge[];
  title?: string;
  onBadgeClick?: (badge: Badge) => void;
  loading?: boolean;
  error?: Error | null;
  cardSize?: 'small' | 'medium' | 'large';
  showFilters?: boolean;
  emptyMessage?: string;
  userBadges?: Badge[];
}

/**
 * 徽章网格组件
 * 显示多个徽章卡片，支持筛选和分页
 */
const BadgeGrid: React.FC<BadgeGridProps> = ({
  badges,
  title,
  onBadgeClick,
  loading = false,
  error = null,
  cardSize = 'medium',
  showFilters = true,
  emptyMessage = '没有找到符合条件的徽章',
  userBadges = []
}) => {
  // 每页显示的徽章数量
  const getItemsPerPage = () => {
    switch (cardSize) {
      case 'small': return 12;
      case 'large': return 6;
      default: return 8;
    }
  };
  
  // 使用筛选钩子
  const { filteredBadges, filters, updateFilter, resetFilters } = useBadgeFilters(badges);
  
  // 分页状态
  const [page, setPage] = useState(1);
  const itemsPerPage = getItemsPerPage();
  const pageCount = Math.ceil(filteredBadges.length / itemsPerPage);
  
  // 当前页的徽章
  const currentBadges = filteredBadges.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  // 处理筛选器变更
  const handleFilterChange = (name: string) => (event: SelectChangeEvent | React.ChangeEvent<HTMLInputElement>) => {
    updateFilter(name, event.target.value);
    setPage(1); // 重置到第一页
  };
  
  // 处理分页变更
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  // 检查徽章是否已解锁
  const isBadgeUnlocked = (badge: Badge) => {
    return userBadges.some(userBadge => userBadge.id === badge.id);
  };
  
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
      )}
      
      {/* 筛选器 */}
      {showFilters && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="badge-type-label">徽章类型</InputLabel>
              <Select
                labelId="badge-type-label"
                value={filters.type || 'all'}
                label="徽章类型"
                onChange={handleFilterChange('type')}
              >
                <MenuItem value="all">全部类型</MenuItem>
                {Object.values(BadgeType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === BadgeType.STREAK && '连续学习'}
                    {type === BadgeType.MILESTONE && '学习里程碑'}
                    {type === BadgeType.SKILL && '技能掌握'}
                    {type === BadgeType.CHALLENGE && '挑战完成'}
                    {type === BadgeType.SPECIAL && '特殊成就'}
                    {type === BadgeType.EVENT && '活动徽章'}
                    {type === BadgeType.COMMUNITY && '社区贡献'}
                    {type === BadgeType.SEASONAL && '季节性徽章'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="badge-rarity-label">稀有度</InputLabel>
              <Select
                labelId="badge-rarity-label"
                value={filters.rarity || 'all'}
                label="稀有度"
                onChange={handleFilterChange('rarity')}
              >
                <MenuItem value="all">全部稀有度</MenuItem>
                {Object.values(BadgeRarity).map((rarity) => (
                  <MenuItem key={rarity} value={rarity}>
                    {rarity === BadgeRarity.COMMON && '普通'}
                    {rarity === BadgeRarity.RARE && '稀有'}
                    {rarity === BadgeRarity.EPIC && '史诗'}
                    {rarity === BadgeRarity.LEGENDARY && '传奇'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="badge-unlock-label">解锁状态</InputLabel>
              <Select
                labelId="badge-unlock-label"
                value={filters.unlocked?.toString() || 'all'}
                label="解锁状态"
                onChange={handleFilterChange('unlocked')}
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value="true">已解锁</MenuItem>
                <MenuItem value="false">未解锁</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="搜索徽章"
              value={filters.search || ''}
              onChange={handleFilterChange('search')}
              placeholder="输入徽章名称或描述"
            />
          </Grid>
        </Grid>
      )}
      
      {/* 加载状态 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* 错误信息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message || '加载徽章时出错'}
        </Alert>
      )}
      
      {/* 徽章网格 */}
      {!loading && !error && (
        <>
          {currentBadges.length > 0 ? (
            <Grid container spacing={3}>
              {currentBadges.map((badge) => (
                <Grid item key={badge.id} xs={12} sm={6} md={4} lg={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <BadgeCard
                      badge={badge}
                      onClick={onBadgeClick}
                      size={cardSize}
                      isLocked={userBadges.length > 0 && !isBadgeUnlocked(badge)}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Box>
          )}
          
          {/* 分页 */}
          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default BadgeGrid; 
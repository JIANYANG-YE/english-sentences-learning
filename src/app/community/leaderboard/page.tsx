'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Avatar,
  TablePagination,
  InputBase,
  IconButton,
  Skeleton,
  Chip,
  useTheme,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import ReputationBadge from '@/components/community/ReputationBadge';
import { useReputationLeaderboard } from '@/services/communityReputationService';

/**
 * 社区声誉排行榜页面
 * 展示用户声誉排名和荣誉榜
 */
export default function LeaderboardPage() {
  const theme = useTheme();
  const [limit, setLimit] = useState<number>(20);
  const [page, setPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // 使用自定义Hook获取排行榜数据
  const { leaderboardData, isLoading, error } = useReputationLeaderboard(100); // 获取更多数据用于分页
  
  // 处理页码变更
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 处理每页数量变更
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // 处理搜索
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // 搜索逻辑在过滤数据时应用
  };
  
  // 过滤排行榜数据
  const filteredData = leaderboardData
    ? leaderboardData.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // 应用分页
  const paginatedData = filteredData.slice(page * limit, page * limit + limit);
  
  // 获取排名序号
  const getRankNumber = (index: number) => {
    return page * limit + index + 1;
  };
  
  // 渲染排名标识（前三名特殊显示）
  const renderRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <Box sx={{
          backgroundColor: 'gold',
          color: 'black',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          1
        </Box>
      );
    } else if (rank === 2) {
      return (
        <Box sx={{
          backgroundColor: 'silver',
          color: 'black',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          2
        </Box>
      );
    } else if (rank === 3) {
      return (
        <Box sx={{
          backgroundColor: '#cd7f32', // 铜色
          color: 'white',
          borderRadius: '50%',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold'
        }}>
          3
        </Box>
      );
    } else {
      return (
        <Typography variant="body2" color="textSecondary">
          {rank}
        </Typography>
      );
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          社区声誉排行榜
        </Typography>
        <Typography variant="body1" color="textSecondary">
          查看社区中声誉最高的用户，通过积极参与和贡献提升您的排名。
        </Typography>
      </Box>
      
      <Paper elevation={0} variant="outlined" sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box component="form" onSubmit={handleSearch}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                pl: 2
              }}>
                <InputBase
                  placeholder="搜索用户..."
                  sx={{ ml: 1, flex: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <TrophyIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2">
                排行榜每5分钟更新一次 | 上次更新: {new Date().toLocaleTimeString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          加载排行榜数据失败：{error.message}
        </Alert>
      )}
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="70px">排名</TableCell>
              <TableCell>用户</TableCell>
              <TableCell align="center">等级</TableCell>
              <TableCell align="right">声誉分</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // 加载状态
              Array.from(new Array(10)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton variant="text" /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                      <Skeleton variant="text" width={150} />
                    </Box>
                  </TableCell>
                  <TableCell align="center"><Skeleton variant="text" /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" /></TableCell>
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              // 有数据
              paginatedData.map((user, index) => (
                <TableRow 
                  key={user.userId}
                  hover
                  sx={{ 
                    '&:nth-of-type(1)': { backgroundColor: 'rgba(255, 215, 0, 0.05)' },
                    '&:nth-of-type(2)': { backgroundColor: 'rgba(192, 192, 192, 0.05)' },
                    '&:nth-of-type(3)': { backgroundColor: 'rgba(205, 127, 50, 0.05)' },
                  }}
                >
                  <TableCell>
                    {renderRankBadge(getRankNumber(index))}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={`/api/user/${user.userId}/avatar`} 
                        alt={user.username}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <ReputationBadge 
                      level={user.level} 
                      score={user.score} 
                      variant="chip"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold">
                      {user.score.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // 无数据
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="textSecondary">
                    没有找到匹配的用户
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          labelRowsPerPage="每页行数:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </TableContainer>
    </Container>
  );
} 
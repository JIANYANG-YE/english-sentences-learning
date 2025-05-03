import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Book as BookIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLocalization, Translate } from '../i18n/LocalizationProvider';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

interface GlobalHeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  avatarUrl?: string;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  isLoggedIn = false,
  username = '',
  avatarUrl = ''
}) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { translate } = useLocalization();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  
  const profileMenuOpen = Boolean(anchorEl);
  
  const navigation = [
    { path: '/', label: 'nav.home', icon: <HomeIcon /> },
    { path: '/courses', label: 'nav.courses', icon: <BookIcon /> },
    { path: '/practice', label: 'nav.practice', icon: <SchoolIcon /> },
    { path: '/profile', label: 'nav.profile', icon: <PersonIcon /> },
    { path: '/settings', label: 'nav.settings', icon: <SettingsIcon /> }
  ];
  
  const renderDrawer = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" component="div" sx={{ my: 1 }}>
          <Translate messageKey="app.title" />
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigation.map((item) => (
          <ListItem
            button
            key={item.path}
            component={Link}
            href={item.path}
            selected={router.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={translate(item.label)} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <LanguageSwitcher variant="full" />
      </Box>
    </Box>
  );
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Translate messageKey="app.title" />
          </Typography>
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navigation.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  href={item.path}
                  sx={{
                    mx: 1,
                    fontWeight: router.pathname === item.path ? 'bold' : 'normal',
                    borderBottom: router.pathname === item.path ? '2px solid white' : 'none'
                  }}
                >
                  {translate(item.label)}
                </Button>
              ))}
            </Box>
          )}
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 2 }}>
              <LanguageSwitcher 
                variant={isMobile ? 'icon' : 'text'} 
                size="small" 
              />
            </Box>
            
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  aria-controls={profileMenuOpen ? 'profile-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen ? 'true' : undefined}
                  color="inherit"
                >
                  <Avatar
                    alt={username}
                    src={avatarUrl}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={profileMenuOpen}
                  onClose={handleProfileMenuClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile-button',
                  }}
                >
                  <MenuItem onClick={handleProfileMenuClose} component={Link} href="/profile">
                    <Translate messageKey="profile.profile" />
                  </MenuItem>
                  <MenuItem onClick={handleProfileMenuClose} component={Link} href="/settings">
                    <Translate messageKey="nav.settings" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleProfileMenuClose}>
                    <Translate messageKey="auth.logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} href="/login">
                  <Translate messageKey="auth.login" />
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  href="/register"
                  sx={{ ml: 1 }}
                >
                  <Translate messageKey="auth.register" />
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {renderDrawer()}
      </Drawer>
    </>
  );
};

export default GlobalHeader; 
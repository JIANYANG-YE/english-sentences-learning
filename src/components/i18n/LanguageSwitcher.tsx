import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Tooltip
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLocalization, SupportedLanguage } from './LocalizationProvider';

interface LanguageSwitcherProps {
  variant?: 'icon' | 'text' | 'full';
  size?: 'small' | 'medium' | 'large';
  showCurrentLanguage?: boolean;
}

/**
 * 语言切换组件，支持不同展示样式
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'full',
  size = 'medium',
  showCurrentLanguage = true
}) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } = useLocalization();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // 获取所有可用语言
  const availableLanguages = getAvailableLanguages();
  
  // 获取当前语言的本地名称
  const currentLanguageConfig = availableLanguages.find(lang => lang.code === currentLanguage);
  const currentLanguageName = currentLanguageConfig?.localName || '';

  // 处理菜单打开
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 处理菜单关闭
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 处理语言选择
  const handleLanguageSelect = (languageCode: SupportedLanguage) => {
    changeLanguage(languageCode);
    handleClose();
  };

  // 根据variant确定按钮内容
  const getButtonContent = () => {
    switch (variant) {
      case 'icon':
        return (
          <TranslateIcon fontSize={size === 'large' ? 'medium' : size === 'small' ? 'small' : 'medium'} />
        );
      
      case 'text':
        return (
          showCurrentLanguage ? currentLanguageName : <TranslateIcon fontSize="small" />
        );
        
      case 'full':
      default:
        return (
          <>
            <TranslateIcon sx={{ mr: 1 }} fontSize="small" />
            {showCurrentLanguage && (
              <Typography component="span" variant="body2" sx={{ mr: 0.5 }}>
                {currentLanguageName}
              </Typography>
            )}
            <KeyboardArrowDownIcon fontSize="small" />
          </>
        );
    }
  };

  return (
    <Box>
      <Tooltip title="切换语言">
        <Button
          id="language-button"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          size={size}
          sx={{
            minWidth: variant === 'icon' ? 'auto' : undefined,
            p: variant === 'icon' ? 1 : undefined
          }}
        >
          {getButtonContent()}
        </Button>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 180,
            maxHeight: 300,
            overflow: 'auto'
          }
        }}
      >
        {availableLanguages.map((language) => (
          <MenuItem 
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            selected={currentLanguage === language.code}
            sx={{
              direction: language.direction,
              justifyContent: 'flex-start'
            }}
          >
            <ListItemText 
              primary={language.localName} 
              secondary={language.name !== language.localName ? language.name : undefined}
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 
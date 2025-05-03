import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Badge } from '@/types/badge';
import confetti from 'canvas-confetti';

interface BadgeUnlockAnimationProps {
  badge: Badge;
  onComplete?: () => void;
  onClose?: () => void;
}

export const BadgeUnlockAnimation: React.FC<BadgeUnlockAnimationProps> = ({
  badge,
  onComplete,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 触发五彩纸屑效果
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // 3秒后自动关闭
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
          }}
        >
          <Paper
            elevation={24}
            sx={{
              position: 'relative',
              padding: 4,
              maxWidth: 400,
              textAlign: 'center',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography variant="h5" color="primary" gutterBottom>
                🎉 恭喜解锁新徽章！
              </Typography>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.4
              }}
            >
              <Box
                component="img"
                src={badge.imageUrl}
                alt={badge.name}
                sx={{
                  width: 120,
                  height: 120,
                  margin: '20px auto',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Typography variant="h6" gutterBottom>
                {badge.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {badge.description}
              </Typography>
            </motion.div>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
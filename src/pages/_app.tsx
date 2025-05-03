import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '../styles/theme';
import '../styles/globals.css';
import LocalizationProvider from '../components/i18n/LocalizationProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default MyApp; 
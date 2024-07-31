import { ChakraProvider, theme } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { AuthContext } from './context/context';
// import { theme } from './utils/theme.ts';

// ----------------------------------------------------------------------

export default function App() {


  return (
    <AuthContext>
      <ChakraProvider theme={theme}>
        <HelmetProvider>
          <BrowserRouter basename='/'>
            <ThemeProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </ChakraProvider>
    </AuthContext>
  );
}

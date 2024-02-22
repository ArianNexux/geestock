import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  height: "100vh"
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Login | GESSTOCK </title>
      </Helmet>

      <StyledRoot>
        {mdUp && (
          <StyledSection>
            <img src="/assets/bg-transport.jpg" style={{ height: "100%" }} alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Iniciar Sessão - GESSTOCK
            </Typography>

            {
              /* <Stack direction="row" spacing={2}>
                 <Button fullWidth size="large" color="inherit" variant="outlined">
                   <Iconify icon="eva:google-fill" color="#DF3E30" width={22} height={22} />
                 </Button>
   
                 <Button fullWidth size="large" color="inherit" variant="outlined">
                   <Iconify icon="eva:facebook-fill" color="#1877F2" width={22} height={22} />
                 </Button>
   
                 <Button fullWidth size="large" color="inherit" variant="outlined">
                   <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={22} height={22} />
                 </Button>
               </Stack>
               */
            }
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                -
              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

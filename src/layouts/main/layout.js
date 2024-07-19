import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
// routes
import { usePathname, useRouter } from 'src/routes/hook';
//
import Footer from './footer';
import Header from './header';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLogged } = useSelector((state) => state.checkout.auth);

  const isHome = pathname === '/';


  //-------------------//  
  useEffect(() => {
    if (isLogged) {
      router.replace(paths.dashboard.root);
    } else {
      const href = '/auth/jwt/login';
      router.replace(href);
    }
  }, [isLogged])

  //------------------//


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        {children}
      </Box>

      {/* <Footer /> */}
    </Box>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};

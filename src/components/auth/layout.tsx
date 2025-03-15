import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // Full height of the viewport
        background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
        color: 'var(--mui-palette-common-white)',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={170} />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 3, width: '100%' }}>
        <Box sx={{ maxWidth: '450px', width: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

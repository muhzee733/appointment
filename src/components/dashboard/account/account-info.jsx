'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function AccountInfo({ userData, error, loading }) {
  return (
    <Card>
      <CardContent>
        {loading ? (
          <Typography textAlign="center" variant="body1">
            Loading...
          </Typography>
        ) : error ? (
          <Typography textAlign="center" color="error" variant="body1">
            {error}
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <Avatar src={userData?.avatar || '/assets/avatar.png'} sx={{ height: '80px', width: '80px' }} />
            </div>
            <Stack spacing={1} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{(userData?.name || 'Unknown User').toUpperCase()}</Typography>
              <Typography color="text.secondary" variant="body2">
                {(userData?.city || 'Unknown City').toUpperCase()}, {userData?.country || 'Australia'}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {(userData?.timezone || 'Unknown Timezone').toUpperCase()}
              </Typography>
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    profile: '/dashboard/profile',
    chat: '/dashboard/chat',
  },
  errors: { notFound: '/errors/not-found' },
} as const;

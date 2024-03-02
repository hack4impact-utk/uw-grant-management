import withAuth from 'next-auth/middleware';

// This is the actual middleware for pages. Will protect all pages and redirect to signin if not authenticated.
// If you want to disable authentication, set the environment variable NEXT_PUBLIC_DISABLE_AUTH to 'true'
let middleware = withAuth({
  pages: {
    signIn: '/auth/signin',
  },
});

if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
  console.warn('Authentication is disabled');
  middleware = () => {}; // Assign an empty function to middleware
}

export default middleware;

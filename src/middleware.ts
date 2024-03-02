import withAuth from 'next-auth/middleware';

/*
    Currently secures all pages within the application.
*/
export default withAuth({
  // Matches the pages config in `[...nextauth]`
  pages: {
    signIn: '/auth/signin',
  },
});

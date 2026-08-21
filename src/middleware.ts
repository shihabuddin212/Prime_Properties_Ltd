import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/admin/login',
    },
});

export const config = {
    matcher: [
        // Protect all sub-routes of /admin except /admin/login
        '/admin/((?!login).*)',
        '/api/admin/:path*',
    ],
};

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);

const fetchWithTimeout = (url: string, options: RequestInit, timeout: number = 10000): Promise<Response> => {
    return Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
};

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email', placeholder: 'test@test.com' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials) throw new Error('No credentials provided');

                const res = await fetchWithTimeout('https://back.colegiosalgoritmo.edu.pe/api/login', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch');
                }

                const user = await res.json();

                if (user.error) throw new Error(user.error);

                return user;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 15 * 60
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token }) {
            session.user = token as any;
            return session;
        }
    },
    pages: {
        signIn: '/',
        signOut: '/'
    }
});

export { handler as GET, handler as POST };

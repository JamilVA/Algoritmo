import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email', placeholder: 'test@test.com' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials, req) {

                const res = await fetch(`http://localhost:3001/api/login`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const user = await res.json();

                console.log('Usuario:', user, 'fin')

                if (user.error) throw new Error(user.error);

                return user;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 15*60
    },
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        
        async session({ session, token }) {
            session.user = token as any;
            console.log(session)

            return session;
        },
    },
    pages: {
        signIn: '/',
        signOut: '/'
    }
});

export { handler as GET, handler as POST };

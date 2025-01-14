import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import pool from '../../../config/connection'; // Assuming pool is exported from connection.js
import crypto from 'crypto';
import util from 'util';
//https://console.cloud.google.com/
//redirect url http://localhost:3000/api/auth/callback/google   
import GoogleProvider from "next-auth/providers/google";


const query = util.promisify(pool.query).bind(pool);

async function authorize(credentials) {
    const { email, password } = credentials;
    const hash = crypto.createHash('md5').update(password).digest('hex');

    try {
        const rows = await query('SELECT * FROM users WHERE email = ? AND password = ?', [email, hash]);

        if (rows.length) {
            const user = {
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                role: rows[0].role,
                mobile: rows[0].mobile,
                date: rows[0].date,
                imageName: rows[0].imageName,
                password: rows[0].password,
                resetPasswordToken: rows[0].resetPasswordToken,
                resetPasswordExpire: rows[0].resetPasswordExpire,
            };
            return user;
        } else {
            return null;
        }
    } catch (err) {
        console.error('Error executing SQL query:', err);
        return null;
    }
}

export default NextAuth({
    session: {
        jwt: true,
        maxAge: 604800, // Set session duration to 1 week (in seconds)
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            authorize
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),


    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.id = token.id;
                session.user = token.user;
            }
            return session;
        },
    },
});

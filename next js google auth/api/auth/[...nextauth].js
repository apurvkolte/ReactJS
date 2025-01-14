import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import pool from '../../../config/connection'; // Assuming pool is exported from connection.js
import crypto from 'crypto';
import util from 'util';
//next_auth for node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
//https://console.cloud.google.com/
//redirect url http://localhost:3000/api/auth/callback/google   
//# NEXTAUTH_URL=https://www.domain.com
// # NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://www.domain.com/api/auth/callback/google
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

            //adding extra user role
            async profile(profile) {
                // Map the `sub` field (Google's unique identifier) to `id`
                profile.id = profile.sub;
                profile.role = 'user';  // Set role to 'user' for Google login
                profile.imageName = profile.picture;
                return profile;
            }
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
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                try {
                    // Check if the user already exists in your database
                    const existingUserQuery = 'SELECT id FROM users WHERE email = ?';
                    const [existingUser] = await query(existingUserQuery, [user.email]);

                    if (existingUser) {
                        // If the user exists, set their database ID as the user's ID
                        user.id = existingUser.id;
                    } else {
                        // If the user doesn't exist, insert them into the database
                        const insertUserSQL = `
                            INSERT INTO users (id, name, email, mobile, password, role, date, imageName, path, resetPasswordToken, resetPasswordExpire)
                            VALUES (NULL, ?, ?, ?, ?, 'user', NULL, ?, ?, NULL, 0)
                        `;

                        const values = [
                            user.name,  // name
                            user.email, // email
                            '', // mobile (optional, can be left empty or handled separately)
                            '', // password (Google login doesn't require a password)
                            user.imageName,
                            user.id
                        ];

                        const result = await query(insertUserSQL, values);
                        user.id = result.insertId;
                    }

                } catch (err) {
                    console.error('Error during Google login sign-in process:', err);
                    return false;  // Return false to prevent sign-in if any error occurs
                }
            }
            return true;  // Allow sign-in to proceed
        },

    },
});

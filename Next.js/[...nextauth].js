//pages>api>auth>[...nextauth]

import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import connection from '../../../config/connection'
const crypto = require('crypto')
const util = require('util');


export default NextAuth({
    session: {
        jwt: true
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const { email, password } = credentials;
                var hash = crypto.createHash('md5').update(password).digest('hex');

                const query = util.promisify(connection.query).bind(connection);
                const rows = await query(`select * from users where email='${email}' and password='${hash}';`);

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
                    }

                    await util.promisify(connection.end).bind(connection);
                    return Promise.resolve(user);
                } else {
                    return null;
                }

            }
        })
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
                session.user = token.user
            }

            return session;
        },
    },

})


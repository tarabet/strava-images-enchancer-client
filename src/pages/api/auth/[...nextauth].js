import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { API_URL_SIGNIN } from "../../../utils/constants";

export default NextAuth({
  providers: [
    Providers.Credentials({
      async authorize(credentials, req) {
        const baseUrl = process.env.BACKEND_URL

        const res = await fetch(baseUrl + API_URL_SIGNIN, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })

        const user = await res.json()

        if (res.ok && user) {
          return user
        }

        return null
      }
    })
  ],
  jwt: {
    secret: process.env.JWT_SECRET
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (user) {
        token.user = user
      }

      return token
    },
    async session(session, token) {
      const { user } = token

      session.token = user.token
      session.user.name = user?.username
      session.user.id = user?.id
      session.user.roles = user?.roles

      return session
    }
  }
})

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { API_URL_SIGNIN } from "../../../utils/constants";

async function refreshAccessToken(token) {
  try {
    const baseUrl = process.env.BACKEND_URL
    const url = baseUrl + '/api/auth/refreshtoken'

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ refreshToken: token.refreshToken })
    });

    const refreshedTokenResp = await response.json()

    if (!response.ok) {
      throw refreshedTokenResp
    }

    return {
      ...token,
      accessToken: refreshedTokenResp.accessToken,
      refreshToken: refreshedTokenResp.refreshToken ?? token.refreshToken
    }
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

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
    secret: process.env.JWT_SECRET,
    verificationOptions: {
      algorithms: ['HS512']
    }
  },
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (user && account) {
        return {
          accessToken: user.token,
          accessTokenExpires: token.exp,
          refreshToken: user.refreshToken,
          user,
        }
      }

      if (Date.now() < token.exp * 1000) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session(session, token) {
      if (token) {
        session.user = token.user
        session.token = token.accessToken
        session.error = token.error
      }

      return session
    }
  }
})

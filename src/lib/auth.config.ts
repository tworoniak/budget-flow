import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

const PUBLIC_PATHS = ['/sign-in', '/register']

export const authConfig = {
  providers: [
    Google,
    GitHub,
    Credentials({ authorize: async () => null }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      if (PUBLIC_PATHS.some((p) => pathname === p)) return true

      return isLoggedIn
    },
    jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig

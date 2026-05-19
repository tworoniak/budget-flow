import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

const PUBLIC_PATHS = ['/sign-in', '/register', '/forgot-password']

export const authConfig = {
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    Google,
    GitHub,
    Credentials({ authorize: async () => null }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      const isPublic = PUBLIC_PATHS.some((p) => pathname === p)

      if (isPublic && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl))
      }

      return isPublic || isLoggedIn
    },
    jwt({ token, user, profile }) {
      if (user?.id) token.id = user.id
      if (user?.image) token.picture = user.image
      // Use raw OAuth profile picture when available (covers stale DB records)
      const p = profile as Record<string, unknown> | undefined
      if (typeof p?.picture === 'string') token.picture = p.picture
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      if (token.picture) session.user.image = token.picture as string
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig

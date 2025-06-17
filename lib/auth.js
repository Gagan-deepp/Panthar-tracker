import { signinMail } from "@/scripts/auth-action";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
      },
      async authorize(credentials) {

        //get user
        console.log("Credentials ==> ", credentials)
        const user = await signinMail(credentials.email)
        console.log("User in auth ==> ", user)

        if (user.length === 0) {
          return null
        }

        return { ...user[0], id: user[0]?._id, name: user[0]?.name, email: user[0]?.email }
        //Login will be successfull when we return user from here else return null
      },
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const customUser = user

        console.log("Custom user ==> ", customUser)
        token.id = customUser.id
        token.role = customUser.user_role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        (session.user) = {
          email: token.email || "",
          name: token.name || "",
          id: (token).id,
          role: token.role,
        }
      }
      return session
    },
    authorized({ request, auth }) {


      const { pathname } = request.nextUrl

      // Skip auth for static files and Next.js internals
      if (
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/api/') ||
        pathname.includes('.') || // files with extensions
        pathname === '/favicon.ico'
      ) {
        return true
      }


      console.log("Auth status", auth)
      const isLoggedIn = !!auth?.user
      console.log("Is logged in", isLoggedIn)
      console.log("Pathname", pathname)


      if (pathname === "/:path*" && !isLoggedIn) {
        return Response.redirect(new URL("/", request.nextUrl))
      }
      if (pathname === "/" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", request.nextUrl))
      }

      // Allow everyone to access all pages (no protection)
      return true
    }
  },
  pages: {
    signIn: "/"
  }
})
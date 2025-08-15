// lib/authOptions.ts
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // DEV ONLY: อนุญาตถ้ามีอีเมล (ไว้ทดสอบก่อน)
        if (!credentials?.email) return null
        return { id: 'dev-user', name: 'Dev User', email: credentials.email as string }
      },
    }),
  ],
  session: { strategy: 'jwt' },
}

import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    roles?: string[]
  }

  interface Session {
    user: User
  }
} 
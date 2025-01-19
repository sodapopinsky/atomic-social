// src/app/(auth)/login/page.tsx

import LoginButton from "@/components/auth/login-button";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>
        <LoginButton />
      </div>
    </main>
  )
}

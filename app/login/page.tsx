"use client"
import LoginForm from "@/components/forms/LoginForm"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  )
}

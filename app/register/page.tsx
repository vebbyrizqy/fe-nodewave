"use client"
import RegisterForm from "@/components/forms/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <RegisterForm />
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Already registered?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  )
}

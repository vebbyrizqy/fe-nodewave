"use client"

import { useForm } from "react-hook-form"
import { api } from "@/lib/axios"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth"

export default function LoginForm() {
  const { register, handleSubmit, formState } = useForm()
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post("/login", data)
      const { user, token } = res.data?.content || {}
      if (!token || !user) throw new Error("Invalid credentials")

      setAuth(user, token)

      // Arahkan sesuai role
      if (user.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/todo")
      }
    } catch (e: any) {
      alert(e?.response?.data?.message || "Login failed")
    }
  }

  return (
    <>
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
        Sign In
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Just sign in if you have an account in here. Enjoy our website.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Your Email / Username
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="soeraji@squareteam.com"
            className="w-full border rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium text-gray-700">
            Enter Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="********"
            className="w-full border rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <label className="flex items-center gap-1">
            <input type="checkbox" className="h-4 w-4 accent-blue-600" />
            Remember Me
          </label>
          <a href="#" className="text-blue-600 hover:underline">
            Forgot Password
          </a>
        </div>

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="mt-4 w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
        >
          {formState.isSubmitting ? "Loading..." : "Login"}
        </button>
      </form>
    </>
  )
}

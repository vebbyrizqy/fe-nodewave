"use client"

import { useForm } from "react-hook-form"
import { api } from "@/lib/axios"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const { register, handleSubmit, formState } = useForm()
  const router = useRouter()

  const onSubmit = async (data: any) => {
    try {
      await api.post("/register", data)
      alert("Registration successful")
      router.push("/login")
    } catch (e: any) {
      alert(e?.response?.data?.message || "Registration failed")
    }
  }

  return (
    <>
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
        Register
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Let’s sign up first for entering into Square website. Uh She Up!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-2">
          <input
            {...register("firstName")}
            type="text"
            placeholder="First Name"
            className="w-1/2"
          />
          <input
            {...register("lastName")}
            type="text"
            placeholder="Last Name"
            className="w-1/2"
          />
        </div>

        <div className="flex gap-2">
          <input
            {...register("phone")}
            type="text"
            placeholder="+62"
            className="w-1/3"
          />
          <input
            {...register("country")}
            type="text"
            placeholder="Your Country"
            className="w-2/3"
          />
        </div>

        <input
          {...register("email")}
          type="email"
          placeholder="Mail Address"
          className="w-full"
        />

        <div className="flex gap-2">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-1/2"
          />
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Confirm Password"
            className="w-1/2"
          />
        </div>

        <textarea
          {...register("about")}
          rows={3}
          placeholder="Tell us about yourself"
          className="w-full"
        ></textarea>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-1/2 rounded-md bg-gray-100 py-2 text-gray-800 hover:bg-gray-200"
          >
            Login
          </button>
          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-1/2 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
          >
            {formState.isSubmitting ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </>
  )
}

"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/store/auth"
import { toast } from "sonner"
import { CheckCircle, XCircle, Star, UserCircle, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface Todo {
  id: string
  item: string
  isDone: boolean
  createdAt: string
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { token, user, clearAuth } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchTodos()
    }
  }, [token])

  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos")
      setTodos(res.data.content.entries)
    } catch {
      toast.error("Failed to fetch todos")
    }
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return toast.warning("Please enter a task")
    try {
      await api.post("/todos", { item: newTodo })
      setNewTodo("")
      fetchTodos()
      toast.success("Todo added successfully")
    } catch {
      toast.error("Failed to add todo")
    }
  }

  const toggleTodo = async (id: string, isDone: boolean) => {
    try {
      await api.put(`/todos/${id}/mark`, {
        action: isDone ? "UNDONE" : "DONE",
      })
      fetchTodos()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const deleteSelected = async () => {
    if (selectedIds.length === 0)
      return toast.warning("No tasks selected to delete")
    try {
      await Promise.all(selectedIds.map((id) => api.delete(`/todos/${id}`)))
      setSelectedIds([])
      fetchTodos()
      toast.success("Selected todos deleted")
    } catch {
      toast.error("Failed to delete selected todos")
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  // Auto-close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".user-dropdown")) setDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative overflow-hidden">
      {/* Background miring */}
      <div
        className="absolute top-0 left-0 w-full h-[260px] bg-white shadow-sm z-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
        }}
      />

      {/* === Header === */}
      <header className="relative z-20 flex items-center justify-between bg-white/70 backdrop-blur-md px-8 py-3">
        {/* Left - Star + Search */}
        <div className="flex items-center gap-2 rounded-md px-3 py-1 w-60 bg-white/40">
          <Star className="text-gray-400 w-4 h-4" fill="currentColor" />
          <input
            type="text"
            placeholder="Search (Ctrl+/)"
            className="w-full text-sm text-gray-400 outline-none bg-transparent placeholder:text-gray-400"
          />
        </div>

        {/* Right - User Dropdown */}
        <div className="relative user-dropdown">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition"
          >
            <UserCircle className="text-gray-500 w-6 h-6" />
            <span className="text-sm font-medium text-gray-700">
              {user?.fullName || "Guest"}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-2 z-50">
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* === Main Content === */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 mt-4">To Do</h1>

        {/* === Card === */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md flex flex-col border border-gray-200">
          {/* === Add New Task === */}
          <div className="flex flex-col gap-2 mb-5">
            <label className="text-sm text-gray-500">Add a new task</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Type here..."
                className="flex-1 bg-gray-50 border-b-2 border-blue-700 px-3 py-2 text-base font-semibold text-gray-800 rounded-md focus:outline-none focus:ring-0"
              />
              <button
                onClick={addTodo}
                className="bg-[#006AFF] hover:bg-[#0058D6] text-white font-semibold text-sm px-4 py-2 rounded-md transition-colors"
              >
                Add Todo
              </button>
            </div>
          </div>

          {/* === Todo List Scrollable === */}
          <div className="flex-1 space-y-3 overflow-y-auto max-h-[200px] pr-1">
            {todos.length > 0 ? (
              todos.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between border-b border-gray-200 px-1 py-2 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => toggleSelect(t.id)}
                      className="cursor-pointer"
                    />
                    <span
                      className={`font-medium ${
                        t.isDone
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {t.item}
                    </span>
                  </div>

                  {t.isDone ? (
                    <XCircle
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      size={20}
                      onClick={() => toggleTodo(t.id, t.isDone)}
                    />
                  ) : (
                    <CheckCircle
                      className="text-green-500 cursor-pointer hover:text-green-700"
                      size={20}
                      onClick={() => toggleTodo(t.id, t.isDone)}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 italic">No tasks found.</p>
            )}
          </div>

          {/* === Delete Selected === */}
          {todos.length > 0 && (
            <button
              onClick={deleteSelected}
              className="self-start mt-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-md font-semibold shadow-sm"
            >
              Delete Selected
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

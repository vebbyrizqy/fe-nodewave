"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export default function AdminPage() {
  const { token, user, clearAuth } = useAuthStore()
  const router = useRouter()

  const [todos, setTodos] = useState<any[]>([])
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    if (user?.role !== "ADMIN") {
      router.push("/todo")
      return
    }

    fetchTodos()
  }, [page, filter, statusFilter])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const res = await api.get(
        `/todos?search=${filter}&status=${statusFilter}&page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTodos(res.data.content.entries)
      setTotalPage(res.data.content.totalPage)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* === Sidebar === */}
      <aside className="w-60 bg-white shadow-sm border-r flex flex-col">
        <div className="p-5 font-semibold text-lg">Nodewave</div>
        <nav className="flex-1">
          <a
            href="#"
            className="flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-600"
          >
            <span>🏠</span>
            <span>To do</span>
          </a>
        </nav>
      </aside>

      {/* === Main Content === */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center px-8 py-3 bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">To Do</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">
              {user?.fullName}
            </span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              👤
            </div>
            <button
              onClick={() => {
                clearAuth()
                router.push("/login")
              }}
              className="ml-3 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Filter Bar */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 w-64 bg-white">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm w-full outline-none bg-transparent"
              />
            </div>
            <button
              onClick={fetchTodos}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
            >
              Search
            </button>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 text-sm rounded-md px-3 py-2 bg-white"
            >
              <option value="">Filter by Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">To do</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : todos.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No data found
                    </td>
                  </tr>
                ) : (
                  todos.map((todo, i) => (
                    <tr
                      key={todo.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3">{todo.user.fullName}</td>
                      <td className="px-5 py-3">{todo.item}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            todo.isDone
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {todo.isDone ? "Success" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4 items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            <span className="text-sm text-gray-700">{page}</span>
            <button
              disabled={page >= totalPage}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

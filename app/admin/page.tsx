"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/store/auth"
import { useRouter } from "next/navigation"
import { Search, ChevronLeft, Home, UserCircle, ChevronDown } from "lucide-react"

interface User {
  id: string
  email: string
  fullName: string
}

interface Todo {
  id: string
  item: string
  userId: string
  isDone: boolean
  createdAt: string
  updatedAt: string
  user: User
}

export default function AdminPage() {
  const { token, user, clearAuth } = useAuthStore()
  const router = useRouter()

  const [todos, setTodos] = useState<Todo[]>([])
const [filteredTodos, setFilteredTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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
  }, [page, statusFilter])

  const fetchTodos = async () => {
    try {
      setLoading(true)

      let statusParam: string | undefined = undefined
      if (statusFilter === "success") statusParam = "true"
      if (statusFilter === "pending") statusParam = "false"

      const res = await api.get("/todos", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusParam,
          page,
        },
      })

      // fallback status filter
      let fetchedTodos = res.data.content.entries
      if (statusFilter === "success") fetchedTodos = fetchedTodos.filter((todo: { isDone: any }) => todo.isDone)
      if (statusFilter === "pending") fetchedTodos = fetchedTodos.filter((todo: { isDone: any }) => !todo.isDone)

      setTodos(fetchedTodos)
      setFilteredTodos(fetchedTodos)
      setTotalPage(res.data.content.totalPage)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!filter) {
      setFilteredTodos(todos)
      return
    }
    const searchLower = filter.toLowerCase()
    const searched = todos.filter(
      todo =>
        todo.item.toLowerCase().includes(searchLower) ||
        todo.user.fullName.toLowerCase().includes(searchLower)
    )
    setFilteredTodos(searched)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? "w-60" : "w-20"
          } bg-white shadow-sm border-r flex flex-col transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-5">
          {isSidebarOpen && <div className="font-semibold text-lg">Nodewave</div>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <ChevronLeft
              size={20}
              className={`${!isSidebarOpen ? "rotate-180" : ""} transition-transform`}
            />
          </button>
        </div>
        <nav className="flex-1">
          <a
            href="#"
            className={`flex items-center gap-2 px-5 py-2 ${isSidebarOpen ? "justify-start" : "justify-center"
              } bg-blue-50 text-blue-600`}
          >
            <Home size={18} />
            {isSidebarOpen && <span>To do</span>}
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-end items-center px-8 py-3 bg-white shadow-sm relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
            <UserCircle className="w-8 h-8 text-gray-500" />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-8 top-12 w-40 bg-white rounded-md shadow-md border">
              <button
                onClick={() => {
                  clearAuth()
                  router.push("/login")
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* To Do Card */}
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">To Do</h1>

          <div className="bg-white shadow-sm rounded-2xl overflow-hidden p-5">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-5">
              <input
                type="text"
                placeholder="Search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm w-full sm:w-64 outline-none bg-transparent"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md mt-2 sm:mt-0"
              >
                Search
              </button>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 text-sm rounded-md px-3 py-2 bg-white mt-2 sm:mt-0"
              >
                <option value="">Filter by Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
              </select>
            </div>


            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">To do</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredTodos.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-gray-500">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    filteredTodos.map((todo) => (
                      <tr key={todo.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">{todo.user.fullName}</td>
                        <td className="px-5 py-3">{todo.item}</td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${todo.isDone
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
        </div>
      </main>
    </div>
  )
}

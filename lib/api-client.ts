const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  (typeof window !== "undefined" && window.location.hostname === "localhost" && !process.env.NEXT_PUBLIC_API_URL)

export interface ApiError {
  code: string
  message: string
  timestamp: string
  details?: Record<string, string>
}

import { useDataStore, type Policy, type User } from "./data-store"

export class ApiClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  private async mockRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    const method = options.method || "GET"
    const body = options.body ? JSON.parse(options.body as string) : null

    const dataStore = useDataStore.getState()

    // Create Policy
    if (endpoint === "/policies" && method === "POST") {
      const newPolicy: Policy = {
        id: `policy-${Date.now()}`,
        ...body,
        createdAt: new Date().toISOString(),
      }
      dataStore.addPolicy(newPolicy)
      return newPolicy as T
    }

    // Get all policies
    if (endpoint === "/policies" && method === "GET") {
      return dataStore.getPolicies() as T
    }

    // Get single policy
    if (endpoint.startsWith("/policies/") && method === "GET") {
      const id = endpoint.split("/")[2]
      const policy = dataStore.getPolicies().find((p) => p.id === id)
      if (!policy) throw new Error("Policy not found")
      return policy as T
    }

    // Update policy
    if (endpoint.startsWith("/policies/") && method === "PUT") {
      const id = endpoint.split("/")[2]
      dataStore.updatePolicy(id, body)
      const updated = dataStore.getPolicies().find((p) => p.id === id)
      return updated as T
    }

    // Delete policy
    if (endpoint.startsWith("/policies/") && method === "DELETE") {
      const id = endpoint.split("/")[2]
      dataStore.deletePolicy(id)
      return { success: true } as T
    }

    // Create User
    if (endpoint === "/users" && method === "POST") {
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...body,
        lastLogin: "just now",
      }
      dataStore.addUser(newUser)
      return newUser as T
    }

    // Get all users
    if (endpoint === "/users" && method === "GET") {
      return dataStore.getUsers() as T
    }

    // Update user
    if (endpoint.startsWith("/users/") && method === "PUT") {
      const id = endpoint.split("/")[2]
      dataStore.updateUser(id, body)
      const updated = dataStore.getUsers().find((u) => u.id === id)
      return updated as T
    }

    // Delete user
    if (endpoint.startsWith("/users/") && method === "DELETE") {
      const id = endpoint.split("/")[2]
      dataStore.deleteUser(id)
      return { success: true } as T
    }

    if (endpoint === "/auth/login") {
      return {
        token: "mock-jwt-token-" + Math.random().toString(36).substring(7),
        user: {
          id: "user-1",
          email: "admin@example.com",
          name: "Admin User",
          role: "ADMIN",
        },
      } as T
    }

    if (endpoint === "/audit") {
      return {
        content: [
          {
            id: "audit-1",
            action: "LOGIN",
            userId: "user-1",
            userEmail: "admin@example.com",
            resource: "auth",
            decision: "ALLOW",
            timestamp: new Date().toISOString(),
          },
        ],
      } as T
    }

    if (endpoint === "/authorize") {
      return {
        decision: "ALLOW",
        reason: "Policy match: Admin Access",
        evaluationTime: new Date().toISOString(),
      } as T
    }

    throw new Error(`Mock endpoint not implemented: ${endpoint}`)
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (USE_MOCK) {
      return this.mockRequest<T>(endpoint, options)
    }

    const url = `${API_BASE_URL}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          throw new Error("Authentication failed. Please login again.")
        }

        try {
          const error: ApiError = await response.json()
          throw new Error(error.message || `API Error: ${response.status}`)
        } catch {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch"
      console.error("[v0] API request failed:", {
        url,
        method: options.method || "GET",
        error: errorMessage,
      })
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient()

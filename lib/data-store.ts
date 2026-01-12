import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Policy {
  id: string
  name: string
  description: string
  effect: "allow" | "deny"
  resources: string[]
  actions: string[]
  conditions: string[]
  status: "active" | "inactive"
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  status: "active" | "inactive"
  lastLogin: string
}

interface DataStore {
  policies: Policy[]
  users: User[]
  getPolicies: () => Policy[]
  addPolicy: (policy: Policy) => void
  updatePolicy: (id: string, updates: Partial<Policy>) => void
  deletePolicy: (id: string) => void
  getUsers: () => User[]
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
}

const initialPolicies: Policy[] = [
  {
    id: "policy-1",
    name: "Admin Access",
    description: "Full system access for administrators",
    effect: "allow",
    resources: ["*"],
    actions: ["*"],
    conditions: [],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "policy-2",
    name: "Billing Read-Only",
    description: "Read access to billing reports",
    effect: "allow",
    resources: ["billing:*"],
    actions: ["read"],
    conditions: ["business-hours"],
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "policy-3",
    name: "Developer API Access",
    description: "API access for developers",
    effect: "allow",
    resources: ["api:*"],
    actions: ["read", "write"],
    conditions: ["vpn-required"],
    status: "active",
    createdAt: new Date().toISOString(),
  },
]

const initialUsers: User[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice@company.com",
    roles: ["admin"],
    status: "active",
    lastLogin: "2 hours ago",
  },
  {
    id: "user-2",
    name: "Bob Smith",
    email: "bob@company.com",
    roles: ["developer", "viewer"],
    status: "active",
    lastLogin: "1 day ago",
  },
  {
    id: "user-3",
    name: "Carol White",
    email: "carol@company.com",
    roles: ["viewer"],
    status: "inactive",
    lastLogin: "7 days ago",
  },
]

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      policies: initialPolicies,
      users: initialUsers,
      getPolicies: () => get().policies,
      addPolicy: (policy: Policy) =>
        set((state) => ({
          policies: [...state.policies, policy],
        })),
      updatePolicy: (id: string, updates: Partial<Policy>) =>
        set((state) => ({
          policies: state.policies.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),
      deletePolicy: (id: string) =>
        set((state) => ({
          policies: state.policies.filter((p) => p.id !== id),
        })),
      getUsers: () => get().users,
      addUser: (user: User) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      updateUser: (id: string, updates: Partial<User>) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteUser: (id: string) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),
    }),
    {
      name: "pbac-data-store",
    },
  ),
)

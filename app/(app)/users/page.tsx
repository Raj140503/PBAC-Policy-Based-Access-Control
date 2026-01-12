"use client"
import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Search } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDataStore } from "@/lib/data-store"
import { apiClient } from "@/lib/api-client"

interface User {
  id: string
  name: string
  email: string
  roles: string[]
  status: "active" | "inactive"
  lastLogin: string
}

function UsersContent() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roles: [] as string[],
    status: "active" as const,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubscribe = useDataStore.subscribe(
      (state) => state.users,
      (users) => setUsers(users),
    )
    setUsers(useDataStore.getState().getUsers())
    return unsubscribe
  }, [])

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/30"
      case "developer":
        return "bg-primary/10 text-primary border-primary/30"
      case "viewer":
        return "bg-muted/50 text-muted-foreground border-muted"
      default:
        return "bg-secondary/50 text-secondary-foreground border-secondary"
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      roles: user.roles,
      status: user.status,
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingUser || !formData.name.trim() || !formData.email.trim()) return
    setIsLoading(true)
    try {
      await apiClient.put(`/users/${editingUser.id}`, {
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        status: formData.status,
      })
      setIsEditOpen(false)
      setEditingUser(null)
      setFormData({ name: "", email: "", roles: [], status: "active" })
    } catch (error) {
      console.error("[v0] Failed to update user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    if (!formData.name.trim() || !formData.email.trim() || formData.roles.length === 0) return
    setIsLoading(true)
    try {
      await apiClient.post("/users", {
        name: formData.name,
        email: formData.email,
        roles: formData.roles,
        status: "active",
      })
      setIsAddOpen(false)
      setFormData({ name: "", email: "", roles: [], status: "active" })
    } catch (error) {
      console.error("[v0] Failed to add user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = (id: string) => {
    setUserToDelete(id)
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      setIsLoading(true)
      try {
        await apiClient.delete(`/users/${userToDelete}`)
        setShowDeleteAlert(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("[v0] Failed to delete user:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleRole = (role: string) => {
    if (formData.roles.includes(role)) {
      setFormData({ ...formData, roles: formData.roles.filter((r) => r !== role) })
    } else {
      setFormData({ ...formData, roles: [...formData.roles, role] })
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts and roles</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-card-foreground">Name</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-card-foreground">Email</Label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-card-foreground mb-3 block">Roles</Label>
                <div className="space-y-2">
                  {["admin", "developer", "viewer"].map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.roles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-card-foreground capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddUser} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Email</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Roles</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Last Login</th>
                  <th className="px-6 py-3 text-right font-semibold text-card-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b border-border ${idx % 2 === 0 ? "bg-secondary/10" : ""} hover:bg-secondary/20 transition`}
                  >
                    <td className="px-6 py-4 text-card-foreground">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 bg-primary/20">
                          <AvatarFallback className="text-xs text-primary">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="outline" className={`${getRoleColor(role)}`}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.status === "active" ? "default" : "outline"}
                        className={
                          user.status === "active"
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-muted/50 text-muted-foreground border-muted"
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Edit User</DialogTitle>
            <DialogDescription>Update user information and roles</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-card-foreground">Name</Label>
              <Input
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-card-foreground">Email</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-card-foreground mb-3 block">Roles</Label>
              <div className="space-y-2">
                {["admin", "developer", "viewer"].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="w-4 h-4 rounded border-border"
                    />
                    <span className="text-card-foreground capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-card-foreground">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-secondary text-foreground border-border mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveEdit} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground">Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel className="bg-secondary text-foreground border-border hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersContent />
    </Suspense>
  )
}

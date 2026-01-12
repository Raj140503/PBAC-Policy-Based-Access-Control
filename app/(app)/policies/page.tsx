"use client"
import { Suspense, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Search } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useDataStore, type Policy } from "@/lib/data-store"
import { apiClient } from "@/lib/api-client"

function PoliciesContent() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    effect: "allow" as const,
    resources: "",
    actions: "",
  })

  useEffect(() => {
    const unsubscribe = useDataStore.subscribe(
      (state) => state.policies,
      (policies) => setPolicies(policies),
    )
    setPolicies(useDataStore.getState().getPolicies())
    return unsubscribe
  }, [])

  const filteredPolicies = policies.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreatePolicy = async () => {
    if (!formData.name.trim()) return
    setIsLoading(true)
    try {
      await apiClient.post("/policies", {
        name: formData.name,
        description: formData.description,
        effect: formData.effect,
        resources: formData.resources
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        actions: formData.actions
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        conditions: [],
        status: "active",
      })
      setFormData({ name: "", description: "", effect: "allow", resources: "", actions: "" })
      setIsCreateOpen(false)
    } catch (error) {
      console.error("[v0] Failed to create policy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setFormData({
      name: policy.name,
      description: policy.description,
      effect: policy.effect,
      resources: policy.resources.join(", "),
      actions: policy.actions.join(", "),
    })
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingPolicy || !formData.name.trim()) return
    setIsLoading(true)
    try {
      await apiClient.put(`/policies/${editingPolicy.id}`, {
        name: formData.name,
        description: formData.description,
        effect: formData.effect,
        resources: formData.resources
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        actions: formData.actions
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      })
      setIsEditOpen(false)
      setEditingPolicy(null)
      setFormData({ name: "", description: "", effect: "allow", resources: "", actions: "" })
    } catch (error) {
      console.error("[v0] Failed to update policy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePolicy = (id: string) => {
    setPolicyToDelete(id)
    setShowDeleteAlert(true)
  }

  const confirmDelete = async () => {
    if (policyToDelete) {
      setIsLoading(true)
      try {
        await apiClient.delete(`/policies/${policyToDelete}`)
        setShowDeleteAlert(false)
        setPolicyToDelete(null)
      } catch (error) {
        console.error("[v0] Failed to delete policy:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Policies</h1>
          <p className="text-muted-foreground mt-1">Manage access control policies</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Create New Policy</DialogTitle>
              <DialogDescription>Define a new access control policy</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-card-foreground">Policy Name</Label>
                <Input
                  placeholder="e.g., Admin Access"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-card-foreground">Description</Label>
                <Textarea
                  placeholder="Describe what this policy allows or denies"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-card-foreground">Effect</Label>
                <Select
                  value={formData.effect}
                  onValueChange={(value: any) => setFormData({ ...formData, effect: value })}
                >
                  <SelectTrigger className="bg-secondary text-foreground border-border mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-card-foreground">Resources (comma-separated)</Label>
                <Input
                  placeholder="e.g., api:*, billing:*, *"
                  value={formData.resources}
                  onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-card-foreground">Actions (comma-separated)</Label>
                <Input
                  placeholder="e.g., read, write, delete"
                  value={formData.actions}
                  onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
                  className="bg-secondary text-foreground border-border mt-1"
                />
              </div>
              <Button
                onClick={handleCreatePolicy}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Creating..." : "Create Policy"}
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
              placeholder="Search policies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPolicies.map((policy) => (
          <Card key={policy.id} className="border-border bg-card hover:bg-card/80 transition">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{policy.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{policy.description}</p>
                </div>
                <Badge
                  className={
                    policy.effect === "allow"
                      ? "bg-accent/20 text-accent border-accent/30"
                      : "bg-destructive/20 text-destructive border-destructive/30"
                  }
                >
                  {policy.effect}
                </Badge>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Resources</p>
                  <div className="flex flex-wrap gap-1">
                    {policy.resources.map((r) => (
                      <Badge
                        key={r}
                        variant="outline"
                        className="text-xs bg-secondary/50 text-secondary-foreground border-secondary"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Actions</p>
                  <div className="flex flex-wrap gap-1">
                    {policy.actions.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditPolicy(policy)}
                  className="text-muted-foreground hover:text-primary flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePolicy(policy.id)}
                  className="text-muted-foreground hover:text-destructive flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPolicies.length === 0 && (
        <Card className="border-border bg-card/50">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No policies found. Create your first policy to get started.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Edit Policy</DialogTitle>
            <DialogDescription>Update policy configuration</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-card-foreground">Policy Name</Label>
              <Input
                placeholder="e.g., Admin Access"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-card-foreground">Description</Label>
              <Textarea
                placeholder="Describe what this policy allows or denies"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-card-foreground">Effect</Label>
              <Select
                value={formData.effect}
                onValueChange={(value: any) => setFormData({ ...formData, effect: value })}
              >
                <SelectTrigger className="bg-secondary text-foreground border-border mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-card-foreground">Resources (comma-separated)</Label>
              <Input
                placeholder="e.g., api:*, billing:*, *"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
            </div>
            <div>
              <Label className="text-card-foreground">Actions (comma-separated)</Label>
              <Input
                placeholder="e.g., read, write, delete"
                value={formData.actions}
                onChange={(e) => setFormData({ ...formData, actions: e.target.value })}
                className="bg-secondary text-foreground border-border mt-1"
              />
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
            <AlertDialogTitle className="text-card-foreground">Delete Policy</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The policy will be permanently deleted.
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

export default function PoliciesPage() {
  return (
    <Suspense fallback={null}>
      <PoliciesContent />
    </Suspense>
  )
}

"use client"
import { Suspense } from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Filter, Search } from "lucide-react"

const sampleLogs = [
  {
    id: "1",
    timestamp: "2024-01-12 14:23:45",
    user: "alice@company.com",
    action: "CREATE_POLICY",
    resource: "policy-admin-access",
    decision: "ALLOWED",
    reason: "User has admin role",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2024-01-12 14:22:10",
    user: "bob@company.com",
    action: "ACCESS_RESOURCE",
    resource: "billing:report",
    decision: "DENIED",
    reason: "Insufficient permissions",
    ipAddress: "192.168.1.101",
  },
  {
    id: "3",
    timestamp: "2024-01-12 14:21:33",
    user: "carol@company.com",
    action: "LOGIN",
    resource: "auth:system",
    decision: "ALLOWED",
    reason: "Valid credentials",
    ipAddress: "192.168.1.102",
  },
  {
    id: "4",
    timestamp: "2024-01-12 14:20:05",
    user: "alice@company.com",
    action: "DELETE_USER",
    resource: "user-inactive-001",
    decision: "ALLOWED",
    reason: "Admin authorization",
    ipAddress: "192.168.1.100",
  },
]

function AuditContent() {
  const [logs, setLogs] = useState(sampleLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDecision, setFilterDecision] = useState("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDecision = filterDecision === "all" || log.decision === filterDecision

    return matchesSearch && matchesDecision
  })

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Immutable record of all system activities</p>
        </div>
        <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, resource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <Select value={filterDecision} onValueChange={setFilterDecision}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="ALLOWED">Allowed Only</SelectItem>
                <SelectItem value="DENIED">Denied Only</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="border-border text-foreground hover:bg-secondary bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-border bg-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-secondary/30">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Timestamp</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">User</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Action</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Resource</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Decision</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">Reason</th>
                  <th className="px-6 py-3 text-left font-semibold text-card-foreground">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className={`border-b border-border ${idx % 2 === 0 ? "bg-secondary/10" : ""} hover:bg-secondary/20 transition`}
                  >
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{log.timestamp}</td>
                    <td className="px-6 py-4 text-card-foreground">{log.user}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-card-foreground font-mono text-xs">{log.resource}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          log.decision === "ALLOWED"
                            ? "bg-accent/20 text-accent border-accent/30"
                            : "bg-destructive/20 text-destructive border-destructive/30"
                        }
                      >
                        {log.decision}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{log.reason}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{logs.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{logs.filter((l) => l.decision === "ALLOWED").length}</p>
              <p className="text-sm text-muted-foreground mt-1">Allowed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {logs.filter((l) => l.decision === "DENIED").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Denied</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {((logs.filter((l) => l.decision === "ALLOWED").length / logs.length) * 100).toFixed(0)}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Allow Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuditPage() {
  return (
    <Suspense fallback={null}>
      <AuditContent />
    </Suspense>
  )
}

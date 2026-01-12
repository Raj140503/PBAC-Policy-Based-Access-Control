"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Shield, Users, Lock, AlertCircle } from "lucide-react"

const dashboardStats = [
  {
    title: "Total Policies",
    value: "24",
    description: "Active policies",
    icon: Shield,
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Total Users",
    value: "156",
    description: "Registered users",
    icon: Users,
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Access Requests",
    value: "1,234",
    description: "Last 24 hours",
    icon: Lock,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Denied Access",
    value: "8",
    description: "Last 24 hours",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive",
  },
]

const chartData = [
  { name: "Mon", allowed: 240, denied: 24 },
  { name: "Tue", allowed: 221, denied: 12 },
  { name: "Wed", allowed: 229, denied: 8 },
  { name: "Thu", allowed: 200, denied: 15 },
  { name: "Fri", allowed: 240, denied: 10 },
  { name: "Sat", allowed: 229, denied: 22 },
  { name: "Sun", allowed: 200, denied: 5 },
]

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Policy-Based Access Control system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Access Decisions</CardTitle>
            <CardDescription>Allowed vs Denied requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="allowed" fill="hsl(var(--chart-2))" name="Allowed" />
                <Bar dataKey="denied" fill="hsl(var(--chart-5))" name="Denied" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Access Trend</CardTitle>
            <CardDescription>7-day access request trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="allowed" stroke="hsl(var(--chart-2))" name="Allowed" />
                <Line type="monotone" dataKey="denied" stroke="hsl(var(--chart-5))" name="Denied" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
          <CardDescription>Latest authorization events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: "admin@company.com",
                action: "Accessed",
                resource: "billing-report.pdf",
                status: "allowed",
                time: "2 min ago",
              },
              {
                user: "user@company.com",
                action: "Attempted",
                resource: "admin-settings",
                status: "denied",
                time: "5 min ago",
              },
              {
                user: "dev@company.com",
                action: "Accessed",
                resource: "api-keys",
                status: "allowed",
                time: "12 min ago",
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-card-foreground">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.action} <span className="font-mono">{activity.resource}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      activity.status === "allowed" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {activity.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

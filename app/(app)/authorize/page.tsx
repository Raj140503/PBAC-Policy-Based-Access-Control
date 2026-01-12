"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Zap, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api-client"

export default function AuthorizePage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEvaluate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const userId = formData.get("userId")
    const resource = formData.get("resource")
    const action = formData.get("action")

    try {
      const data = await apiClient.post("/authorize", {
        userId,
        resource,
        action,
      })
      setResult(data)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Authorization evaluation failed"
      setError(errorMsg)
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Authorization Test</h1>
        <p className="text-muted-foreground mt-1">Test and evaluate access control policies in real-time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <Card className="lg:col-span-1 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Evaluate Request
            </CardTitle>
            <CardDescription>Test authorization policies</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div>
                <Label htmlFor="userId" className="text-card-foreground">
                  User ID
                </Label>
                <Input
                  id="userId"
                  name="userId"
                  placeholder="user-123"
                  defaultValue="user-1"
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>

              <div>
                <Label htmlFor="resource" className="text-card-foreground">
                  Resource
                </Label>
                <Input
                  id="resource"
                  name="resource"
                  placeholder="billing:report"
                  defaultValue="billing:report"
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>

              <div>
                <Label htmlFor="action" className="text-card-foreground">
                  Action
                </Label>
                <Input
                  id="action"
                  name="action"
                  placeholder="read"
                  defaultValue="read"
                  className="bg-secondary border-border text-foreground mt-1"
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? "Evaluating..." : "Evaluate"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <Alert className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    {result.decision === "ALLOWED" ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-accent" />
                        Access Granted
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-destructive" />
                        Access Denied
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Decision</p>
                    <Badge
                      className={
                        result.decision === "ALLOWED"
                          ? "bg-accent/20 text-accent border-accent/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {result.decision}
                    </Badge>
                  </div>
                  {result.reason && (
                    <div>
                      <p className="text-sm text-muted-foreground">Reason</p>
                      <p className="text-card-foreground">{result.reason}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Example Requests */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm text-card-foreground">Quick Examples</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button
                    onClick={() => {
                      const form = document.querySelector("form") as HTMLFormElement
                      if (form) {
                        form.userId.value = "admin-1"
                        form.resource.value = "system:*"
                        form.action.value = "*"
                        form.dispatchEvent(new Event("submit", { bubbles: true }))
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-secondary hover:bg-secondary/80 text-sm text-foreground transition"
                  >
                    Admin Full Access
                  </button>
                  <button
                    onClick={() => {
                      const form = document.querySelector("form") as HTMLFormElement
                      if (form) {
                        form.userId.value = "viewer-1"
                        form.resource.value = "billing:report"
                        form.action.value = "write"
                        form.dispatchEvent(new Event("submit", { bubbles: true }))
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-secondary hover:bg-secondary/80 text-sm text-foreground transition"
                  >
                    Viewer Write Attempt
                  </button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

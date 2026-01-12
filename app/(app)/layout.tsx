"use client"

import type React from "react"

import { useAuthStore } from "@/lib/auth-store"
import { AppSidebar } from "@/components/app-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}

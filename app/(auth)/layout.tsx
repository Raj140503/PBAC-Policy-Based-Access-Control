import type React from "react"
/**
 * Layout for authentication pages - no sidebar needed
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
}

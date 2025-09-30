import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface NavigationItemProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick: () => void
  variant?: "default" | "medical"
}

export function NavigationItem({ 
  icon: Icon, 
  label, 
  isActive = false, 
  onClick,
  variant = "default"
}: NavigationItemProps) {
  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="lg"
      onClick={onClick}
      className={cn(
        "h-20 flex-col gap-2 transition-all duration-300",
        variant === "medical" && [
          "bg-gradient-primary text-primary-foreground hover:opacity-90",
          "shadow-medical border-0"
        ],
        isActive && variant === "default" && [
          "bg-primary text-primary-foreground",
          "shadow-medical"
        ],
        !isActive && variant === "default" && [
          "hover:bg-accent hover:text-accent-foreground",
          "border border-border hover:border-accent"
        ]
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  )
}

interface NavigationGridProps {
  children: React.ReactNode
  className?: string
}

export function NavigationGrid({ children, className }: NavigationGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 gap-4 md:grid-cols-4",
      className
    )}>
      {children}
    </div>
  )
}
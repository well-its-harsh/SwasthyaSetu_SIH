import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ value, className, showLabel = true }: ProgressBarProps) {
  const getColor = (val: number) => {
    if (val >= 80) return "bg-success"
    if (val >= 60) return "bg-warning" 
    return "bg-destructive"
  }

  const getBackgroundColor = (val: number) => {
    if (val >= 80) return "bg-success-light"
    if (val >= 60) return "bg-warning-light"
    return "bg-destructive-light"
  }

  return (
    <div className={cn("w-full", className)}>
      <div className={cn("h-2 rounded-full", getBackgroundColor(value))}>
        <div 
          className={cn("h-2 rounded-full transition-all duration-300", getColor(value))}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <span className={cn("text-xs font-medium", 
            value >= 80 ? "text-success" : 
            value >= 60 ? "text-warning" : "text-destructive"
          )}>
            {value}%
          </span>
        </div>
      )}
    </div>
  )
}
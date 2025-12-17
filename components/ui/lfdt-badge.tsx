"use client"

import { Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface LFDTBadgeProps {
  className?: string
  variant?: "default" | "inline"
}

export function LFDTBadge({ className, variant = "default" }: LFDTBadgeProps) {
  const disclaimerText = "LF Decentralized Trust governs the GitMesh CE GitHub repository. This website is hosted by Alveoli for community welfare and is not hosted or operated by LFDT."

  if (variant === "inline") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-1.5 py-0.5 rounded cursor-help border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors",
              className
            )}
            role="button"
            tabIndex={0}
            aria-label="LFDT governance information"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                // Tooltip will handle the interaction
              }
            }}
          >
            <Info className="w-3 h-3" aria-hidden="true" />
            <span className="font-medium">LFDT</span>
          </span>
        </TooltipTrigger>
        <TooltipContent
          className="max-w-xs text-sm"
          side="top"
          sideOffset={4}
        >
          <p>{disclaimerText}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "cursor-help bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900 transition-colors",
            className
          )}
          role="button"
          tabIndex={0}
          aria-label="LFDT governance information"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              // Tooltip will handle the interaction
            }
          }}
        >
          <Info className="w-3 h-3 mr-1" aria-hidden="true" />
          LFDT
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        className="max-w-xs text-sm"
        side="top"
        sideOffset={4}
      >
        <p>{disclaimerText}</p>
      </TooltipContent>
    </Tooltip>
  )
}
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, ExternalLink, Shield, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface CodeResult {
  code: string
  description: string
  system: "NAMASTE" | "ICD-11"
  confidence?: number
  explanation?: string
  insuranceEligible?: boolean
  provenance?: {
    validatedBy: string
    date: string
    version: string
  }
}

interface CodeSearchResultProps {
  result: CodeResult
  onAdd: (result: CodeResult) => void
  className?: string
}

export function CodeSearchResult({ result, onAdd, className }: CodeSearchResultProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(`${result.code} - ${result.description}`)
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    })
  }

  const systemColors = {
    NAMASTE: "bg-accent text-accent-foreground",
    "ICD-11": "bg-primary text-primary-foreground"
  }

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-card hover:scale-[1.02]",
      "border-l-4",
      result.system === "NAMASTE" ? "border-l-accent" : "border-l-primary",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={systemColors[result.system]}>
              {result.system}
            </Badge>
            {result.insuranceEligible && (
              <Badge variant="outline" className="text-success border-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Insurance Eligible
              </Badge>
            )}
          </div>
          {result.confidence && (
            <Badge variant="outline" className="text-xs">
              {result.confidence}% match
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{result.code}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-3 leading-relaxed">
          {result.description}
        </p>
        
        {result.explanation && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mb-3">
            💡 {result.explanation}
          </div>
        )}
        
        {result.provenance && (
          <div className="text-xs text-muted-foreground border border-border p-2 rounded mb-3 bg-background/50">
            <Shield className="h-3 w-3 inline mr-1" />
            <span className="font-medium">Validated by:</span> {result.provenance.validatedBy} | 
            <span className="ml-1">{result.provenance.date}</span> | 
            <span className="ml-1">{result.provenance.version}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onAdd(result)}
            className="bg-gradient-success text-success-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Encounter
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
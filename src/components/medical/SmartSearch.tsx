import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CodeSearchResult } from "./CodeSearchResult"

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

interface SmartSearchProps {
  placeholder?: string
  onAddCode: (result: CodeResult) => void
  className?: string
}

// Mock data for demonstration
const mockResults: CodeResult[] = [
  { 
    code: "NMT123", 
    description: "Jwara (Fever)", 
    system: "NAMASTE", 
    confidence: 95,
    explanation: "Matched by direct term 'fever' ↔ 'Jwara'",
    provenance: { validatedBy: "Dr. Sharma", date: "2024-09-15", version: "NAMASTE v2.1" }
  },
  { 
    code: "NMT456", 
    description: "Kasa (Cough)", 
    system: "NAMASTE", 
    confidence: 88,
    explanation: "Matched by synonym 'cough' ↔ 'Kasa'",
    provenance: { validatedBy: "Dr. Singh", date: "2024-09-12", version: "NAMASTE v2.1" }
  },
  { 
    code: "NMT789", 
    description: "Shwasa (Dyspnea)", 
    system: "NAMASTE", 
    confidence: 82,
    explanation: "Related to breathing difficulties",
    provenance: { validatedBy: "Dr. Ayurveda", date: "2024-09-10", version: "NAMASTE v2.1" }
  },
  { 
    code: "ICD11:1A00", 
    description: "Typhoid Fever", 
    system: "ICD-11", 
    confidence: 92,
    explanation: "Associated with fever symptoms",
    insuranceEligible: true,
    provenance: { validatedBy: "Dr. Patel", date: "2024-09-20", version: "ICD-11 v2025" }
  },
  { 
    code: "ICD11:1A01", 
    description: "Viral Fever", 
    system: "ICD-11", 
    confidence: 85,
    explanation: "Common viral fever classification",
    insuranceEligible: true,
    provenance: { validatedBy: "Dr. Kumar", date: "2024-09-18", version: "ICD-11 v2025" }
  },
  { 
    code: "ICD11:1A02", 
    description: "Malaria", 
    system: "ICD-11", 
    confidence: 78,
    explanation: "Parasitic fever condition",
    insuranceEligible: false,
    provenance: { validatedBy: "Dr. Gupta", date: "2024-09-22", version: "ICD-11 v2025" }
  }
]

export function SmartSearch({ placeholder = "Search for medical codes...", onAddCode, className }: SmartSearchProps) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<CodeResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showResults, setShowResults] = React.useState(false)

  // Simulate smart search with debouncing
  React.useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    const timer = setTimeout(() => {
      // Simulate API call with smart matching
      const filtered = mockResults.filter(result => 
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.code.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setShowResults(true)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setShowResults(false)
  }

  const namasteResults = results.filter(r => r.system === "NAMASTE")
  const icdResults = results.filter(r => r.system === "ICD-11")

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-lg"
        />
        {query && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-hidden shadow-medical">
          <CardContent className="p-0">
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No codes found for "{query}"
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-h-96 overflow-y-auto">
                <div className="border-r border-border">
                  <div className="bg-accent p-3 font-semibold text-accent-foreground">
                    NAMASTE Codes ({namasteResults.length})
                  </div>
                  {namasteResults.map((result, index) => (
                    <div key={index} className="border-b border-border last:border-b-0">
                      <div className="p-3 hover:bg-muted/50 cursor-pointer" onClick={() => onAddCode(result)}>
                        <div className="font-medium">{result.code}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                        {result.confidence && (
                          <div className="text-xs text-accent mt-1">{result.confidence}% match</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {namasteResults.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">No NAMASTE codes found</div>
                  )}
                </div>
                <div>
                  <div className="bg-primary p-3 font-semibold text-primary-foreground">
                    ICD-11 Codes ({icdResults.length})
                  </div>
                  {icdResults.map((result, index) => (
                    <div key={index} className="border-b border-border last:border-b-0">
                      <div className="p-3 hover:bg-muted/50 cursor-pointer" onClick={() => onAddCode(result)}>
                        <div className="font-medium">{result.code}</div>
                        <div className="text-sm text-muted-foreground">{result.description}</div>
                        {result.confidence && (
                          <div className="text-xs text-primary mt-1">{result.confidence}% match</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {icdResults.length === 0 && (
                    <div className="p-3 text-sm text-muted-foreground">No ICD-11 codes found</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
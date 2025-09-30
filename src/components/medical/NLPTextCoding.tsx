import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, CheckCircle2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeResult {
  code: string
  description: string
  system: "NAMASTE" | "ICD-11"
  confidence: number
  explanation?: string
  insuranceEligible?: boolean
  provenance?: {
    validatedBy: string
    date: string
    version: string
  }
}

interface NLPTextCodingProps {
  onAddCode: (code: CodeResult) => void
}

// Mock NLP mappings for demo
const nlpMappings: { [key: string]: CodeResult[] } = {
  "fever": [
    { 
      code: "NMT123", 
      description: "Jwara (Fever)", 
      system: "NAMASTE", 
      confidence: 94,
      explanation: "Matched by direct term 'fever' ↔ 'Jwara'",
      provenance: { validatedBy: "Dr. Sharma", date: "2024-09-15", version: "NAMASTE v2.1" }
    },
    { 
      code: "ICD11:1A00", 
      description: "Typhoid Fever", 
      system: "ICD-11", 
      confidence: 87,
      explanation: "Associated with fever symptoms",
      insuranceEligible: true,
      provenance: { validatedBy: "Dr. Patel", date: "2024-09-20", version: "ICD-11 v2025" }
    }
  ],
  "prameha": [
    { 
      code: "NMT789", 
      description: "Prameha (Diabetes)", 
      system: "NAMASTE", 
      confidence: 96,
      explanation: "Direct Ayurvedic terminology match",
      provenance: { validatedBy: "Dr. Ayurveda", date: "2024-09-10", version: "NAMASTE v2.1" }
    },
    { 
      code: "ICD11:5A10", 
      description: "Type 2 Diabetes Mellitus", 
      system: "ICD-11", 
      confidence: 91,
      explanation: "Modern equivalent of traditional Prameha",
      insuranceEligible: true,
      provenance: { validatedBy: "Dr. Kumar", date: "2024-09-18", version: "ICD-11 v2025" }
    }
  ],
  "cough": [
    { 
      code: "NMT456", 
      description: "Kasa (Cough)", 
      system: "NAMASTE", 
      confidence: 93,
      explanation: "Matched by synonym 'cough' ↔ 'Kasa'",
      provenance: { validatedBy: "Dr. Singh", date: "2024-09-12", version: "NAMASTE v2.1" }
    },
    { 
      code: "ICD11:CA40", 
      description: "Respiratory disorders", 
      system: "ICD-11", 
      confidence: 85,
      explanation: "Overlaps with respiratory symptoms group",
      insuranceEligible: false,
      provenance: { validatedBy: "Dr. Gupta", date: "2024-09-22", version: "ICD-11 v2025" }
    }
  ]
}

export function NLPTextCoding({ onAddCode }: NLPTextCodingProps) {
  const [text, setText] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<CodeResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [learningFeedback, setLearningFeedback] = React.useState<string>("")
  const { toast } = useToast()

  const analyzeClinicalText = () => {
    if (!text.trim()) return

    setIsAnalyzing(true)
    
    // Simulate NLP processing
    setTimeout(() => {
      const matchedCodes: CodeResult[] = []
      const lowerText = text.toLowerCase()
      
      // Simple keyword matching for demo
      Object.entries(nlpMappings).forEach(([keyword, codes]) => {
        if (lowerText.includes(keyword)) {
          matchedCodes.push(...codes)
        }
      })
      
      setSuggestions(matchedCodes)
      setIsAnalyzing(false)
      
      if (matchedCodes.length === 0) {
        toast({
          title: "No matches found",
          description: "Try describing symptoms like 'fever', 'cough', or 'prameha'",
        })
      }
    }, 1200)
  }

  const handleAddWithFeedback = (code: CodeResult, accepted: boolean) => {
    if (accepted) {
      onAddCode(code)
      setLearningFeedback("System learned this choice ✓")
      toast({
        title: "Code added to encounter",
        description: `${code.code} - ${code.description}`,
      })
    } else {
      setLearningFeedback("System learned this rejection ✗")
      toast({
        title: "Feedback recorded",
        description: "This mapping will be improved",
      })
    }
    
    // Clear feedback after 3 seconds
    setTimeout(() => setLearningFeedback(""), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type clinical notes here... (e.g., 'Patient has fever and cough symptoms' or 'Showing prameha symptoms')"
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-between items-center">
          <Button 
            onClick={analyzeClinicalText}
            disabled={!text.trim() || isAnalyzing}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Suggest Codes with AI
              </>
            )}
          </Button>
          {learningFeedback && (
            <Badge variant="outline" className="text-xs animate-fade-in">
              {learningFeedback}
            </Badge>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">AI Suggested Codes</h4>
          <div className="grid gap-3">
            {suggestions.map((code, index) => (
              <Card key={index} className="shadow-medical border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={code.system === "NAMASTE" ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}>
                        {code.system}
                      </Badge>
                      {code.insuranceEligible && (
                        <Badge variant="outline" className="text-success border-success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Insurance Eligible
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {code.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">{code.code}</span> - {code.description}
                    </div>
                    
                    {code.explanation && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        💡 {code.explanation}
                      </div>
                    )}
                    
                    {code.provenance && (
                      <div className="text-xs text-muted-foreground border border-border p-2 rounded bg-background/50">
                        <Shield className="h-3 w-3 inline mr-1" />
                        <span className="font-medium">Validated by:</span> {code.provenance.validatedBy} | 
                        <span className="ml-1">{code.provenance.date}</span> | 
                        <span className="ml-1">{code.provenance.version}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => handleAddWithFeedback(code, true)}
                      className="bg-gradient-success text-success-foreground hover:opacity-90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Accept & Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddWithFeedback(code, false)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
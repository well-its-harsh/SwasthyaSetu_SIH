import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search, 
  ArrowRightLeft, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Info,
  Loader2,
  Heart,
  Shield,
  Zap,
  Clock,
  FileText
} from "lucide-react"
import { useEncounter } from "@/contexts/EncounterContext"
import { useToast } from "@/hooks/use-toast"

interface CodeResult {
  code: string
  description: string
  system: "NAMASTE" | "ICD-11"
  confidence?: number
  explanation?: string
  synonyms?: string[]
  definitions?: string[]
  reasoning?: string
}

interface ICDCandidate {
  code: string
  name: string
  confidence: number
  explanation: string
  synonyms: string[]
  definitions: string[]
  reasoning: string
}

interface SearchCodesProps {
  onNavigate: (page: string) => void
}

// Enhanced mock data for demonstration
const mockDiseases = [
  "Jwara (Fever)",
  "Kasa (Cough)", 
  "Shwasa (Dyspnea)",
  "Prameha (Diabetes)",
  "Vata Dosha Imbalance",
  "Pitta Imbalance",
  "Kapha Disorder",
  "Agnimandya (Digestive Fire)",
  "Amavata (Rheumatoid Arthritis)",
  "Kamala (Jaundice)",
  "Arsha (Hemorrhoids)",
  "Grahani (IBS)",
  "Pandu (Anemia)",
  "Madhumeha (Type 2 Diabetes)",
  "Hridroga (Heart Disease)",
  "Shiroroga (Headache)",
  "Netra Roga (Eye Disorders)",
  "Karna Roga (Ear Disorders)",
  "Mukha Roga (Oral Disorders)",
  "Twak Roga (Skin Disorders)"
]

const mockICDCandidates: ICDCandidate[] = [
  {
    code: "ICD11:1A00",
    name: "Typhoid Fever",
    confidence: 94,
    explanation: "High confidence match based on fever symptoms",
    synonyms: ["Enteric fever", "Salmonella typhi infection"],
    definitions: ["A systemic infection caused by Salmonella typhi"],
    reasoning: "Jwara (fever) in Ayurveda commonly refers to systemic fever conditions, with typhoid being a primary differential diagnosis."
  },
  {
    code: "ICD11:1A01", 
    name: "Viral Fever",
    confidence: 87,
    explanation: "Good match for general fever conditions",
    synonyms: ["Viral infection", "Febrile illness"],
    definitions: ["Fever caused by viral infection"],
    reasoning: "Jwara encompasses various fever types, with viral fever being a common presentation in clinical practice."
  },
  {
    code: "ICD11:1A02",
    name: "Malaria",
    confidence: 76,
    explanation: "Moderate match for fever with specific patterns",
    synonyms: ["Plasmodium infection", "Malarial fever"],
    definitions: ["Parasitic disease causing fever"],
    reasoning: "In endemic areas, Jwara often correlates with malaria, especially with characteristic fever patterns."
  }
]

export default function SearchCodes({ onNavigate }: SearchCodesProps) {
  const { addCode, encounterData } = useEncounter()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDiseases, setFilteredDiseases] = useState<string[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null)
  const [icdCandidates, setIcdCandidates] = useState<ICDCandidate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<ICDCandidate | null>(null)
  const [showExplainability, setShowExplainability] = useState(false)
  const [mappingStatus, setMappingStatus] = useState<'none' | 'accepted' | 'rejected'>('none')

  // Filter diseases based on search query
  useEffect(() => {
    if (searchQuery.length < 2) {
      setFilteredDiseases([])
      setShowDropdown(false)
      return
    }

    const filtered = mockDiseases.filter(disease =>
      disease.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredDiseases(filtered)
    setShowDropdown(true)
  }, [searchQuery])

  // Simulate AI mapping when disease is selected
  const handleDiseaseSelect = (disease: string) => {
    setSelectedDisease(disease)
    setSearchQuery(disease)
    setShowDropdown(false)
    setIsLoading(true)
    setMappingStatus('none') // Reset mapping status for new disease

    // Simulate API call
    setTimeout(() => {
      setIcdCandidates(mockICDCandidates)
      setIsLoading(false)
    }, 1000)
  }

  const handleAcceptMapping = (candidate: ICDCandidate) => {
    setMappingStatus('accepted')
    toast({
      title: "Mapping Accepted",
      description: `Top mapping approved: ${candidate.name}`,
    })
  }

  const handleRejectMapping = (candidate: ICDCandidate) => {
    setMappingStatus('rejected')
    toast({
      title: "Mapping Rejected",
      description: `Feedback logged for ${candidate.name}`,
    })
  }

  const handleAddToPatientRecord = (candidate: ICDCandidate) => {
    const namasteCode: CodeResult = {
      code: "NMT123",
      description: selectedDisease || "",
      system: "NAMASTE",
      confidence: 95
    }
    
    const icdCode: CodeResult = {
      code: candidate.code,
      description: candidate.name,
      system: "ICD-11",
      confidence: candidate.confidence
    }

    addCode(namasteCode)
    addCode(icdCode)

    toast({
      title: "Codes successfully added to Encounter Record",
      description: `${selectedDisease} → ${candidate.name}`,
    })

    // Reset state
    setSelectedDisease(null)
    setSearchQuery("")
    setIcdCandidates([])
    setSelectedCandidate(null)
    setMappingStatus('none')
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600 bg-green-50 border-green-200"
    if (confidence >= 75) return "text-blue-600 bg-blue-50 border-blue-200"
    return "text-orange-600 bg-orange-50 border-orange-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Search & Dual Coding
            <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
              Demo Mode
            </Badge>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-assisted mapping between traditional AYUSH and modern ICD-11 systems
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Try searching for any AYUSH condition to see AI-powered dual coding in action. 
              All mappings are pre-configured for demonstration.
            </p>
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for diseases, symptoms, or medical conditions..."
                className="pl-12 pr-4 h-16 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0"
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 animate-spin text-blue-600" />
              )}
            </div>

            {/* Dropdown with filtered diseases */}
            {showDropdown && filteredDiseases.length > 0 && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg border-0 bg-white">
                <CardContent className="p-0">
                  {filteredDiseases.map((disease, index) => (
                    <div
                      key={index}
                      onClick={() => handleDiseaseSelect(disease)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Heart className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{disease}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Dual Coding Widget */}
        {selectedDisease && (
          <div className="max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Dual Coding Analysis
                </CardTitle>
                <p className="text-gray-600">Review AI-suggested mappings for your selected condition</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* NAMASTE Side */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">NAMASTE Code</h3>
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="font-mono text-sm text-green-800 mb-1">NMT123</div>
                        <div className="font-medium text-gray-900">{selectedDisease}</div>
                        <Badge variant="outline" className="mt-2 bg-green-100 text-green-700 border-green-300">
                          Traditional Medicine
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* ICD Mapping Candidates */}
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">ICD-11 Mappings</h3>
                      <p className="text-sm text-gray-600">AI-ranked suggestions with confidence scores</p>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        <span className="ml-2 text-gray-600">Analyzing mappings...</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {icdCandidates.map((candidate, index) => (
                          <Card 
                            key={index}
                            className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                  </div>
                                  <div>
                                    <div className="font-mono text-sm text-blue-800">{candidate.code}</div>
                                    <div className="font-medium text-gray-900">{candidate.name}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`${getConfidenceColor(candidate.confidence)} font-medium`}
                                  >
                                    {candidate.confidence}%
                                  </Badge>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-blue-50"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setSelectedCandidate(candidate)
                                        }}
                                      >
                                        <Info className="h-4 w-4 text-blue-600" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                          <Info className="h-5 w-5 text-blue-600" />
                                          Mapping Explanation
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="font-semibold text-gray-900 mb-2">AI Reasoning</h4>
                                          <p className="text-gray-600">{candidate.reasoning}</p>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-gray-900 mb-2">Synonyms</h4>
                                          <div className="flex flex-wrap gap-2">
                                            {candidate.synonyms.map((synonym, i) => (
                                              <Badge key={i} variant="outline" className="bg-gray-50">
                                                {synonym}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-gray-900 mb-2">Definitions</h4>
                                          <ul className="text-gray-600 space-y-1">
                                            {candidate.definitions.map((def, i) => (
                                              <li key={i} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                {def}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-3">
                                <Progress value={candidate.confidence} className="flex-1 h-2" />
                                <span className="text-xs text-gray-500">Confidence</span>
                              </div>
                              <p className="text-sm text-gray-600">{candidate.explanation}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {icdCandidates.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => handleAcceptMapping(icdCandidates[0])}
                        disabled={mappingStatus !== 'none'}
                        className={`px-8 py-3 rounded-xl transition-all ${
                          mappingStatus === 'accepted'
                            ? 'bg-green-600 text-white opacity-30 cursor-not-allowed'
                            : mappingStatus === 'rejected'
                            ? 'bg-green-600 text-white opacity-30 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        {mappingStatus === 'accepted' ? 'Accepted' : 'Accept Top Mapping'}
                      </Button>
                      <Button
                        onClick={() => handleRejectMapping(icdCandidates[0])}
                        disabled={mappingStatus !== 'none'}
                        variant="outline"
                        className={`px-8 py-3 rounded-xl transition-all ${
                          mappingStatus === 'accepted'
                            ? 'border-red-200 text-red-600 opacity-30 cursor-not-allowed'
                            : mappingStatus === 'rejected'
                            ? 'border-red-200 text-red-600 opacity-30 cursor-not-allowed'
                            : 'border-red-200 text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        {mappingStatus === 'rejected' ? 'Rejected' : 'Reject Mapping'}
                      </Button>
                      <Button
                        onClick={() => handleAddToPatientRecord(icdCandidates[0])}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add to Patient Record
                      </Button>
                    </div>
                    
                    {/* Status Message */}
                    {mappingStatus !== 'none' && (
                      <div className="mt-4 text-center">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                          mappingStatus === 'accepted'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {mappingStatus === 'accepted' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {mappingStatus === 'accepted' 
                              ? 'Mapping approved - Ready to add to patient record' 
                              : 'Mapping rejected - Feedback logged for AI improvement'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Access */}
        {!selectedDisease && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center text-xl font-bold text-gray-900">
                  Quick Access - Common AYUSH Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {mockDiseases.slice(0, 5).map((disease, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleDiseaseSelect(disease)}
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      <Heart className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-medium text-center">{disease}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
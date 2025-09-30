import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Checkbox
} from "@/components/ui/checkbox"
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Plus, 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Users,
  FileText,
  Clock,
  TrendingDown,
  Upload,
  Search,
  Filter
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TranslateCodesProps {
  onNavigate: (page: string) => void
}

interface MappingGap {
  id: string
  namasteCode: string
  namasteName: string
  description: string
  suggestedIcdCodes: {
    code: string
    name: string
    confidence: number
  }[]
  confidence: number
  reason: string
  status: 'pending' | 'rejected' | 'under_review'
  synonyms: string[]
  aiExplanation: string
  lastUpdated: string
}

interface Contribution {
  id: string
  namasteCode: string
  suggestedIcdCode: string
  contributorName: string
  contributorOrg?: string
  notes: string
  status: 'pending' | 'accepted' | 'rejected'
  submittedDate: string
}

// Mock data for mapping gaps
const mockMappingGaps: MappingGap[] = [
  {
    id: "1",
    namasteCode: "NMT234",
    namasteName: "Vata Dosha Imbalance",
    description: "Disturbance in the Vata dosha causing various symptoms including anxiety, insomnia, and digestive issues",
    suggestedIcdCodes: [
      { code: "ICD11:6A70", name: "Generalized anxiety disorder", confidence: 45 },
      { code: "ICD11:7A00", name: "Insomnia", confidence: 38 },
      { code: "ICD11:DD90", name: "Functional digestive disorders", confidence: 42 }
    ],
    confidence: 42,
    reason: "Too generic - Vata imbalance can manifest in multiple ways",
    status: 'pending',
    synonyms: ["Vata Vikriti", "Vata Roga", "Vata Disorder"],
    aiExplanation: "Vata dosha imbalance is a broad concept that can affect multiple body systems, making precise ICD mapping challenging without specific symptoms.",
    lastUpdated: "2024-01-15"
  },
  {
    id: "2",
    namasteCode: "NMT567",
    namasteName: "Agnimandya (Digestive Fire Weakness)",
    description: "Reduced digestive capacity leading to incomplete digestion and metabolic issues",
    suggestedIcdCodes: [
      { code: "ICD11:DD90", name: "Functional digestive disorders", confidence: 65 },
      { code: "ICD11:5C50", name: "Metabolic disorders", confidence: 52 }
    ],
    confidence: 58,
    reason: "Not clinically matching - concept too abstract",
    status: 'rejected',
    synonyms: ["Mandagni", "Weak Digestive Fire", "Poor Metabolism"],
    aiExplanation: "Agnimandya represents a traditional concept of digestive fire that doesn't have a direct modern equivalent, requiring clinical interpretation.",
    lastUpdated: "2024-01-12"
  },
  {
    id: "3",
    namasteCode: "NMT890",
    namasteName: "Amavata (Rheumatoid Arthritis)",
    description: "Autoimmune condition affecting joints with inflammation and pain",
    suggestedIcdCodes: [
      { code: "ICD11:FA20", name: "Rheumatoid arthritis", confidence: 89 },
      { code: "ICD11:FA21", name: "Juvenile rheumatoid arthritis", confidence: 34 }
    ],
    confidence: 89,
    reason: "High confidence but needs validation",
    status: 'under_review',
    synonyms: ["Sandhivata", "Joint Vata", "Rheumatic Disease"],
    aiExplanation: "Amavata closely corresponds to rheumatoid arthritis, but traditional classification includes broader joint-related conditions.",
    lastUpdated: "2024-01-10"
  },
  {
    id: "4",
    namasteCode: "NMT345",
    namasteName: "Kamala (Jaundice)",
    description: "Yellow discoloration of skin and eyes due to liver dysfunction",
    suggestedIcdCodes: [
      { code: "ICD11:DB90", name: "Jaundice", confidence: 78 },
      { code: "ICD11:DB91", name: "Neonatal jaundice", confidence: 25 }
    ],
    confidence: 78,
    reason: "Good match but needs symptom specificity",
    status: 'pending',
    synonyms: ["Pandu", "Yellow Disease", "Liver Disorder"],
    aiExplanation: "Kamala represents jaundice but traditional classification doesn't distinguish between different types of liver dysfunction.",
    lastUpdated: "2024-01-08"
  }
]

const mockContributions: Contribution[] = [
  {
    id: "1",
    namasteCode: "NMT234",
    suggestedIcdCode: "ICD11:6A70",
    contributorName: "Dr. Rajesh Sharma",
    contributorOrg: "All India Institute of Ayurveda",
    notes: "Vata imbalance often presents with anxiety symptoms in clinical practice. Recommend mapping to anxiety disorders.",
    status: 'pending',
    submittedDate: "2024-01-14"
  },
  {
    id: "2",
    namasteCode: "NMT567",
    suggestedIcdCode: "ICD11:DD90",
    contributorName: "Dr. Priya Singh",
    contributorOrg: "National Institute of Ayurveda",
    notes: "Agnimandya should map to functional dyspepsia as it represents impaired digestive function.",
    status: 'accepted',
    submittedDate: "2024-01-11"
  },
  {
    id: "3",
    namasteCode: "NMT890",
    suggestedIcdCode: "ICD11:FA20",
    contributorName: "Dr. Amit Kumar",
    notes: "Amavata is clearly rheumatoid arthritis. High confidence mapping is appropriate.",
    status: 'accepted',
    submittedDate: "2024-01-09"
  }
]

export default function TranslateCodes({ onNavigate }: TranslateCodesProps) {
  const { toast } = useToast()
  const [mappingGaps, setMappingGaps] = useState<MappingGap[]>(mockMappingGaps)
  const [contributions, setContributions] = useState<Contribution[]>(mockContributions)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedGaps, setSelectedGaps] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected' | 'under_review'>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const toggleGapSelection = (id: string) => {
    const newSelected = new Set(selectedGaps)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedGaps(newSelected)
  }

  const handleContributeMapping = (gap: MappingGap) => {
    toast({
      title: "Contribution submitted",
      description: `Mapping suggestion for ${gap.namasteCode} has been submitted for review`,
    })
  }

  const handleBulkApprove = () => {
    toast({
      title: "Bulk approval completed",
      description: `${selectedGaps.size} mappings have been approved`,
    })
    setSelectedGaps(new Set())
  }

  const handleBulkReject = () => {
    toast({
      title: "Bulk rejection completed", 
      description: `${selectedGaps.size} mappings have been rejected`,
    })
    setSelectedGaps(new Set())
  }

  const filteredGaps = mappingGaps.filter(gap => {
    const matchesSearch = gap.namasteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gap.namasteCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || gap.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalNamasteCodes: mappingGaps.length,
    lowConfidenceCodes: mappingGaps.filter(g => g.confidence < 70).length,
    rejectedCodes: mappingGaps.filter(g => g.status === 'rejected').length,
    pendingReviews: mappingGaps.filter(g => g.status === 'pending').length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      case 'under_review': return 'bg-blue-50 text-blue-700 border-blue-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600 bg-green-50 border-green-200'
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapping Gaps Dashboard
            <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
              Demo Mode
            </Badge>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify, review, and contribute to mappings where AI is uncertain or rejected
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Explore sample mapping gaps and community contributions. 
              All data is pre-populated for demonstration purposes.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '0ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total NAMASTE Codes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalNamasteCodes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Codes with &lt;70% confidence</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.lowConfidenceCodes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Codes Rejected by Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejectedCodes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-500 hover:scale-105 hover:shadow-lg border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search NAMASTE codes or names..."
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                  size="sm"
                >
                  Rejected
                </Button>
                <Button
                  variant={statusFilter === 'under_review' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('under_review')}
                  size="sm"
                >
                  Under Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mapping Gaps Table */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">Mapping Gaps</CardTitle>
              {selectedGaps.size > 0 && (
                <div className="flex gap-2">
                  <Button onClick={handleBulkApprove} size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve ({selectedGaps.size})
                  </Button>
                  <Button onClick={handleBulkReject} size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject ({selectedGaps.size})
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredGaps.map((gap, index) => (
                <div key={gap.id} className="border-b border-gray-100 last:border-b-0">
                  <div className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedGaps.has(gap.id)}
                        onCheckedChange={() => toggleGapSelection(gap.id)}
                      />
                      <button
                        onClick={() => toggleRowExpansion(gap.id)}
                        className="flex-1 flex items-center gap-4 text-left"
                      >
                        {expandedRows.has(gap.id) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-mono text-sm text-blue-800 bg-blue-50 px-2 py-1 rounded">
                              {gap.namasteCode}
                            </div>
                            <h3 className="font-semibold text-gray-900">{gap.namasteName}</h3>
                            <Badge variant="outline" className={getStatusColor(gap.status)}>
                              {gap.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{gap.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Confidence:</span>
                              <Badge variant="outline" className={getConfidenceColor(gap.confidence)}>
                                {gap.confidence}%
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">Reason: {gap.reason}</span>
                          </div>
                        </div>
                      </button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleContributeMapping(gap)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Contribute Mapping
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Contribute Mapping for {gap.namasteCode}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Suggested ICD Code</label>
                              <Input placeholder="e.g., ICD11:6A70" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">ICD Description</label>
                              <Input placeholder="e.g., Generalized anxiety disorder" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Notes & Reasoning</label>
                              <Textarea 
                                placeholder="Explain why this mapping is appropriate..."
                                rows={4}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Your Name</label>
                              <Input placeholder="Dr. Your Name" />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Organization (Optional)</label>
                              <Input placeholder="Your Organization" />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              Submit Contribution
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRows.has(gap.id) && (
                    <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">AI Suggested ICD Codes</h4>
                          <div className="space-y-2">
                            {gap.suggestedIcdCodes.map((icd, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div>
                                  <div className="font-mono text-sm text-blue-800">{icd.code}</div>
                                  <div className="text-sm text-gray-600">{icd.name}</div>
                                </div>
                                <Badge variant="outline" className={getConfidenceColor(icd.confidence)}>
                                  {icd.confidence}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                          <div className="space-y-3">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">Synonyms</h5>
                              <div className="flex flex-wrap gap-1">
                                {gap.synonyms.map((synonym, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {synonym}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">AI Explanation</h5>
                              <p className="text-sm text-gray-600">{gap.aiExplanation}</p>
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h5>
                              <p className="text-sm text-gray-600">{gap.lastUpdated}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Validation Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Recent Community Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contributions.map((contribution) => (
                <Card key={contribution.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono text-sm text-blue-800 bg-blue-50 px-2 py-1 rounded">
                        {contribution.namasteCode}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          contribution.status === 'accepted' 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : contribution.status === 'rejected'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }
                      >
                        {contribution.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Suggested:</span>
                        <div className="font-mono text-sm text-gray-900">{contribution.suggestedIcdCode}</div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Contributor:</span>
                        <div className="text-sm text-gray-600">{contribution.contributorName}</div>
                        {contribution.contributorOrg && (
                          <div className="text-xs text-gray-500">{contribution.contributorOrg}</div>
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="text-sm text-gray-600">{contribution.notes}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted: {contribution.submittedDate}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
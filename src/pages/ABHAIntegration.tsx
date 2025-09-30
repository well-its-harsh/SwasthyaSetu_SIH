import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  Users, 
  MapPin,
  Calendar,
  BarChart3,
  Upload,
  Eye,
  Edit,
  ArrowLeft,
  Link,
  Database,
  Globe,
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ABHAIntegrationProps {
  onNavigate: (page: string) => void
}

interface ClaimRecord {
  id: string
  patientName: string
  abhaId: string
  encounterDate: string
  namasteCodes: string[]
  icdCodes: string[]
  claimEligible: boolean
  status: 'ready' | 'pending' | 'submitted' | 'approved' | 'rejected'
}

interface MappingVersion {
  id: string
  namasteCode: string
  icdCode: string
  version: string
  status: 'active' | 'pending' | 'rejected'
  approvedBy: string
  approvedDate: string
}

interface AnalyticsData {
  namasteTrends: { condition: string; count: number; trend: 'up' | 'down' | 'stable' }[]
  icdTrends: { condition: string; count: number; trend: 'up' | 'down' | 'stable' }[]
  regionalData: { region: string; count: number }[]
  demographicData: { ageGroup: string; count: number }[]
}

export default function ABHAIntegration({ onNavigate }: ABHAIntegrationProps) {
  const { toast } = useToast()
  const [isLoaded, setIsLoaded] = useState(false)
  const [abhaToken, setAbhaToken] = useState("DEMO_TOKEN_12345") // Demo token pre-filled
  const [isAuthenticated, setIsAuthenticated] = useState(true) // Demo mode - always authenticated
  const [claimRecords, setClaimRecords] = useState<ClaimRecord[]>([])
  const [mappingVersions, setMappingVersions] = useState<MappingVersion[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    namasteTrends: [],
    icdTrends: [],
    regionalData: [],
    demographicData: []
  })
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set())
  const [exportProgress, setExportProgress] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    // Enhanced demo data with more realistic patient records
    setClaimRecords([
      {
        id: "1",
        patientName: "Rajesh Kumar",
        abhaId: "ABHA1234567890",
        encounterDate: "2024-01-15",
        namasteCodes: ["NMT123", "NMT456"],
        icdCodes: ["ICD11:1A00", "ICD11:CA40"],
        claimEligible: true,
        status: 'ready'
      },
      {
        id: "2",
        patientName: "Priya Sharma",
        abhaId: "ABHA0987654321",
        encounterDate: "2024-01-14",
        namasteCodes: ["NMT789"],
        icdCodes: ["ICD11:5A10"],
        claimEligible: false,
        status: 'pending'
      },
      {
        id: "3",
        patientName: "Amit Patel",
        abhaId: "ABHA5678901234",
        encounterDate: "2024-01-13",
        namasteCodes: ["NMT234", "NMT567"],
        icdCodes: ["ICD11:6A70", "ICD11:DD90"],
        claimEligible: true,
        status: 'submitted'
      },
      {
        id: "4",
        patientName: "Sunita Devi",
        abhaId: "ABHA3456789012",
        encounterDate: "2024-01-12",
        namasteCodes: ["NMT890"],
        icdCodes: ["ICD11:FA20"],
        claimEligible: true,
        status: 'approved'
      },
      {
        id: "5",
        patientName: "Ravi Singh",
        abhaId: "ABHA7890123456",
        encounterDate: "2024-01-11",
        namasteCodes: ["NMT345"],
        icdCodes: ["ICD11:DB90"],
        claimEligible: false,
        status: 'rejected'
      }
    ])

    setMappingVersions([
      {
        id: "1",
        namasteCode: "NMT123",
        icdCode: "ICD11:1A00",
        version: "v2.1",
        status: 'active',
        approvedBy: "Dr. Sharma",
        approvedDate: "2024-01-10"
      },
      {
        id: "2",
        namasteCode: "NMT456",
        icdCode: "ICD11:CA40",
        version: "v2.1",
        status: 'pending',
        approvedBy: "",
        approvedDate: ""
      }
    ])

    setAnalyticsData({
      namasteTrends: [
        { condition: "Prameha (Diabetes)", count: 45, trend: 'up' },
        { condition: "Jwara (Fever)", count: 32, trend: 'stable' },
        { condition: "Vata Dosha", count: 28, trend: 'down' }
      ],
      icdTrends: [
        { condition: "Type 2 Diabetes", count: 42, trend: 'up' },
        { condition: "Typhoid Fever", count: 30, trend: 'stable' },
        { condition: "Anxiety Disorders", count: 25, trend: 'down' }
      ],
      regionalData: [
        { region: "North India", count: 120 },
        { region: "South India", count: 95 },
        { region: "East India", count: 78 },
        { region: "West India", count: 85 }
      ],
      demographicData: [
        { ageGroup: "0-18", count: 45 },
        { ageGroup: "19-35", count: 120 },
        { ageGroup: "36-50", count: 95 },
        { ageGroup: "51-65", count: 78 },
        { ageGroup: "65+", count: 62 }
      ]
    })
  }, [])

  const handleABHAAuthentication = () => {
    if (abhaToken.length < 10) {
      toast({
        title: "Invalid ABHA Token",
        description: "Please enter a valid ABHA token",
        variant: "destructive"
      })
      return
    }

    setIsAuthenticated(true)
    toast({
      title: "ABHA Authentication Successful",
      description: "Connected to Ayushman Bharat Health Account",
    })
  }

  const handleExportClaims = (format: 'abha' | 'insurer') => {
    if (selectedRecords.size === 0) {
      toast({
        title: "No records selected",
        description: "Please select records to export",
        variant: "destructive"
      })
      return
    }

    setExportProgress(0)
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          toast({
            title: "Export completed",
            description: `${selectedRecords.size} records exported in ${format.toUpperCase()} format`,
          })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const toggleRecordSelection = (recordId: string) => {
    const newSelected = new Set(selectedRecords)
    if (newSelected.has(recordId)) {
      newSelected.delete(recordId)
    } else {
      newSelected.add(recordId)
    }
    setSelectedRecords(newSelected)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-50 text-green-700 border-green-200'
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'submitted': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'approved': return 'bg-green-50 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ABHA Integration Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate patient records with ABHA for insurance claims, analytics, and policy reporting
          </p>
        </div>

        {/* ABHA Authentication - Demo Mode */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              ABHA Token Authentication
              <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                Demo Mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                value={abhaToken}
                onChange={(e) => setAbhaToken(e.target.value)}
                placeholder="Enter ABHA token for authentication"
                className="flex-1"
                disabled={isAuthenticated}
              />
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Connected (Demo)</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> You're viewing a demonstration of ABHA integration features. 
                In production, users would need to authenticate with their actual ABHA tokens.
              </p>
            </div>
          </CardContent>
        </Card>

        {isAuthenticated && (
          <div className="space-y-8">
            {/* Claims Packaging Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Insurance Claim Readiness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {claimRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedRecords.has(record.id)}
                            onChange={() => toggleRecordSelection(record.id)}
                            className="rounded"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{record.patientName}</div>
                            <div className="text-sm text-gray-600">{record.abhaId}</div>
                            <div className="text-xs text-gray-500">{record.encounterDate}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {record.claimEligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                          <Badge variant="outline" className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedRecords.size > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleExportClaims('abha')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export ABHA Format
                        </Button>
                        <Button 
                          onClick={() => handleExportClaims('insurer')}
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export Insurer Format
                        </Button>
                      </div>
                      {exportProgress > 0 && exportProgress < 100 && (
                        <div className="mt-3">
                          <Progress value={exportProgress} className="h-2" />
                          <p className="text-sm text-gray-600 mt-1">Exporting... {exportProgress}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real-time Analytics */}
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Real-time Morbidity Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">NAMASTE Conditions Trend</h4>
                      <div className="space-y-2">
                        {analyticsData.namasteTrends.map((trend, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(trend.trend)}
                              <span className="text-sm font-medium">{trend.condition}</span>
                            </div>
                            <span className="text-sm text-gray-600">{trend.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">ICD-11 Conditions Trend</h4>
                      <div className="space-y-2">
                        {analyticsData.icdTrends.map((trend, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(trend.trend)}
                              <span className="text-sm font-medium">{trend.condition}</span>
                            </div>
                            <span className="text-sm text-gray-600">{trend.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional & Demographic Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Regional Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(region.count / 150) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{region.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Demographic Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.demographicData.map((demo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{demo.ageGroup} years</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(demo.count / 150) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{demo.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Mapping Version Control */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Mapping Version Control & Curator UI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mappingVersions.map((mapping) => (
                    <div key={mapping.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-mono text-sm text-blue-800 bg-blue-50 px-2 py-1 rounded">
                            {mapping.namasteCode}
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <div className="font-mono text-sm text-green-800 bg-green-50 px-2 py-1 rounded">
                            {mapping.icdCode}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Version: {mapping.version}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={getStatusColor(mapping.status)}>
                          {mapping.status}
                        </Badge>
                        {mapping.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                        {mapping.status === 'active' && (
                          <div className="text-xs text-gray-500">
                            Approved by {mapping.approvedBy} on {mapping.approvedDate}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Policy Exports for Ministry of AYUSH */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Policy Exports for Ministry of AYUSH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-center gap-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <FileText className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold">CSV Export</div>
                      <div className="text-sm text-gray-600">Download data in CSV format</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-center gap-3 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Upload className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold">API Push</div>
                      <div className="text-sm text-gray-600">Automated reporting to ministry</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-auto p-6 flex flex-col items-center gap-3 border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Settings className="h-8 w-8" />
                    <div className="text-center">
                      <div className="font-semibold">Custom Report</div>
                      <div className="text-sm text-gray-600">Generate custom policy reports</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => onNavigate("dashboard")}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

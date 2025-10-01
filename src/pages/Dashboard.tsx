import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  ArrowRightLeft, 
  Upload, 
  BarChart3, 
  Shield, 
  Database,
  Activity,
  CheckCircle,
  Clock
} from "lucide-react"

interface DashboardProps {
  onNavigate: (page: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])


  const quickActions = [
    {
      title: "Search Codes",
      description: "Find NAMASTE & ICD-11 codes",
      icon: Search,
      onClick: () => onNavigate("search"),
      gradient: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Mapping Gaps",
      description: "Review and improve mappings",
      icon: ArrowRightLeft,
      onClick: () => onNavigate("translate"),
      gradient: "from-green-50 to-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Upload Encounter",
      description: "Create FHIR encounters",
      icon: Upload,
      onClick: () => onNavigate("encounter"),
      gradient: "from-purple-50 to-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Analytics",
      description: "View usage statistics",
      icon: BarChart3,
      onClick: () => onNavigate("analytics"),
      gradient: "from-orange-50 to-orange-100",
      iconColor: "text-orange-600"
    },
    {
      title: "ABHA Integration",
      description: "Insurance & policy reports",
      icon: Shield,
      onClick: () => onNavigate("abha"),
      gradient: "from-red-50 to-red-100",
      iconColor: "text-red-600"
    }
  ]

  const recentActivity = [
    { action: "Prameha → Type 2 Diabetes (ICD11:5A11)", time: "2 min ago", status: "completed" },
    { action: "Vata Dosha → Anxiety Disorder (ICD11:6A70)", time: "5 min ago", status: "completed" },
    { action: "Amavata → Rheumatoid Arthritis (ICD11:FA20)", time: "8 min ago", status: "completed" },
    { action: "Kamala → Jaundice (ICD11:DB90)", time: "12 min ago", status: "completed" },
    { action: "Jwara → Typhoid Fever (ICD11:1A00)", time: "15 min ago", status: "completed" },
    { action: "Demo Patient Record Uploaded", time: "18 min ago", status: "completed" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to SwasthyaNet
              <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
                Demo Mode
              </Badge>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your bridge between traditional AYUSH medicine and modern healthcare systems
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Explore all features with pre-loaded sample data. 
                No authentication required - perfect for testing and evaluation.
              </p>
            </div>
          </div>
        </div>


       
         
          
         
          
         

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title}
              className={`transition-all duration-500 hover:scale-105 hover:shadow-lg cursor-pointer border-0 bg-white/80 backdrop-blur-sm ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              onClick={action.onClick}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <action.icon className={`h-8 w-8 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <Card className={`lg:col-span-2 transition-all duration-700 border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="font-medium text-gray-900">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className={`transition-all duration-700 border-0 bg-white/80 backdrop-blur-sm ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">FHIR R4 Compliance</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI Mapping Engine</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Offline Mode</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database Sync</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                    <Database className="h-3 w-3 mr-1" />
                    Synced
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className={`transition-all duration-700 border-0 bg-gradient-to-br from-blue-50 to-blue-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '600ms' }}>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Search Technology</h3>
              <p className="text-gray-600 text-sm">
                AI-powered search across both NAMASTE and ICD-11 systems with intelligent 
                matching and confidence scoring for accurate medical coding.
              </p>
            </CardContent>
          </Card>
          
          <Card className={`transition-all duration-700 border-0 bg-gradient-to-br from-green-50 to-green-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '700ms' }}>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4">
                <ArrowRightLeft className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapping Gaps Dashboard</h3>
              <p className="text-gray-600 text-sm">
                Identify and improve mappings where AI is uncertain or rejected, 
                enabling community contributions for better accuracy.
              </p>
            </CardContent>
          </Card>
          
          <Card className={`transition-all duration-700 border-0 bg-gradient-to-br from-purple-50 to-purple-100 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '800ms' }}>
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FHIR Compliance</h3>
              <p className="text-gray-600 text-sm">
                Generate standards-compliant FHIR encounters with dual coding 
                for seamless EMR integration in modern healthcare systems.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Users, Activity, Database } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface AnalyticsProps {
  onNavigate: (page: string) => void
}

// Enhanced demo data for analytics
const mappingData = [
  { name: 'Mapped Codes', value: 85, color: '#10b981' },
  { name: 'Unmapped Codes', value: 15, color: '#ef4444' }
]

const systemUsage = [
  { system: 'NAMASTE', encounters: 650, accuracy: 94 },
  { system: 'ICD-11', encounters: 580, accuracy: 97 },
  { system: 'Dual Coded', encounters: 520, accuracy: 91 }
]

const trendData = [
  { month: 'Jan', namaste: 120, icd11: 100, dual: 80 },
  { month: 'Feb', namaste: 150, icd11: 130, dual: 110 },
  { month: 'Mar', namaste: 180, icd11: 160, dual: 140 },
  { month: 'Apr', namaste: 220, icd11: 200, dual: 180 },
  { month: 'May', namaste: 250, icd11: 230, dual: 200 },
  { month: 'Jun', namaste: 280, icd11: 260, dual: 240 },
  { month: 'Jul', namaste: 320, icd11: 290, dual: 270 },
  { month: 'Aug', namaste: 380, icd11: 340, dual: 310 },
  { month: 'Sep', namaste: 420, icd11: 380, dual: 350 }
]

const regionData = [
  { region: 'North India', encounters: 320, accuracy: 93 },
  { region: 'South India', encounters: 280, accuracy: 95 },
  { region: 'West India', encounters: 250, accuracy: 91 },
  { region: 'East India', encounters: 200, accuracy: 89 },
  { region: 'Central India', encounters: 180, accuracy: 92 }
]

const topConditions = [
  { condition: 'Prameha (Diabetes)', namasteCode: 'NMT123', icdCode: 'ICD11:5A11', frequency: 145 },
  { condition: 'Jwara (Fever)', namasteCode: 'NMT456', icdCode: 'ICD11:1A00', frequency: 132 },
  { condition: 'Vata Dosha', namasteCode: 'NMT789', icdCode: 'ICD11:6A70', frequency: 98 },
  { condition: 'Amavata (RA)', namasteCode: 'NMT234', icdCode: 'ICD11:FA20', frequency: 87 },
  { condition: 'Kamala (Jaundice)', namasteCode: 'NMT567', icdCode: 'ICD11:DB90', frequency: 76 }
]

export default function Analytics({ onNavigate }: AnalyticsProps) {
  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate("dashboard")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">
            Analytics Dashboard
            <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
              Demo Mode
            </Badge>
          </h1>
        </div>

        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Database className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1,750</div>
                    <div className="text-sm text-muted-foreground">Total Encounters</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-sm text-muted-foreground">Mapping Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">73</div>
                    <div className="text-sm text-muted-foreground">Active Providers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">520</div>
                    <div className="text-sm text-muted-foreground">Dual Coded</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mapping Gaps Chart */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Code Mapping Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mappingData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mappingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm">Successfully mapped codes (85%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <span className="text-sm">Codes requiring manual review (15%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Usage */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Usage & Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="system" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="encounters" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {systemUsage.map((system, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{system.system}</span>
                        <span className="text-xs text-gray-500">({system.encounters} encounters)</span>
                      </div>
                      <Badge variant="outline">{system.accuracy}% accurate</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Analysis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Usage Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="namaste" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="NAMASTE"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="icd11" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="ICD-11"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="dual" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Dual Coded"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-success/10 rounded-lg">
                  <h4 className="font-semibold text-success mb-1">High Mapping Success</h4>
                  <p className="text-sm text-muted-foreground">85% of codes are successfully mapped with high confidence</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-primary mb-1">Growing Adoption</h4>
                  <p className="text-sm text-muted-foreground">35% increase in dual coding usage over last quarter</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <h4 className="font-semibold text-warning mb-1">Improvement Opportunity</h4>
                  <p className="text-sm text-muted-foreground">15% of codes need manual review and validation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Enhance AI Training</h4>
                    <p className="text-sm text-muted-foreground">Use expert feedback to improve mapping confidence</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold mb-1">Provider Training</h4>
                    <p className="text-sm text-muted-foreground">Focus on dual coding best practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold mb-1">System Integration</h4>
                    <p className="text-sm text-muted-foreground">Expand FHIR compatibility with more EMR systems</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Regional Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{region.region}</div>
                        <div className="text-sm text-gray-600">{region.encounters} encounters</div>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {region.accuracy}% accuracy
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Conditions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Most Frequently Mapped Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topConditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{condition.condition}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-green-700 bg-green-50 px-2 py-1 rounded">
                            {condition.namasteCode}
                          </span>
                          <span className="text-xs text-gray-400">→</span>
                          <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            {condition.icdCode}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{condition.frequency}</div>
                        <div className="text-xs text-gray-500">cases</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Mode Notice */}
          <Card className="shadow-card bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Database className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Demo Mode Active</h3>
                  <p className="text-sm text-blue-700">
                    All analytics data shown is simulated for demonstration purposes. In production, 
                    this dashboard would display real-time data from your healthcare system integrations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
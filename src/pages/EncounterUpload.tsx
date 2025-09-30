import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Code, 
  FileText, 
  CheckCircle, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  Shield,
  AlertTriangle,
  Plus,
  Download,
  Link,
  Eye,
  Edit
} from "lucide-react"
import { useEncounter } from "@/contexts/EncounterContext"
import { useToast } from "@/hooks/use-toast"

interface EncounterUploadProps {
  onNavigate: (page: string) => void
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  extractedData?: {
    patientName?: string
    age?: number
    gender?: string
    diagnosis?: string[]
    medications?: string[]
  }
}

interface PatientInfo {
  name: string
  age: string
  gender: string
  phone: string
  email: string
  address: string
  abhaId: string
  emergencyContact: string
}

export default function EncounterUpload({ onNavigate }: EncounterUploadProps) {
  const { encounterData, removeCode, updateEncounter, clearEncounter, generateFHIR } = useEncounter()
  const { toast } = useToast()
  const [showFHIR, setShowFHIR] = useState(false)
  const [fhirResource, setFhirResource] = useState<object | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: 'Dr. Rajesh Kumar',
    age: '45',
    gender: 'Male',
    phone: '+91-9876543210',
    email: 'rajesh.kumar@example.com',
    address: '123 Medical Colony, New Delhi, India - 110001',
    abhaId: 'ABHA1234567890',
    emergencyContact: '+91-9876543211'
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    // Add some demo uploaded files
    const demoFiles: UploadedFile[] = [
      {
        id: "demo1",
        name: "patient_report_jan2024.pdf",
        size: 2048576,
        type: "application/pdf",
        status: 'completed',
        progress: 100,
        extractedData: {
          patientName: 'Dr. Rajesh Kumar',
          age: 45,
          gender: 'Male',
          diagnosis: ['Prameha (Diabetes)', 'Vata Dosha Imbalance'],
          medications: ['Metformin 500mg', 'Triphala Churna', 'Ashwagandha']
        }
      },
      {
        id: "demo2",
        name: "lab_results_blood_sugar.jpg",
        size: 1024768,
        type: "image/jpeg",
        status: 'completed',
        progress: 100,
        extractedData: {
          patientName: 'Dr. Rajesh Kumar',
          age: 45,
          gender: 'Male',
          diagnosis: ['Elevated Blood Glucose', 'HbA1c: 8.2%'],
          medications: []
        }
      }
    ]
    setUploadedFiles(demoFiles)
  }, [])

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }

      setUploadedFiles(prev => [...prev, newFile])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: Math.min(f.progress + 10, 100) }
            : f
        ))
      }, 200)

      // Simulate completion
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'completed', 
                progress: 100,
                extractedData: {
                  patientName: 'John Doe',
                  age: 45,
                  gender: 'Male',
                  diagnosis: ['Diabetes', 'Hypertension'],
                  medications: ['Metformin', 'Lisinopril']
                }
              }
            : f
        ))
        toast({
          title: "File uploaded successfully",
          description: `Metadata extracted from ${file.name}`,
        })
      }, 2000)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validatePatientInfo = () => {
    const missing = []
    if (!patientInfo.name) missing.push('Name')
    if (!patientInfo.age) missing.push('Age')
    if (!patientInfo.gender) missing.push('Gender')
    if (!patientInfo.phone) missing.push('Phone')
    
    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      })
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePatientInfo()) return
    
    if (encounterData.selectedCodes.length === 0) {
      toast({
        title: "No medical codes selected",
        description: "Please add at least one medical code",
        variant: "destructive"
      })
      return
    }

    const fhir = generateFHIR()
    setFhirResource(fhir)
    setShowFHIR(true)
    
    toast({
      title: "Patient record uploaded successfully!",
      description: `Record stored with dual coding (${encounterData.selectedCodes.length} codes)`,
    })
  }

  const handleExportFHIR = () => {
    if (fhirResource) {
      const blob = new Blob([JSON.stringify(fhirResource, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `encounter-${encounterData.patientId}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: "FHIR resource exported",
        description: "JSON file has been downloaded",
      })
    }
  }

  const systemColors = {
    NAMASTE: "bg-accent text-accent-foreground",
    "ICD-11": "bg-primary text-primary-foreground"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Patient Record Upload
            <Badge variant="outline" className="ml-3 bg-green-50 text-green-700 border-green-200">
              Demo Mode
            </Badge>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload patient documents, capture demographics, and create dual-coded encounter records
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto">
            <p className="text-sm text-blue-700">
              <strong>Demo Mode:</strong> Sample patient data and documents are pre-loaded for demonstration. 
              You can explore all features without uploading actual files.
            </p>
          </div>
        </div>

        {!showFHIR ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload & Patient Info */}
              <div className="space-y-6">
                {/* File Upload Section */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-blue-600" />
                      Upload Patient Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        isDragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Drag & drop files here
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        or click to browse files
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Select Files
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Supports PDF, images, and documents
                      </p>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <h4 className="font-semibold text-gray-900">Uploaded Files</h4>
                        {uploadedFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {file.status === 'uploading' && (
                                <div className="w-20">
                                  <Progress value={file.progress} className="h-2" />
                                </div>
                              )}
                              {file.status === 'completed' && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(file.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Patient Information */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Patient Demographics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={patientInfo.name}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          value={patientInfo.age}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                          placeholder="Enter age"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Input
                          id="gender"
                          value={patientInfo.gender}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, gender: e.target.value }))}
                          placeholder="Male/Female/Other"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={patientInfo.phone}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={patientInfo.email}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="Enter email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="abhaId">ABHA ID</Label>
                        <Input
                          id="abhaId"
                          value={patientInfo.abhaId}
                          onChange={(e) => setPatientInfo(prev => ({ ...prev, abhaId: e.target.value }))}
                          placeholder="Enter ABHA ID"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={patientInfo.address}
                        onChange={(e) => setPatientInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter patient address"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Preview & Codes */}
              <div className="space-y-6">
                {/* Extracted Data Preview */}
                {uploadedFiles.some(f => f.extractedData) && (
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Extracted Data Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {uploadedFiles
                        .filter(f => f.extractedData)
                        .map((file) => (
                          <div key={file.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">{file.name}</span>
                            </div>
                            {file.extractedData && (
                              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Name:</span> {file.extractedData.patientName}
                                  </div>
                                  <div>
                                    <span className="font-medium">Age:</span> {file.extractedData.age}
                                  </div>
                                  <div>
                                    <span className="font-medium">Gender:</span> {file.extractedData.gender}
                                  </div>
                                </div>
                                {file.extractedData.diagnosis && (
                                  <div>
                                    <span className="font-medium text-sm">Diagnosis:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {file.extractedData.diagnosis.map((diag, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {diag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}

                {/* Medical Codes */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-blue-600" />
                        Medical Codes
                      </div>
                      <Badge variant="outline">
                        {encounterData.selectedCodes.length} codes
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {encounterData.selectedCodes.length === 0 ? (
                      <div className="text-center py-8">
                        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No medical codes selected</p>
                        <Button onClick={() => onNavigate("search")} variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Medical Codes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {encounterData.selectedCodes.map((code, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Badge className={code.system === "NAMASTE" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                                {code.system}
                              </Badge>
                              <div>
                                <div className="font-medium text-gray-900">{code.code}</div>
                                <div className="text-sm text-gray-600">{code.description}</div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCode(code.code)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => onNavigate("search")}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <Code className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Map Diagnoses</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <Link className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Link ABHA</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <Download className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Export to ABHA</span>
                      </Button>
                      <Button 
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center gap-2"
                      >
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Send to Insurance</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Section */}
            <div className="mt-8 text-center">
              <Button 
                onClick={handleSubmit}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Patient Record
              </Button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  Patient Record Uploaded Successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{encounterData.selectedCodes.length}</div>
                    <div className="text-sm text-gray-600">Codes Recorded</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">FHIR</div>
                    <div className="text-sm text-gray-600">Compliant</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">Dual</div>
                    <div className="text-sm text-gray-600">Coding</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">ABHA</div>
                    <div className="text-sm text-gray-600">Ready</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleExportFHIR} className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export FHIR JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate("abha")}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    ABHA Integration
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      clearEncounter()
                      setShowFHIR(false)
                      setFhirResource(null)
                      setUploadedFiles([])
                      setPatientInfo({
                        name: '',
                        age: '',
                        gender: '',
                        phone: '',
                        email: '',
                        address: '',
                        abhaId: '',
                        emergencyContact: ''
                      })
                    }}
                  >
                    Start New Record
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
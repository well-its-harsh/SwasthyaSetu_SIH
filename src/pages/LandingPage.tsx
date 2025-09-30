import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Shield, 
  Zap, 
  Globe, 
  ArrowRight, 
  CheckCircle,
  Users,
  FileText,
  Database,
  Smartphone
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit text-blue-700 border-blue-200">
                  FHIR R4 Compliant
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  SwasthyaSetu
                  <span className="block text-blue-600">Bridge to Health</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connecting AYUSH medicine with global healthcare systems through smart, 
                  interoperable coding.
                </p>
              </div>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg"
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Bridge Illustration */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="flex items-center justify-between h-64">
                  {/* Traditional Medicine Side */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Heart className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">AYUSH</div>
                      <div className="text-xs text-gray-500">NAMASTE Codes</div>
                    </div>
                  </div>
                  
                  {/* Bridge */}
                  <div className="flex-1 mx-8 relative">
                    <div className="h-2 bg-gradient-to-r from-green-400 via-blue-500 to-blue-600 rounded-full"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                      <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="text-center mt-4">
                      <div className="text-sm font-semibold text-blue-600">SwasthyaSetu</div>
                    </div>
                  </div>
                  
                  {/* Modern Healthcare Side */}
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">Global Health</div>
                      <div className="text-xs text-gray-500">ICD-11 Standards</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">About SwasthyaSetu</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            SwasthyaSetu is a FHIR R4–compliant terminology microservice designed to seamlessly 
            integrate AYUSH diagnoses (NAMASTE codes) with global ICD-11 standards. It ensures 
            that traditional knowledge is preserved while making it interoperable with insurers, 
            hospitals, and international systems.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Challenge</h2>
            <p className="text-xl text-gray-600">Bridging the gap between traditional and modern healthcare</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AYUSH Doctors</h3>
                <p className="text-sm text-gray-600">Use NAMASTE codes for traditional diagnoses</p>
              </CardContent>
            </Card>
            
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Global Systems</h3>
                <p className="text-sm text-gray-600">Use ICD-11 codes for international standards</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">The Gap</h3>
                <p className="text-sm text-gray-600">Manual mapping leads to delays and exclusions</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
              <p className="text-gray-700 italic">
                <strong>Example:</strong> Prameha (Ayurveda) ≠ Diabetes Mellitus (ICD-11) 
                unless manually explained
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The SwasthyaSetu Bridge</h2>
            <p className="text-xl text-gray-600">Seamless integration between traditional and modern healthcare</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                With SwasthyaSetu, NAMASTE terms and ICD-11 codes are automatically linked 
                and stored in the patient's health record. A doctor can enter a traditional 
                diagnosis, and the system instantly maps it to the equivalent ICD-11 term. 
                This preserves AYUSH authenticity while ensuring compatibility with global 
                health systems.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Instant code mapping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Preserves traditional knowledge</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Global system compatibility</span>
                </div>
              </div>
            </div>
            
            {/* Flow Diagram */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">Doctor</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">SwasthyaSetu</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-700">EMR/Insurance/WHO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Makes SwasthyaSetu Unique</h2>
            <p className="text-xl text-gray-600">Powerful features for seamless healthcare integration</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-blue-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI-Assisted Confidence Scoring</h3>
                <p className="text-sm text-gray-600">Ensures trustworthy code mapping with confidence levels</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Explainable Mapping</h3>
                <p className="text-sm text-gray-600">Shows synonyms, definitions, and reasoning behind mapping</p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Offline-First Mode</h3>
                <p className="text-sm text-gray-600">Works even in rural areas with limited internet</p>
              </CardContent>
            </Card>
            
            <Card className="border-orange-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Curated Common Disease Sets</h3>
                <p className="text-sm text-gray-600">Instant dual-coding for frequent AYUSH conditions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Validation Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <blockquote className="text-2xl text-gray-700 italic leading-relaxed mb-6">
              "Doctors in our network confirmed the need — documentation is slow, coding is 
              confusing, and AYUSH often gets left out. SwasthyaSetu makes their workflow 
              faster and recognized globally."
            </blockquote>
            <div className="text-sm text-gray-500">
              — Healthcare Professionals Network
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Bridge Healthcare?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of integrated healthcare systems
          </p>
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-lg"
            onClick={handleGetStarted}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

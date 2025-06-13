"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Wifi, 
  WifiOff,
  QrCode, 
  Camera, 
  Shield, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Radio,
  RefreshCw,
  Clock,
  FileText,
  Navigation,
  Zap,
  ArrowRight,
  ArrowLeft,
  Upload,
  Settings,
  Bell,
  Home,
  Loader2
} from 'lucide-react';

type InspectionStep = 'start' | 'gps' | 'beacon' | 'qr' | 'form' | 'photo' | 'complete';

type VerificationStatus = 'idle' | 'checking' | 'success' | 'failed' | 'skipped';

interface InspectionState {
  currentStep: InspectionStep;
  gpsStatus: VerificationStatus;
  beaconStatus: VerificationStatus;
  qrStatus: VerificationStatus;
  photoTaken: boolean;
  formData: {
    equipmentCondition: string;
    notes: string;
    temperature: string;
    pressure: string;
  };
  location: string;
  coordinates: { lat: number; lng: number } | null;
  manualOverride: boolean;
  overrideReason: string;
}

const MOCK_LOCATIONS = [
  { id: 'pump-a', name: 'Pump Station A', qrCode: 'QR-PUMP-A-001' },
  { id: 'gen-b', name: 'Generator Room B', qrCode: 'QR-GEN-B-002' },
  { id: 'control', name: 'Main Control Room', qrCode: 'QR-CTRL-003' }
];

export default function InspectionWorkflow() {
  const [isOnline, setIsOnline] = useState(true);
  const [inspection, setInspection] = useState<InspectionState>({
    currentStep: 'start',
    gpsStatus: 'idle',
    beaconStatus: 'idle',
    qrStatus: 'idle',
    photoTaken: false,
    formData: {
      equipmentCondition: '',
      notes: '',
      temperature: '',
      pressure: ''
    },
    location: '',
    coordinates: null,
    manualOverride: false,
    overrideReason: ''
  });

  // Simulate GPS checking
  const checkGPS = () => {
    setInspection(prev => ({ ...prev, gpsStatus: 'checking' }));
    
    setTimeout(() => {
      // Simulate GPS success/failure (70% success rate)
      const success = Math.random() > 0.3;
      if (success) {
        setInspection(prev => ({
          ...prev,
          gpsStatus: 'success',
          coordinates: { lat: 40.7128, lng: -74.0060 },
          currentStep: 'beacon'
        }));
        // Auto-proceed to beacon check
        setTimeout(checkBeacon, 1000);
      } else {
        setInspection(prev => ({ ...prev, gpsStatus: 'failed' }));
      }
    }, 2000);
  };

  // Simulate Beacon detection
  const checkBeacon = () => {
    setInspection(prev => ({ ...prev, beaconStatus: 'checking' }));
    
    setTimeout(() => {
      // Simulate beacon detection (60% success rate)
      const success = Math.random() > 0.4;
      if (success) {
        setInspection(prev => ({
          ...prev,
          beaconStatus: 'success',
          location: 'Pump Station A',
          currentStep: 'form'
        }));
      } else {
        setInspection(prev => ({ 
          ...prev, 
          beaconStatus: 'failed',
          currentStep: 'qr'
        }));
      }
    }, 3000);
  };

  // Simulate QR Code scan
  const scanQR = () => {
    setInspection(prev => ({ ...prev, qrStatus: 'checking' }));
    
    setTimeout(() => {
      const randomLocation = MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)];
      setInspection(prev => ({
        ...prev,
        qrStatus: 'success',
        location: randomLocation.name,
        currentStep: 'form'
      }));
    }, 1500);
  };

  // Handle manual override
  const handleManualOverride = () => {
    if (inspection.overrideReason) {
      setInspection(prev => ({
        ...prev,
        manualOverride: true,
        location: 'Manual Override Location',
        currentStep: 'form'
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (inspection.formData.equipmentCondition && inspection.formData.notes) {
      setInspection(prev => ({ ...prev, currentStep: 'photo' }));
    }
  };

  // Simulate photo capture
  const takePhoto = () => {
    setTimeout(() => {
      setInspection(prev => ({
        ...prev,
        photoTaken: true,
        currentStep: 'complete'
      }));
    }, 1000);
  };

  // Reset inspection
  const startNewInspection = () => {
    setInspection({
      currentStep: 'start',
      gpsStatus: 'idle',
      beaconStatus: 'idle',
      qrStatus: 'idle',
      photoTaken: false,
      formData: {
        equipmentCondition: '',
        notes: '',
        temperature: '',
        pressure: ''
      },
      location: '',
      coordinates: null,
      manualOverride: false,
      overrideReason: ''
    });
  };

  const getStepNumber = (step: InspectionStep): number => {
    const steps = ['start', 'gps', 'beacon', 'qr', 'form', 'photo', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const canProceedToForm = () => {
    return inspection.gpsStatus === 'success' || 
           inspection.qrStatus === 'success' || 
           inspection.manualOverride;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Field Inspector
                </h1>
                <p className="text-xs text-gray-500">Progressive Enforcement Demo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center space-x-2 ${isOnline ? 'text-green-600' : 'text-red-600'}`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Equipment Inspection</h2>
            <Badge variant="outline" className="text-sm">
              Step {getStepNumber(inspection.currentStep)} of 7
            </Badge>
          </div>
          <Progress 
            value={(getStepNumber(inspection.currentStep) / 7) * 100} 
            className="h-2"
          />
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {/* Start Step */}
          {inspection.currentStep === 'start' && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Start New Inspection</CardTitle>
                    <CardDescription>
                      Ready to begin equipment inspection with progressive verification
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="w-4 h-4" />
                    <AlertDescription>
                      This demo will walk you through the progressive enforcement workflow with smart fallbacks.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    onClick={() => {
                      setInspection(prev => ({ ...prev, currentStep: 'gps' }));
                      setTimeout(checkGPS, 500);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    size="lg"
                  >
                    Begin Inspection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* GPS Step */}
          {inspection.currentStep === 'gps' && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Step 1: GPS Location Check</CardTitle>
                      <CardDescription>
                        Verifying your precise location coordinates
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={
                    inspection.gpsStatus === 'checking' ? 'bg-blue-100 text-blue-800' :
                    inspection.gpsStatus === 'success' ? 'bg-green-100 text-green-800' :
                    inspection.gpsStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {inspection.gpsStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspection.gpsStatus === 'checking' && (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="text-blue-800">Acquiring GPS signal...</span>
                    </div>
                  )}
                  
                  {inspection.gpsStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        GPS location verified! Coordinates: {inspection.coordinates?.lat.toFixed(4)}, {inspection.coordinates?.lng.toFixed(4)}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {inspection.gpsStatus === 'failed' && (
                    <div className="space-y-4">
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          Unable to get GPS signal. You can retry or use alternative verification methods.
                        </AlertDescription>
                      </Alert>
                      <div className="flex space-x-3">
                        <Button onClick={checkGPS} variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Retry GPS
                        </Button>
                        <Button 
                          onClick={() => setInspection(prev => ({ ...prev, currentStep: 'beacon' }))}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Use Beacon/QR Fallback
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Beacon Step */}
          {inspection.currentStep === 'beacon' && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <Radio className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Step 2: Bluetooth Beacon Detection</CardTitle>
                      <CardDescription>
                        Scanning for nearby proximity beacons
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={
                    inspection.beaconStatus === 'checking' ? 'bg-purple-100 text-purple-800' :
                    inspection.beaconStatus === 'success' ? 'bg-green-100 text-green-800' :
                    inspection.beaconStatus === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {inspection.beaconStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspection.beaconStatus === 'checking' && (
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                      <span className="text-purple-800">Scanning for beacons... (0-30m range)</span>
                    </div>
                  )}
                  
                  {inspection.beaconStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Beacon detected! Zone registered: {inspection.location}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {inspection.beaconStatus === 'failed' && (
                    <div className="space-y-4">
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          No beacon found within range. Please scan the QR code to continue.
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={() => setInspection(prev => ({ ...prev, currentStep: 'qr' }))}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        Scan QR Code
                        <QrCode className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Step */}
          {inspection.currentStep === 'qr' && (
            <Card className="border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Step 3: QR Code Verification</CardTitle>
                      <CardDescription>
                        Scan the QR code located near the equipment
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={
                    inspection.qrStatus === 'checking' ? 'bg-green-100 text-green-800' :
                    inspection.qrStatus === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {inspection.qrStatus === 'checking' ? 'scanning' : inspection.qrStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspection.qrStatus === 'idle' && (
                    <div className="space-y-4">
                      <div className="p-6 border-2 border-dashed border-green-300 rounded-lg text-center bg-green-50">
                        <QrCode className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <p className="text-green-800 font-medium">Point camera at QR code</p>
                        <p className="text-green-600 text-sm">Look for QR codes on equipment labels or nearby signs</p>
                      </div>
                      <Button onClick={scanQR} className="w-full bg-green-600 hover:bg-green-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Start QR Scan
                      </Button>
                    </div>
                  )}
                  
                  {inspection.qrStatus === 'checking' && (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      <span className="text-green-800">Processing QR code...</span>
                    </div>
                  )}
                  
                  {inspection.qrStatus === 'success' && (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          QR scanned successfully! You&lsquo;re in: <strong>{inspection.location}</strong>
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={() => setInspection(prev => ({ ...prev, currentStep: 'form' }))}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Proceed with Inspection
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Manual Override Option */}
                  <div className="border-t pt-4">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        <span>Can&lsquo;t scan QR code? Manual override</span>
                        <ArrowRight className="w-4 h-4 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                        <Label htmlFor="override-reason">Reason for manual override</Label>
                        <Select onValueChange={(value) => setInspection(prev => ({ ...prev, overrideReason: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="qr-damaged">QR code damaged/unreadable</SelectItem>
                            <SelectItem value="qr-missing">QR code missing</SelectItem>
                            <SelectItem value="camera-issue">Camera not working</SelectItem>
                            <SelectItem value="emergency">Emergency inspection</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleManualOverride}
                          disabled={!inspection.overrideReason}
                          variant="outline"
                          className="w-full"
                        >
                          Continue with Manual Override
                        </Button>
                      </div>
                    </details>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Step */}
          {inspection.currentStep === 'form' && (
            <Card className="border-2 border-indigo-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Step 4: Inspection Form</CardTitle>
                    <CardDescription>
                      Complete the equipment inspection checklist
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="border-indigo-200 bg-indigo-50">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <AlertDescription className="text-indigo-800">
                      <strong>Location:</strong> {inspection.location}
                      {inspection.manualOverride && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800">Manual Override</Badge>
                      )}
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="condition">Equipment Condition *</Label>
                      <Select onValueChange={(value) => 
                        setInspection(prev => ({
                          ...prev,
                          formData: { ...prev.formData, equipmentCondition: value }
                        }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        placeholder="e.g., 72"
                        value={inspection.formData.temperature}
                        onChange={(e) => 
                          setInspection(prev => ({
                            ...prev,
                            formData: { ...prev.formData, temperature: e.target.value }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pressure">Pressure (PSI)</Label>
                    <Input
                      id="pressure"
                      type="number"
                      placeholder="e.g., 45"
                      value={inspection.formData.pressure}
                      onChange={(e) => 
                        setInspection(prev => ({
                          ...prev,
                          formData: { ...prev.formData, pressure: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Inspection Notes *</Label>
                    <Textarea
                      id="notes"
                      placeholder="Describe any observations, issues, or maintenance needs..."
                      rows={4}
                      value={inspection.formData.notes}
                      onChange={(e) => 
                        setInspection(prev => ({
                          ...prev,
                          formData: { ...prev.formData, notes: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <Button 
                    onClick={handleFormSubmit}
                    disabled={!inspection.formData.equipmentCondition || !inspection.formData.notes}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Continue to Photo Capture
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Photo Step */}
          {inspection.currentStep === 'photo' && (
            <Card className="border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Step 5: Photo Evidence (Required)</CardTitle>
                    <CardDescription>
                      Capture visual proof of the equipment condition
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-orange-200 bg-orange-50">
                    <Camera className="w-4 h-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Photo evidence is mandatory and cannot be bypassed. This helps verify inspection authenticity.
                    </AlertDescription>
                  </Alert>

                  {!inspection.photoTaken ? (
                    <div className="space-y-4">
                      <div className="p-8 border-2 border-dashed border-orange-300 rounded-lg text-center bg-orange-50">
                        <Camera className="w-20 h-20 text-orange-600 mx-auto mb-4" />
                        <p className="text-orange-800 font-medium mb-2">Take Equipment Photo</p>
                        <p className="text-orange-600 text-sm">
                          Capture the equipment, surroundings, or any issues noted in your inspection
                        </p>
                      </div>
                      <Button onClick={takePhoto} className="w-full bg-orange-600 hover:bg-orange-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Photo captured successfully! Inspection is ready for submission.
                        </AlertDescription>
                      </Alert>
                      <div className="p-4 bg-gray-100 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">equipment_photo.jpg</p>
                            <p className="text-sm text-gray-600">Captured just now • 2.4 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Complete Step */}
          {inspection.currentStep === 'complete' && (
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-900">Inspection Complete!</CardTitle>
                    <CardDescription className="text-green-700">
                      All verification steps completed successfully
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="border-green-200 bg-green-100">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Inspection submitted successfully! {isOnline ? 'Synced to server.' : 'Queued for sync when online.'}
                    </AlertDescription>
                  </Alert>

                  {/* Inspection Summary */}
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">Inspection Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{inspection.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Condition:</span>
                        <p className="font-medium capitalize">{inspection.formData.equipmentCondition}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Verification:</span>
                        <div className="flex space-x-1">
                          {inspection.gpsStatus === 'success' && <Badge className="bg-blue-100 text-blue-800 text-xs">GPS</Badge>}
                          {inspection.beaconStatus === 'success' && <Badge className="bg-purple-100 text-purple-800 text-xs">Beacon</Badge>}
                          {inspection.qrStatus === 'success' && <Badge className="bg-green-100 text-green-800 text-xs">QR</Badge>}
                          {inspection.manualOverride && <Badge className="bg-amber-100 text-amber-800 text-xs">Manual</Badge>}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Photo:</span>
                        <p className="font-medium text-green-600">✓ Captured</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={startNewInspection} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      New Inspection
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Upload className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Offline Status */}
        {!isOnline && (
          <div className="fixed bottom-4 right-4">
            <Alert className="border-amber-200 bg-amber-50 shadow-lg">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Working offline - inspection will sync when connection returns
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Camera,
    ScanFace,
    Edit3,
    MapPin,
    CheckCircle,
    XCircle,
    RotateCcw,
    ArrowRight,
    ArrowLeft,
    Info,
    Sparkles,
    RefreshCw,
    CreditCard,
    Car,
    IdCard,
    Navigation,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type FlowStep = 1 | 2 | 3 | 4 | "complete";
type SubStep = "intro" | "capture" | "processing" | "result";

interface StepData {
    id: number;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    estimatedTime: string;
}

const steps: StepData[] = [
    { id: 1, title: "Face Liveness", description: "Verify you're a real person", icon: ScanFace, estimatedTime: "2-3 min" },
    { id: 2, title: "Face Matching", description: "Match face with ID document", icon: Camera, estimatedTime: "3-4 min" },
    { id: 3, title: "Handwriting", description: "Verify handwriting sample", icon: Edit3, estimatedTime: "2 min" },
    { id: 4, title: "Location", description: "Capture current location", icon: MapPin, estimatedTime: "1 min" },
];

const documentTypes = [
    { id: "passport", name: "Passport", icon: CreditCard },
    { id: "drivers_license", name: "Driver's License", icon: Car },
    { id: "national_id", name: "National ID", icon: IdCard },
];

function generateVerificationCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "VKYC-";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default function AIAgentVKYCPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    // Flow state
    const [currentStep, setCurrentStep] = React.useState<FlowStep>(1);
    const [subStep, setSubStep] = React.useState<SubStep>("intro");
    const [stepResults, setStepResults] = React.useState<Record<number, "success" | "failed">>({});
    const [stream, setStream] = React.useState<MediaStream | null>(null);

    // Step 1: Face Liveness
    const [livenessInstruction, setLivenessInstruction] = React.useState<string>("Position your face in the oval");

    // Step 2: Face Matching
    const [selectedDocument, setSelectedDocument] = React.useState<string>("");
    const [documentImage, setDocumentImage] = React.useState<string | null>(null);
    const [selfieImage, setSelfieImage] = React.useState<string | null>(null);
    const [matchScore, setMatchScore] = React.useState<number>(0);

    // Step 3: Handwriting
    const [verificationCode, setVerificationCode] = React.useState<string>("");
    const [capturedHandwriting, setCapturedHandwriting] = React.useState<string | null>(null);

    // Step 4: Location
    const [location, setLocation] = React.useState<{
        latitude: number;
        longitude: number;
        address: string;
        city: string;
        country: string;
    } | null>(null);
    const [manualAddress, setManualAddress] = React.useState({ street: "", city: "", country: "" });
    const [locationMode, setLocationMode] = React.useState<"gps" | "manual">("gps");

    React.useEffect(() => {
        setVerificationCode(generateVerificationCode());
    }, []);

    const completedSteps = Object.keys(stepResults).filter(k => stepResults[parseInt(k)] === "success").length;
    const progress = currentStep === "complete" ? 100 : ((completedSteps) / 4) * 100;

    const startCamera = async (facingMode: "user" | "environment" = "user") => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, width: 640, height: 480 },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            toast.error("Camera access denied", {
                description: "Please allow camera access to continue.",
            });
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const captureImage = (): string | null => {
        if (!videoRef.current || !canvasRef.current) return null;
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;
        ctx.drawImage(video, 0, 0);
        return canvas.toDataURL("image/jpeg");
    };

    // Step 1: Face Liveness handlers
    const startLiveness = () => {
        setSubStep("capture");
        startCamera("user");
    };

    const performLivenessCheck = () => {
        setSubStep("processing");
        const instructions = ["Center your face", "Turn left slowly", "Turn right slowly", "Hold still..."];
        let index = 0;
        const interval = setInterval(() => {
            if (index < instructions.length) {
                setLivenessInstruction(instructions[index]);
                index++;
            } else {
                clearInterval(interval);
                stopCamera();
                const success = Math.random() > 0.15;
                setStepResults(prev => ({ ...prev, 1: success ? "success" : "failed" }));
                setSubStep("result");
            }
        }, 1200);
    };

    // Step 2: Face Matching handlers
    const startFaceMatch = () => {
        setSubStep("capture");
    };

    const captureDocument = () => {
        startCamera("environment");
    };

    const handleDocumentCapture = () => {
        const image = captureImage();
        if (image) {
            setDocumentImage(image);
            stopCamera();
            // Now capture selfie
            setTimeout(() => startCamera("user"), 500);
        }
    };

    const handleSelfieCapture = () => {
        const image = captureImage();
        if (image) {
            setSelfieImage(image);
            stopCamera();
            setSubStep("processing");
            // Simulate matching
            setTimeout(() => {
                const score = 70 + Math.random() * 28;
                setMatchScore(score);
                setStepResults(prev => ({ ...prev, 2: score >= 80 ? "success" : "failed" }));
                setSubStep("result");
            }, 2000);
        }
    };

    // Step 3: Handwriting handlers
    const startHandwriting = () => {
        setSubStep("capture");
        startCamera("environment");
    };

    const captureHandwritingImage = () => {
        const image = captureImage();
        if (image) {
            setCapturedHandwriting(image);
            stopCamera();
            setSubStep("processing");
            // Simulate OCR
            setTimeout(() => {
                const success = Math.random() > 0.15;
                setStepResults(prev => ({ ...prev, 3: success ? "success" : "failed" }));
                setSubStep("result");
            }, 2000);
        }
    };

    // Step 4: Location handlers
    const startLocation = () => {
        setSubStep("capture");
    };

    const detectLocation = () => {
        setSubStep("processing");
        if (!navigator.geolocation) {
            setLocationMode("manual");
            setSubStep("capture");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    address: "123 Main Street",
                    city: "San Francisco",
                    country: "United States",
                });
                setStepResults(prev => ({ ...prev, 4: "success" }));
                setSubStep("result");
            },
            () => {
                setLocationMode("manual");
                setSubStep("capture");
                toast.error("Location access denied. Please enter manually.");
            }
        );
    };

    const submitManualAddress = () => {
        if (!manualAddress.street || !manualAddress.city || !manualAddress.country) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setLocation({
            latitude: 0,
            longitude: 0,
            address: manualAddress.street,
            city: manualAddress.city,
            country: manualAddress.country,
        });
        setStepResults(prev => ({ ...prev, 4: "success" }));
        setSubStep("result");
    };

    // Navigation
    const goToNextStep = () => {
        if (currentStep === 4) {
            setCurrentStep("complete");
        } else if (typeof currentStep === "number") {
            setCurrentStep((currentStep + 1) as FlowStep);
            setSubStep("intro");
        }
    };

    const retryCurrentStep = () => {
        setSubStep("intro");
        // Reset step-specific state
        if (currentStep === 2) {
            setDocumentImage(null);
            setSelfieImage(null);
        } else if (currentStep === 3) {
            setCapturedHandwriting(null);
            setVerificationCode(generateVerificationCode());
        } else if (currentStep === 4) {
            setLocation(null);
        }
    };

    React.useEffect(() => {
        return () => stopCamera();
    }, []);

    // Render step content based on current step and sub-step
    const renderStepContent = () => {
        if (currentStep === "complete") {
            return (
                <Card className="border-green-500/20 bg-green-500/5">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle className="h-12 w-12 text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-bold text-green-500">Verification Complete!</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Your AI Agent Video KYC verification has been completed successfully.
                                All 4 steps have been verified.
                            </p>
                            <div className="flex justify-center gap-2 pt-4">
                                <Button onClick={() => router.push("/dashboard")}>
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        const step = steps.find(s => s.id === currentStep)!;
        const stepResult = stepResults[currentStep];

        // Result sub-step (common for all steps)
        if (subStep === "result") {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            {stepResult === "success" ? (
                                <>
                                    <div className="flex justify-center">
                                        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle className="h-10 w-10 text-green-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-500">Step {currentStep} Complete!</h2>
                                    <p className="text-muted-foreground">{step.title} verification successful.</p>
                                    <Button onClick={goToNextStep} className="w-full max-w-xs">
                                        {currentStep === 4 ? "Complete Verification" : "Continue to Next Step"}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <XCircle className="h-10 w-10 text-red-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-red-500">Verification Failed</h2>
                                    <p className="text-muted-foreground">Please try again with better conditions.</p>
                                    <Button onClick={retryCurrentStep} className="w-full max-w-xs">
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Retry Step {currentStep}
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            );
        }

        // Processing sub-step
        if (subStep === "processing") {
            return (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <h2 className="text-xl font-semibold">Processing...</h2>
                            <p className="text-muted-foreground">
                                {currentStep === 1 && livenessInstruction}
                                {currentStep === 2 && "Comparing faces..."}
                                {currentStep === 3 && "Analyzing handwriting..."}
                                {currentStep === 4 && "Detecting location..."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            );
        }

        // Step-specific intro/capture content
        switch (currentStep) {
            case 1: // Face Liveness
                if (subStep === "intro") {
                    return (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ScanFace className="h-5 w-5" />
                                    Step 1: Face Liveness Check
                                </CardTitle>
                                <CardDescription>Verify that you are a real person</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertTitle>Instructions</AlertTitle>
                                    <AlertDescription>
                                        We&apos;ll track your face movements to verify you&apos;re a real person.
                                        Follow the on-screen prompts to turn your head.
                                    </AlertDescription>
                                </Alert>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Ensure good lighting</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Remove glasses/hats</li>
                                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Keep face centered</li>
                                </ul>
                                <Button onClick={startLiveness} className="w-full">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Start Camera
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }
                // Capture
                return (
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-64 border-4 border-white/80 rounded-full border-dashed animate-pulse" />
                                </div>
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <Badge className="bg-black/70 text-white">{livenessInstruction}</Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                <Button onClick={performLivenessCheck} className="w-full">Begin Verification</Button>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 2: // Face Matching
                if (subStep === "intro") {
                    return (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Step 2: Face Matching
                                </CardTitle>
                                <CardDescription>Match your face with your ID document</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Label className="text-sm font-medium">Select Document Type</Label>
                                <RadioGroup value={selectedDocument} onValueChange={setSelectedDocument}>
                                    {documentTypes.map((doc) => (
                                        <div key={doc.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={doc.id} id={doc.id} />
                                            <Label htmlFor={doc.id} className="flex items-center gap-2 cursor-pointer">
                                                <doc.icon className="h-4 w-4" />
                                                {doc.name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <Button onClick={startFaceMatch} className="w-full" disabled={!selectedDocument}>
                                    Continue
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }
                // Capture
                return (
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
                                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${selfieImage ? '' : documentImage ? 'scale-x-[-1]' : ''}`} />
                                {!documentImage && (
                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                        <div className="w-full max-w-md aspect-[1.6/1] border-2 border-white border-dashed rounded-lg" />
                                    </div>
                                )}
                                {documentImage && !selfieImage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 h-64 border-4 border-white/80 rounded-full" />
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-0 right-0 text-center">
                                    <Badge className="bg-black/70 text-white">
                                        {!documentImage ? "Position document in frame" : !selfieImage ? "Take a selfie" : ""}
                                    </Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                {!documentImage ? (
                                    <>
                                        {!stream && <Button onClick={captureDocument} className="w-full">Open Camera for Document</Button>}
                                        {stream && <Button onClick={handleDocumentCapture} className="w-full"><Camera className="mr-2 h-4 w-4" />Capture Document</Button>}
                                    </>
                                ) : !selfieImage ? (
                                    <Button onClick={handleSelfieCapture} className="w-full"><Camera className="mr-2 h-4 w-4" />Capture Selfie</Button>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>
                );

            case 3: // Handwriting
                if (subStep === "intro") {
                    return (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Edit3 className="h-5 w-5" />
                                    Step 3: Handwriting Verification
                                </CardTitle>
                                <CardDescription>Write the code below on paper and take a photo</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative p-6 bg-muted rounded-lg text-center">
                                    <p className="text-3xl font-mono font-bold tracking-widest">{verificationCode}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => setVerificationCode(generateVerificationCode())}
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Write this code clearly on paper using a dark pen, then take a photo.
                                    </AlertDescription>
                                </Alert>
                                <Button onClick={startHandwriting} className="w-full">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Take Photo
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }
                // Capture
                return (
                    <Card>
                        <CardContent className="p-0">
                            <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <div className="w-full max-w-md aspect-[3/1] border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                                        <Badge className="bg-black/70 text-white">{verificationCode}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <Button onClick={captureHandwritingImage} className="w-full">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Capture
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                );

            case 4: // Location
                if (subStep === "intro") {
                    return (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Step 4: Location Capture
                                </CardTitle>
                                <CardDescription>Verify your current location</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center py-6">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <MapPin className="h-10 w-10 text-primary" />
                                    </div>
                                </div>
                                <Alert>
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Your location data is used solely for identity verification purposes.
                                    </AlertDescription>
                                </Alert>
                                <Button onClick={startLocation} className="w-full">
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Continue
                                </Button>
                            </CardContent>
                        </Card>
                    );
                }
                // Capture
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Capture Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {locationMode === "gps" ? (
                                <div className="text-center space-y-4">
                                    <Button onClick={detectLocation} className="w-full">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Detect My Location
                                    </Button>
                                    <Button variant="outline" onClick={() => setLocationMode("manual")} className="w-full">
                                        Enter Manually
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Street Address *</Label>
                                        <Input placeholder="123 Main St" value={manualAddress.street} onChange={(e) => setManualAddress({ ...manualAddress, street: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>City *</Label>
                                        <Input placeholder="City" value={manualAddress.city} onChange={(e) => setManualAddress({ ...manualAddress, city: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Country *</Label>
                                        <Input placeholder="Country" value={manualAddress.country} onChange={(e) => setManualAddress({ ...manualAddress, country: e.target.value })} />
                                    </div>
                                    <Button onClick={submitManualAddress} className="w-full">Submit</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AI Agent VKYC</h1>
                    <p className="text-muted-foreground">Complete all verification steps</p>
                </div>
            </div>

            {/* Progress */}
            {currentStep !== "complete" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Step {currentStep} of 4</span>
                                <span className="text-muted-foreground">{completedSteps} completed</span>
                            </div>
                            <Progress value={progress} className="h-2" />

                            {/* Step indicators */}
                            <div className="flex justify-between">
                                {steps.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${stepResults[step.id] === "success"
                                                ? "bg-green-500 text-white"
                                                : step.id === currentStep
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            }`}>
                                            {stepResults[step.id] === "success" ? <CheckCircle className="h-4 w-4" /> : step.id}
                                        </div>
                                        <span className="text-xs mt-1 text-muted-foreground hidden sm:block">{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Back button */}
            {currentStep !== "complete" && subStep === "intro" && currentStep > 1 && (
                <Button variant="ghost" onClick={() => { setCurrentStep((currentStep - 1) as FlowStep); setSubStep("result"); }}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous Step
                </Button>
            )}
        </div>
    );
}

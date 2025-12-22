"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Camera,
    CheckCircle,
    XCircle,
    RotateCcw,
    CreditCard,
    Car,
    IdCard,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Step = "document-select" | "document-capture" | "selfie-capture" | "comparison" | "result";

interface DocumentType {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

const documentTypes: DocumentType[] = [
    { id: "passport", name: "Passport", icon: CreditCard },
    { id: "drivers_license", name: "Driver's License", icon: Car },
    { id: "national_id", name: "National ID", icon: IdCard },
];

export default function FaceMatchPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [step, setStep] = React.useState<Step>("document-select");
    const [selectedDocument, setSelectedDocument] = React.useState<string>("");
    const [documentImage, setDocumentImage] = React.useState<string | null>(null);
    const [selfieImage, setSelfieImage] = React.useState<string | null>(null);
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const [matchScore, setMatchScore] = React.useState<number>(0);
    const [result, setResult] = React.useState<"success" | "failure" | null>(null);

    const startCamera = React.useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: step === "selfie-capture" ? "user" : "environment", width: 640, height: 480 },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch {
            toast.error("Camera access denied", {
                description: "Please allow camera access to continue.",
            });
        }
    }, [step]);

    const stopCamera = React.useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

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

    const handleDocumentCapture = () => {
        const image = captureImage();
        if (image) {
            setDocumentImage(image);
            stopCamera();
            setStep("selfie-capture");
        }
    };

    const handleSelfieCapture = () => {
        const image = captureImage();
        if (image) {
            setSelfieImage(image);
            stopCamera();
            setStep("comparison");

            // Simulate face matching
            setTimeout(() => {
                const score = 70 + Math.random() * 28;
                setMatchScore(score);
                setResult(score >= 80 ? "success" : "failure");
                setStep("result");
            }, 2000);
        }
    };

    const retry = () => {
        setDocumentImage(null);
        setSelfieImage(null);
        setResult(null);
        setMatchScore(0);
        setStep("document-select");
    };

    React.useEffect(() => {
        if (step === "document-capture" || step === "selfie-capture") {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [step, startCamera, stopCamera]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/kyc")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Face Matching</h1>
                    <p className="text-muted-foreground">Match your face with your ID document</p>
                </div>
            </div>

            {step === "document-select" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Document Type</CardTitle>
                        <CardDescription>Choose the type of ID document you will use</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup value={selectedDocument} onValueChange={setSelectedDocument}>
                            {documentTypes.map((doc) => (
                                <div key={doc.id} className="flex items-center space-x-3 space-y-0">
                                    <RadioGroupItem value={doc.id} id={doc.id} />
                                    <Label htmlFor={doc.id} className="flex items-center gap-2 cursor-pointer">
                                        <doc.icon className="h-5 w-5 text-muted-foreground" />
                                        {doc.name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <Button
                            onClick={() => setStep("document-capture")}
                            className="w-full"
                            disabled={!selectedDocument}
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === "document-capture" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Capture Document</CardTitle>
                        <CardDescription>Position your {selectedDocument.replace("_", " ")} within the frame</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {/* Document Frame Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <div className="w-full max-w-md aspect-[1.6/1] border-2 border-white border-dashed rounded-lg" />
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Align document within the frame
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <Button onClick={handleDocumentCapture} className="w-full">
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Document
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "selfie-capture" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Capture Selfie</CardTitle>
                        <CardDescription>Take a selfie to match with your document photo</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative aspect-[4/3] bg-black rounded-t-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover scale-x-[-1]"
                            />

                            {/* Oval Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-64 border-2 border-white rounded-full" />
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Position your face in the oval
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <Button onClick={handleSelfieCapture} className="w-full">
                                <Camera className="mr-2 h-4 w-4" />
                                Capture Selfie
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "comparison" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <h2 className="text-xl font-semibold">Comparing faces...</h2>
                            <p className="text-muted-foreground">Please wait while we verify your identity</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "result" && (
                <Card>
                    <CardContent className="pt-6">
                        {/* Side by side comparison */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center">
                                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-2">
                                    {documentImage && (
                                        <img src={documentImage} alt="Document" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">Document Photo</p>
                            </div>
                            <div className="text-center">
                                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-2">
                                    {selfieImage && (
                                        <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover scale-x-[-1]" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">Your Selfie</p>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            {result === "success" ? (
                                <>
                                    <div className="flex justify-center">
                                        <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle className="h-8 w-8 text-green-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-green-500">Face Match Successful!</h2>
                                    <p className="text-muted-foreground">
                                        Match confidence: <span className="font-semibold">{matchScore.toFixed(1)}%</span>
                                    </p>
                                    <Button onClick={() => router.push("/kyc")} className="w-full">
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <XCircle className="h-8 w-8 text-red-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold text-red-500">Face Match Failed</h2>
                                    <p className="text-muted-foreground">
                                        Match confidence: <span className="font-semibold">{matchScore.toFixed(1)}%</span> (minimum 80% required)
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => router.push("/kyc")} className="flex-1">
                                            Cancel
                                        </Button>
                                        <Button onClick={retry} className="flex-1">
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Retry
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

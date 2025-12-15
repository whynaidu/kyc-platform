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
    RefreshCw,
    Info,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Step = "instructions" | "capture" | "verifying" | "result";

function generateVerificationCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "KYC-";
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export default function HandwritingPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [step, setStep] = React.useState<Step>("instructions");
    const [verificationCode, setVerificationCode] = React.useState<string>("");
    const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
    const [extractedText, setExtractedText] = React.useState<string>("");
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const [result, setResult] = React.useState<"success" | "failure" | null>(null);

    React.useEffect(() => {
        setVerificationCode(generateVerificationCode());
    }, []);

    const regenerateCode = () => {
        setVerificationCode(generateVerificationCode());
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: 640, height: 480 },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStep("capture");
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

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(video, 0, 0);
        const image = canvas.toDataURL("image/jpeg");
        setCapturedImage(image);
        stopCamera();
        setStep("verifying");

        // Simulate OCR verification
        setTimeout(() => {
            // Simulate extracted text (85% chance of matching)
            const matches = Math.random() > 0.15;
            if (matches) {
                setExtractedText(verificationCode);
                setResult("success");
            } else {
                // Slightly different text for failure
                const wrongCode = verificationCode.slice(0, -1) + (verificationCode.slice(-1) === "A" ? "B" : "A");
                setExtractedText(wrongCode);
                setResult("failure");
            }
            setStep("result");
        }, 2000);
    };

    const retry = () => {
        setCapturedImage(null);
        setExtractedText("");
        setResult(null);
        setStep("instructions");
        regenerateCode();
    };

    React.useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/kyc")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Handwriting Verification</h1>
                    <p className="text-muted-foreground">Verify your identity by writing a code</p>
                </div>
            </div>

            {step === "instructions" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Write This Code</CardTitle>
                        <CardDescription>Write the code below on a piece of paper, then take a photo</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Verification Code Display */}
                        <div className="relative p-6 bg-muted rounded-lg text-center">
                            <p className="text-4xl font-mono font-bold tracking-widest">{verificationCode}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={regenerateCode}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>

                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Instructions</AlertTitle>
                            <AlertDescription>
                                <ol className="list-decimal list-inside space-y-1 mt-2">
                                    <li>Write the code above clearly on a blank piece of paper</li>
                                    <li>Use a dark pen or marker for better visibility</li>
                                    <li>Take a clear photo of the handwritten code</li>
                                    <li>Ensure good lighting and the text is in focus</li>
                                </ol>
                            </AlertDescription>
                        </Alert>

                        <Button onClick={startCamera} className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === "capture" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Capture Handwritten Code</CardTitle>
                        <CardDescription>Position your handwritten code within the frame</CardDescription>
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

                            {/* Frame Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <div className="w-full max-w-md aspect-[3/1] border-2 border-white border-dashed rounded-lg flex items-center justify-center">
                                    <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                                        {verificationCode}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Align handwritten code within the frame
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <Button onClick={captureImage} className="w-full">
                                <Camera className="mr-2 h-4 w-4" />
                                Capture
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "verifying" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <h2 className="text-xl font-semibold">Verifying handwriting...</h2>
                            <p className="text-muted-foreground">Please wait while we extract and verify the text</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "result" && (
                <Card>
                    <CardContent className="pt-6">
                        {/* Captured Image */}
                        {capturedImage && (
                            <div className="mb-6">
                                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden mb-2">
                                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Code Comparison */}
                        <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Original Code</p>
                                <p className="text-xl font-mono font-bold">{verificationCode}</p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">Extracted Text</p>
                                <p className="text-xl font-mono font-bold">{extractedText}</p>
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
                                    <h2 className="text-xl font-bold text-green-500">Verification Successful!</h2>
                                    <p className="text-muted-foreground">
                                        Your handwriting verification has been completed successfully.
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
                                    <h2 className="text-xl font-bold text-red-500">Verification Failed</h2>
                                    <p className="text-muted-foreground">
                                        The extracted text doesn&apos;t match. Please ensure clear handwriting and good lighting.
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

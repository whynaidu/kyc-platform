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
    Info,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Step = "instructions" | "capture" | "result";
type Instruction = "center" | "left" | "right" | "hold";

export default function FaceLivenessPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [step, setStep] = React.useState<Step>("instructions");
    const [instruction, setInstruction] = React.useState<Instruction>("center");
    const [isCapturing, setIsCapturing] = React.useState(false);
    const [result, setResult] = React.useState<"success" | "failure" | null>(null);
    const [stream, setStream] = React.useState<MediaStream | null>(null);

    const instructionMessages: Record<Instruction, string> = {
        center: "Position your face in the oval",
        left: "Turn your head slowly to the left",
        right: "Turn your head slowly to the right",
        hold: "Hold still...",
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 640, height: 480 },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStep("capture");
        } catch (error) {
            toast.error("Camera access denied", {
                description: "Please allow camera access to continue with face liveness check.",
            });
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const simulateLivenessCheck = () => {
        setIsCapturing(true);

        // Simulate liveness check sequence
        const sequence: Instruction[] = ["center", "left", "right", "hold"];
        let index = 0;

        const interval = setInterval(() => {
            if (index < sequence.length) {
                setInstruction(sequence[index]);
                index++;
            } else {
                clearInterval(interval);
                stopCamera();
                // Simulate 85% success rate
                const success = Math.random() > 0.15;
                setResult(success ? "success" : "failure");
                setStep("result");
                setIsCapturing(false);
            }
        }, 1500);
    };

    const retry = () => {
        setResult(null);
        setStep("instructions");
        setInstruction("center");
    };

    React.useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/kyc")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Face Liveness Check</h1>
                    <p className="text-muted-foreground">Verify your identity with a live selfie</p>
                </div>
            </div>

            {step === "instructions" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Before You Begin</CardTitle>
                        <CardDescription>Please follow these instructions for best results</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Important</AlertTitle>
                            <AlertDescription>
                                This process verifies that you are a real person by tracking your face movements.
                            </AlertDescription>
                        </Alert>

                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                Ensure your face is well-lit and clearly visible
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                Remove glasses, hats, or anything covering your face
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                Follow the on-screen instructions to turn your head
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                                Keep your face centered in the oval guide
                            </li>
                        </ul>

                        <Button onClick={startCamera} className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            Start Camera
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === "capture" && (
                <Card>
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
                                <div className="relative">
                                    {/* Dark overlay with oval cutout */}
                                    <svg
                                        className="absolute inset-0 w-full h-full"
                                        viewBox="0 0 640 480"
                                        preserveAspectRatio="xMidYMid slice"
                                    >
                                        <defs>
                                            <mask id="ovalMask">
                                                <rect width="100%" height="100%" fill="white" />
                                                <ellipse cx="320" cy="200" rx="120" ry="160" fill="black" />
                                            </mask>
                                        </defs>
                                        <rect
                                            width="100%"
                                            height="100%"
                                            fill="rgba(0,0,0,0.6)"
                                            mask="url(#ovalMask)"
                                        />
                                        <ellipse
                                            cx="320"
                                            cy="200"
                                            rx="120"
                                            ry="160"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray={isCapturing ? "10,5" : "none"}
                                            className={isCapturing ? "animate-pulse" : ""}
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Instruction Text */}
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {instructionMessages[instruction]}
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <Button
                                onClick={simulateLivenessCheck}
                                className="w-full"
                                disabled={isCapturing}
                            >
                                {isCapturing ? "Verifying..." : "Begin Verification"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "result" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            {result === "success" ? (
                                <>
                                    <div className="flex justify-center">
                                        <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <CheckCircle className="h-10 w-10 text-green-500" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-green-500">Verification Successful!</h2>
                                    <p className="text-muted-foreground">
                                        Your face liveness has been verified successfully.
                                    </p>
                                    <Button onClick={() => router.push("/kyc")} className="w-full">
                                        Continue
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
                                    <p className="text-muted-foreground">
                                        We couldn&apos;t verify your face. Please try again in better lighting conditions.
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

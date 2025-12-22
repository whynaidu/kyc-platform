"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Video, Mic, MicOff, VideoOff, Phone, CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const instructions = [
    "Please show your face clearly to the camera",
    "Now, please show your PAN card to the camera",
    "Hold the PAN card steady for verification",
    "Thank you! Please look at the camera",
    "Verification complete. Thank you!"
];

export default function VideoSessionPage() {
    const router = useRouter();
    const userVideoRef = React.useRef<HTMLVideoElement>(null);
    const streamRef = React.useRef<MediaStream | null>(null);

    const [duration, setDuration] = React.useState(0);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [currentInstruction, setCurrentInstruction] = React.useState("Connecting with agent...");
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const [sessionComplete, setSessionComplete] = React.useState(false);

    // Initialize camera
    React.useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                streamRef.current = mediaStream;
                setStream(mediaStream);
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = mediaStream;
                }
            } catch {
                // Continue without camera for demo
            }
        };
        initCamera();
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Timer and progress simulation
    React.useEffect(() => {
        const timer = setInterval(() => {
            setDuration(prev => prev + 1);
            setProgress(prev => {
                const newProgress = Math.min(100, prev + 1.5);
                // Update instruction based on progress
                const instructionIndex = Math.floor(newProgress / 20);
                if (instructionIndex < instructions.length) {
                    setCurrentInstruction(instructions[instructionIndex]);
                }
                if (newProgress >= 100) {
                    setSessionComplete(true);
                }
                return newProgress;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        stream?.getTracks().forEach(track => track.stop());
        localStorage.setItem('onboarding_video_kyc', 'completed');
        router.push('/onboarding/address-verify');
    };

    if (sessionComplete) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Video KYC Completed</h2>
                    <p className="text-muted-foreground mt-1">वीडियो केवाईसी पूर्ण</p>
                </div>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Your identity has been verified successfully. Session recording has been saved for compliance.
                </p>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Session duration: {formatTime(duration)}</span>
                </div>
                <Button onClick={handleEndCall} size="lg">
                    Continue to Address Verification
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Recording Badge */}
            <div className="flex items-center justify-between">
                <Badge variant="destructive" className="gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Recording
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {formatTime(duration)}
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid gap-4">
                {/* Agent Video (Simulated) */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden border">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-20 rounded-full bg-primary/20 mx-auto mb-3 flex items-center justify-center">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <p className="font-medium">Priya Singh</p>
                            <p className="text-sm text-muted-foreground">KYC Specialist</p>
                        </div>
                    </div>

                    {/* User PiP */}
                    <div className="absolute bottom-4 right-4 w-32 aspect-video bg-muted rounded-lg overflow-hidden border-2 border-background shadow-lg">
                        <video
                            ref={userVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {isVideoOff && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <User className="h-6 w-6 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">{currentInstruction}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 py-4">
                <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button
                    variant={isVideoOff ? "destructive" : "secondary"}
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={() => setIsVideoOff(!isVideoOff)}
                >
                    {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-14 w-14 rounded-full"
                    onClick={handleEndCall}
                >
                    <Phone className="h-6 w-6 rotate-[135deg]" />
                </Button>
            </div>
        </div>
    );
}

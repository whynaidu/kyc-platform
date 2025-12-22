"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Settings,
    Users,
    Clock,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export default function WaitingRoomPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [queuePosition, setQueuePosition] = React.useState(3);
    const [estimatedWait, setEstimatedWait] = React.useState(4);

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                streamRef.current = mediaStream;
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch {
                // Camera access failed
            }
        };

        startCamera();

        // Simulate queue movement
        const interval = setInterval(() => {
            setQueuePosition(prev => {
                const newPos = Math.max(0, prev - 1);
                setEstimatedWait(newPos * 2);
                if (newPos === 0) {
                    clearInterval(interval);
                    // Redirect to call after a brief moment
                    setTimeout(() => {
                        router.push("/video-kyc/call");
                    }, 1500);
                }
                return newPos;
            });
        }, 5000);

        return () => {
            clearInterval(interval);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [router]);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = isMuted;
            });
        }
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = isVideoOff;
            });
        }
        setIsVideoOff(!isVideoOff);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/video-kyc")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Waiting Room</h1>
                    <p className="text-muted-foreground">Prepare for your video call while you wait</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Video Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Video Preview</CardTitle>
                        <CardDescription>Check your camera and lighting</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                            />
                            {isVideoOff && (
                                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                    <VideoOff className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-2">
                            <Button
                                variant={isMuted ? "destructive" : "secondary"}
                                size="icon"
                                onClick={toggleMute}
                            >
                                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant={isVideoOff ? "destructive" : "secondary"}
                                size="icon"
                                onClick={toggleVideo}
                            >
                                {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                            </Button>
                            <Button variant="secondary" size="icon">
                                <Settings className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Queue Status & Settings */}
                <div className="space-y-6">
                    {/* Queue Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Queue Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {queuePosition > 0 ? (
                                <>
                                    <div className="text-center py-4">
                                        <p className="text-4xl font-bold text-primary">{queuePosition}</p>
                                        <p className="text-sm text-muted-foreground">people ahead of you</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                Estimated wait
                                            </span>
                                            <span className="font-medium">{estimatedWait} min</span>
                                        </div>
                                        <Progress value={(3 - queuePosition) / 3 * 100} />
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                                    <p className="text-lg font-semibold text-green-500">Agent is ready!</p>
                                    <p className="text-sm text-muted-foreground">Connecting you now...</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Device Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Device Settings</CardTitle>
                            <CardDescription>Select your camera and microphone</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Camera</Label>
                                <Select defaultValue="default">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select camera" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default Camera</SelectItem>
                                        <SelectItem value="external">External Webcam</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Microphone</Label>
                                <Select defaultValue="default">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select microphone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default Microphone</SelectItem>
                                        <SelectItem value="headset">Headset Mic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Speaker</Label>
                                <Select defaultValue="default">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select speaker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default Speaker</SelectItem>
                                        <SelectItem value="headphones">Headphones</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

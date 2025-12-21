"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Video, Mic, MicOff, VideoOff, Phone, Loader2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WaitingRoomPage() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [queuePosition, setQueuePosition] = React.useState(2);
    const [connecting, setConnecting] = React.useState(false);

    // Initialize camera
    React.useEffect(() => {
        const initCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch {
                // Camera not available - continue with demo
            }
        };

        initCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    // Simulate queue movement
    React.useEffect(() => {
        if (queuePosition > 0) {
            const timer = setInterval(() => {
                setQueuePosition(prev => Math.max(0, prev - 1));
            }, 4000);
            return () => clearInterval(timer);
        } else if (queuePosition === 0) {
            // Auto-connect when it's our turn
            setConnecting(true);
            setTimeout(() => {
                router.push('/onboarding/video-kyc/session');
            }, 2000);
        }
    }, [queuePosition, router]);

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
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Waiting Room</h2>
                <p className="text-muted-foreground">प्रतीक्षा कक्ष</p>
            </div>

            {/* Queue Status */}
            <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-primary" />
                            <div>
                                <p className="font-medium">
                                    {queuePosition === 0 ? 'Connecting you now...' : `Position in queue: ${queuePosition}`}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {queuePosition === 0 ? 'Please wait' : `Estimated wait: ${queuePosition * 2} minutes`}
                                </p>
                            </div>
                        </div>
                        {connecting && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                    </div>
                </CardContent>
            </Card>

            {/* Video Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Your Camera Preview</CardTitle>
                    <CardDescription>Make sure you're clearly visible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {isVideoOff && (
                            <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                <User className="h-16 w-16 text-muted-foreground" />
                            </div>
                        )}
                        <Badge className="absolute top-3 left-3 bg-red-500">
                            ● Preview
                        </Badge>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center gap-4">
                        <Button
                            variant={isMuted ? "destructive" : "secondary"}
                            size="icon"
                            onClick={toggleMute}
                        >
                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant={isVideoOff ? "destructive" : "secondary"}
                            size="icon"
                            onClick={toggleVideo}
                        >
                            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Device Settings */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Device Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Camera</label>
                            <Select defaultValue="default">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select camera" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default Camera</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Microphone</label>
                            <Select defaultValue="default">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select microphone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Default Microphone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tips */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Tips for Video KYC</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• Ensure good lighting on your face</li>
                        <li>• Keep your original PAN card ready</li>
                        <li>• Find a quiet place for clear audio</li>
                        <li>• Avoid back-lighting (windows behind you)</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/video-kyc')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button variant="destructive" onClick={() => {
                    stream?.getTracks().forEach(track => track.stop());
                    router.push('/onboarding/video-kyc');
                }}>
                    <Phone className="h-4 w-4 mr-2" />
                    Leave Queue
                </Button>
            </div>
        </div>
    );
}

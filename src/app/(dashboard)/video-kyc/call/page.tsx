"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    MonitorUp,
    MessageSquare,
    MoreVertical,
    User,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VideoCallPage() {
    const router = useRouter();
    const userVideoRef = React.useRef<HTMLVideoElement>(null);
    const [stream, setStream] = React.useState<MediaStream | null>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [callDuration, setCallDuration] = React.useState(0);

    React.useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                streamRef.current = mediaStream;
                setStream(mediaStream);
                if (userVideoRef.current) {
                    userVideoRef.current.srcObject = mediaStream;
                }
            } catch {
                // Camera access failed
            }
        };

        startCamera();

        // Call duration timer
        const timer = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

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

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        toast.success("Call ended", {
            description: "Your video KYC session has been completed.",
        });
        router.push("/kyc");
    };

    const shareScreen = () => {
        toast.info("Screen sharing", {
            description: "Screen sharing would be initiated here.",
        });
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
                <div className="flex items-center gap-3">
                    <Badge variant="destructive" className="animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-white mr-2" />
                        LIVE
                    </Badge>
                    <span className="text-white text-sm">{formatDuration(callDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                        Recording
                    </Badge>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Report Issue</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Main Video (Agent) */}
            <div className="flex-1 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <div className="text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <User className="h-12 w-12 text-primary" />
                        </div>
                        <p className="text-white text-lg font-medium">Sarah Brown</p>
                        <p className="text-gray-400 text-sm">Verification Agent</p>
                    </div>
                </div>

                {/* User Video (PiP) */}
                <div className="absolute bottom-24 right-4 w-40 md:w-56 aspect-video rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
                    <video
                        ref={userVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`}
                    />
                    {isVideoOff && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <VideoOff className="h-8 w-8 text-gray-500" />
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-center gap-3">
                    <Button
                        variant={isMuted ? "destructive" : "secondary"}
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={toggleMute}
                    >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                        variant={isVideoOff ? "destructive" : "secondary"}
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={toggleVideo}
                    >
                        {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={shareScreen}
                    >
                        <MonitorUp className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        className="h-12 w-12 rounded-full"
                        onClick={endCall}
                    >
                        <PhoneOff className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

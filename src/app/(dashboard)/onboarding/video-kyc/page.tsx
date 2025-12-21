"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Video, Mic, Camera, Volume2, CheckCircle2, Clock, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function VideoKYCPage() {
    const router = useRouter();
    const [queuePosition, setQueuePosition] = React.useState(3);
    const [estimatedWait, setEstimatedWait] = React.useState(5);
    const [permissionsGranted, setPermissionsGranted] = React.useState({
        camera: false,
        microphone: false,
        location: false,
    });
    const [checkingPermissions, setCheckingPermissions] = React.useState(false);

    const allPermissionsGranted = permissionsGranted.camera && permissionsGranted.microphone && permissionsGranted.location;

    const checkPermissions = async () => {
        setCheckingPermissions(true);

        try {
            // Request camera and mic
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setPermissionsGranted(prev => ({ ...prev, camera: true, microphone: true }));
        } catch {
            // Permission denied - continue with demo
            setPermissionsGranted(prev => ({ ...prev, camera: true, microphone: true }));
        }

        try {
            // Request location
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            setPermissionsGranted(prev => ({ ...prev, location: true }));
        } catch {
            // Permission denied - continue with demo
            setPermissionsGranted(prev => ({ ...prev, location: true }));
        }

        setCheckingPermissions(false);
    };

    // Simulate queue movement
    React.useEffect(() => {
        if (queuePosition > 0) {
            const timer = setInterval(() => {
                setQueuePosition(prev => Math.max(0, prev - 1));
                setEstimatedWait(prev => Math.max(0, prev - 2));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, []);

    const handleJoinSession = () => {
        router.push('/onboarding/video-kyc/waiting-room');
    };

    const handleSkipDemo = () => {
        // For demo: Skip video KYC
        localStorage.setItem('onboarding_video_kyc', 'completed');
        router.push('/onboarding/address-verify');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Video KYC Verification</h2>
                <p className="text-muted-foreground">वीडियो केवाईसी सत्यापन</p>
            </div>

            {/* V-CIP Requirements */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        What to Expect
                    </CardTitle>
                    <CardDescription>RBI V-CIP compliant live video verification</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>A trained KYC specialist will verify your identity</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Keep your <strong>original PAN card</strong> ready to show</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Session will be recorded for compliance purposes</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>Ensure good lighting and stable internet</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span>Duration: Approximately 5 minutes</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Permissions Check */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Required Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 rounded-lg border">
                            <Camera className={`h-6 w-6 mx-auto mb-2 ${permissionsGranted.camera ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <p className="text-xs font-medium">Camera</p>
                            {permissionsGranted.camera && <Badge variant="secondary" className="text-xs mt-1">Ready</Badge>}
                        </div>
                        <div className="text-center p-3 rounded-lg border">
                            <Mic className={`h-6 w-6 mx-auto mb-2 ${permissionsGranted.microphone ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <p className="text-xs font-medium">Microphone</p>
                            {permissionsGranted.microphone && <Badge variant="secondary" className="text-xs mt-1">Ready</Badge>}
                        </div>
                        <div className="text-center p-3 rounded-lg border">
                            <MapPin className={`h-6 w-6 mx-auto mb-2 ${permissionsGranted.location ? 'text-green-500' : 'text-muted-foreground'}`} />
                            <p className="text-xs font-medium">Location</p>
                            {permissionsGranted.location && <Badge variant="secondary" className="text-xs mt-1">Ready</Badge>}
                        </div>
                    </div>

                    {!allPermissionsGranted && (
                        <Button onClick={checkPermissions} disabled={checkingPermissions} className="w-full">
                            {checkingPermissions ? 'Checking...' : 'Grant Permissions'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Queue Status */}
            {allPermissionsGranted && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                            <span>Queue Status</span>
                            <Badge variant={queuePosition === 0 ? 'default' : 'secondary'}>
                                {queuePosition === 0 ? 'Your Turn!' : `Position: ${queuePosition}`}
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Estimated wait time</span>
                            <span className="font-medium">{estimatedWait} minutes</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Our specialists are currently assisting other customers. You will be connected shortly.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Security Notice */}
            <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Secure Video Session</AlertTitle>
                <AlertDescription className="text-xs">
                    Your video session is end-to-end encrypted. Geo-location is captured for compliance with RBI V-CIP norms. All data is stored securely in India.
                </AlertDescription>
            </Alert>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/identity-verify')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={handleSkipDemo} className="text-muted-foreground">
                        Skip (Demo)
                    </Button>
                    <Button onClick={handleJoinSession} disabled={!allPermissionsGranted}>
                        Join Video Session
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

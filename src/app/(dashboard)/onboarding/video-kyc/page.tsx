"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Video,
    Mic,
    Camera,
    MapPin,
    CheckCircle2,
    Clock,
    Shield,
    Bot,
    User,
    Sparkles,
    Zap,
    Users,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type VKYCType = "ai_agent" | "human_agent" | null;

export default function VideoKYCPage() {
    const router = useRouter();
    const [vkycType, setVkycType] = React.useState<VKYCType>(null);
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

    // Simulate queue movement for human agent
    React.useEffect(() => {
        if (vkycType === "human_agent" && queuePosition > 0) {
            const timer = setInterval(() => {
                setQueuePosition(prev => Math.max(0, prev - 1));
                setEstimatedWait(prev => Math.max(0, prev - 2));
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [vkycType, queuePosition]);

    const handleJoinSession = () => {
        // Save the selected VKYC type
        localStorage.setItem('onboarding_vkyc_type', vkycType || 'human_agent');

        if (vkycType === "ai_agent") {
            // Use the existing AI Agent VKYC flow
            router.push('/kyc');
        } else {
            router.push('/onboarding/video-kyc/waiting-room');
        }
    };

    const handleSkipDemo = () => {
        // For demo: Skip video KYC
        localStorage.setItem('onboarding_video_kyc', 'completed');
        localStorage.setItem('onboarding_vkyc_type', vkycType || 'skipped');
        router.push('/onboarding/address-verify');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Video KYC Verification</h2>
                <p className="text-muted-foreground">वीडियो केवाईसी सत्यापन</p>
            </div>

            {/* VKYC Type Selection */}
            <Card className="border-primary/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Choose Your Verification Method
                    </CardTitle>
                    <CardDescription>Select how you would like to complete your video KYC</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={vkycType || ""}
                        onValueChange={(value) => setVkycType(value as VKYCType)}
                        className="grid gap-4"
                    >
                        {/* AI Agent Option */}
                        <Label
                            htmlFor="ai_agent"
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-accent",
                                vkycType === "ai_agent"
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <RadioGroupItem value="ai_agent" id="ai_agent" className="mt-1" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                            <Bot className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">AI Agent VKYC</span>
                                                <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs">
                                                    <Sparkles className="h-3 w-3 mr-1" />
                                                    New
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Powered by Advanced AI</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Zap className="h-3.5 w-3.5 text-yellow-500" />
                                            <span>Instant verification</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 text-green-500" />
                                            <span>No wait time</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                                            <span>24/7 available</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Shield className="h-3.5 w-3.5 text-primary" />
                                            <span>RBI compliant</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        Our AI agent will guide you through the verification process automatically.
                                        Quick, efficient, and available round the clock.
                                    </p>
                                </div>
                            </div>
                        </Label>

                        {/* Human Agent Option */}
                        <Label
                            htmlFor="human_agent"
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-accent",
                                vkycType === "human_agent"
                                    ? "border-primary bg-primary/5"
                                    : "border-border"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <RadioGroupItem value="human_agent" id="human_agent" className="mt-1" />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">Live Agent VKYC</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    Human Expert
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Personal video call with KYC specialist</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Users className="h-3.5 w-3.5 text-blue-500" />
                                            <span>Human interaction</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 text-yellow-500" />
                                            <span>~5 min wait time</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>9 AM - 9 PM IST</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Shield className="h-3.5 w-3.5 text-primary" />
                                            <span>RBI V-CIP compliant</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground pt-1">
                                        A trained KYC specialist will conduct your verification via live video call.
                                        Ideal if you prefer personal assistance.
                                    </p>
                                </div>
                            </div>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Show details based on selection */}
            {vkycType && (
                <>
                    {/* What to Expect */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                {vkycType === "ai_agent" ? (
                                    <Bot className="h-4 w-4" />
                                ) : (
                                    <Video className="h-4 w-4" />
                                )}
                                What to Expect
                            </CardTitle>
                            <CardDescription>
                                {vkycType === "ai_agent"
                                    ? "AI-powered automated verification process"
                                    : "RBI V-CIP compliant live video verification"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {vkycType === "ai_agent" ? (
                                    <>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>AI will guide you through each verification step</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Show your <strong>original PAN card</strong> when prompted</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Complete face liveness detection automatically</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Answer simple voice prompts for verification</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <span>Duration: Approximately 2-3 minutes</span>
                                        </li>
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}
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

                    {/* Queue Status - Only for Human Agent */}
                    {vkycType === "human_agent" && allPermissionsGranted && (
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

                    {/* AI Agent Ready Status */}
                    {vkycType === "ai_agent" && allPermissionsGranted && (
                        <Card className="border-green-500/30 bg-green-500/5">
                            <CardContent className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-700 dark:text-green-400">AI Agent Ready</p>
                                        <p className="text-xs text-muted-foreground">
                                            No queue - Start your verification instantly
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
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
                    <Button
                        onClick={handleJoinSession}
                        disabled={!vkycType || !allPermissionsGranted}
                    >
                        {vkycType === "ai_agent" ? "Start AI Verification" : "Join Video Session"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
